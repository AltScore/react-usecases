import {combineReducers, configureStore, createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector} from 'react-redux';
import {UsecaseData} from "@/lib/usecases-ui/Usecase";
import {TaskDefinition, TaskDefinitionClass} from "@/lib/usecases-ui/taskDefinition";
import {TaskInstanceConfiguration, TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";
import {FC} from "react";
import { v4 as uuidv4 } from 'uuid';

export type TaskGatewaysBuilder = (slots: any) => AliasRecord<string>

export type TaskLogic = {
    component: FC<TaskInstanceProps>;
    gatewaysBuilder: TaskGatewaysBuilder | null;
}
// singleton initializer of usecases
class UsecasesAppClass {
    apps: AliasRecord<{
        tasksLogic: AliasRecord<TaskLogic>,
        taskDefinitions: AliasRecord<TaskDefinition>,
    }>

    constructor() {
        this.apps = {}
    }

    registerApp(appName: string, tasksLogic: AliasRecord<TaskLogic>, taskDefinitions: AliasRecord<TaskDefinition>) {
        // if app is already registered, ignore
        if (appName in this.apps) {
            return
        }
        this.apps[appName] = {
            tasksLogic,
            taskDefinitions,
        }
        console.log(`usecases-ui: app '${appName}' correctly registered.`)
    }

    getTaskComponent(appName: string, taskName: string): FC<TaskInstanceProps> {
        if (!(appName in this.apps)) {
            throw new Error(`App ${appName} not found`)
        }
        const app = this.apps[appName]
        if (!(taskName in app.tasksLogic)) {
            throw new Error(`Task ${taskName} not found in app ${appName}`)
        }
        return app.tasksLogic[taskName].component
    }

    getTaskGatewaysBuilder(appName: string, taskName: string): TaskGatewaysBuilder | null {
        if (!(appName in this.apps)) {
            throw new Error(`App ${appName} not found`)
        }
        const app = this.apps[appName]
        if (!(taskName in app.tasksLogic)) {
            throw new Error(`Task ${taskName} not found in app ${appName}`)
        }
        return app.tasksLogic[taskName].gatewaysBuilder
    }
}

export const usecasesAppClass = new UsecasesAppClass()

export function initUsecasesApp(appName: string, tasksLogic: AliasRecord<TaskLogic>, taskDefinitions: AliasRecord<TaskDefinition>) {
    usecasesAppClass.registerApp(appName, tasksLogic, taskDefinitions)
    console.log(`usecases-ui: app '${appName}' correctly initialized.`)
}

/* HELPERS */

export class UsecasesStateClass {
    usecasesState: UsecasesState

    constructor(usecasesState: UsecasesState) {
        this.usecasesState = usecasesState
    }

    getUsecaseData(usecaseId: string): UsecaseData {
        for (const usecaseData of this.usecasesState.usecasesData) {
            if (usecaseData.id === usecaseId) {
                return usecaseData;
            }
        }
        throw new Error(`Usecase ${usecaseId} not found`);
    }

    initializeUsecaseState(usecaseId: string): UsecaseState {
        return this.usecaseClass(usecaseId).initializeUsecaseState();
    }

    usecaseClass(usecaseId: string): UsecaseClass {
        const usecaseData = this.getUsecaseData(usecaseId);
        return new UsecaseClass(
            this.usecasesState.appName,
            usecaseData,
            this.usecasesState.tasksDefinitions
        );
    }

    validateUsecasesData(usecasesData: UsecaseData[]) {
        // if there are no task definitions, we can't validate anything
        if (Object.keys(this.usecasesState.tasksDefinitions).length === 0) {
            throw new Error('No task definitions found. Set task definitions first.');
        }
    }
}

export class UsecaseClass {
    appName: string
    usecaseData: UsecaseData
    taskDefinitions: AliasRecord<TaskDefinition>

    constructor(
        appName: string,
        usecaseData: UsecaseData,
        taskDefinitions: AliasRecord<TaskDefinition>,
    ) {
        this.appName = appName
        this.usecaseData = usecaseData
        this.taskDefinitions = taskDefinitions
    }


    getTaskInstanceConfig(instanceAlias: string): TaskInstanceConfiguration {
        if (!(instanceAlias in this.usecaseData.taskInstances)) {
            throw new Error(`Task instance ${instanceAlias} not found in usecase ${this.usecaseData.name}`);
        }
        return this.usecaseData.taskInstances[instanceAlias];
    }

    getTaskDefinition(type: string): TaskDefinition {
        if (!(type in this.taskDefinitions)) {
            throw new Error(`Task type ${type} not found in usecase ${this.usecaseData.name}`);
        }
        return this.taskDefinitions[type];
    }

    taskDefinitionFromInstanceAlias(instanceAlias: string): TaskDefinition {
        const taskInstance = this.getTaskInstanceConfig(instanceAlias)
        return this.getTaskDefinition(taskInstance.type);
    }

    initializeTaskStateForUsecaseStartup(instanceAlias: string): TaskState {
        const taskDefinition = this.taskDefinitionFromInstanceAlias(instanceAlias);
        const taskDefinitionClass = new TaskDefinitionClass(taskDefinition);
        const taskState = taskDefinitionClass.newTaskInstanceState(instanceAlias);
        if (this.usecaseData.rootTaskInstanceAlias === instanceAlias) {
            taskState.status = TaskStatus.ACTIVE;
            taskState.input = this.usecaseData.rootTaskInstanceInput;
            taskState.referrerAlias = SystemAlias.RootTask;
        }
        taskState.gateways = this.initializeTaskGateways(instanceAlias);
        return taskState;
    }

    initializeTaskGateways(instanceAlias: string): AliasRecord<string> {
        const taskInstanceConfig = this.getTaskInstanceConfig(instanceAlias)
        const taskGatewaysBuilder = usecasesAppClass.getTaskGatewaysBuilder(this.appName, taskInstanceConfig.type);
        if (taskGatewaysBuilder === null) {
            console.warn(`No gateways builder found for task ${taskInstanceConfig.type}, setting as {}`)
            return {}
        }
        // the task knows how to convert its slots into the gateways
        return taskGatewaysBuilder(this.usecaseData.taskInstances[instanceAlias].slots);
    }

    // newUsecaseState
    initializeUsecaseState(): UsecaseState {
        return {
            usecaseData: this.usecaseData,
            currentTask: this.usecaseData.rootTaskInstanceAlias,
            tasksStates: this.initializeUsecaseTaskStates(),
        }
    }

    initializeUsecaseTaskStates(): AliasRecord<TaskState> {
        const taskInstanceAliases = Object.keys(this.usecaseData.taskInstances);
        return taskInstanceAliases.reduce(
            (tasksStates: AliasRecord<TaskState>, taskInstanceAlias: string) => {
                return {
                    ...tasksStates,
                    [taskInstanceAlias]: this.initializeTaskStateForUsecaseStartup(taskInstanceAlias),
                }
            }, {}
        )
    }
}

export class UsecaseStateClass {
    usecaseState: UsecaseState
    taskDefinitions: AliasRecord<TaskDefinition>
    usecaseClass: UsecaseClass

    constructor(usecaseState: UsecaseState, taskDefinitions: AliasRecord<TaskDefinition>, appName: string) {
        this.usecaseState = usecaseState
        this.taskDefinitions = taskDefinitions
        this.usecaseClass = new UsecaseClass(
            appName,
            usecaseState.usecaseData,
            taskDefinitions,
        )
    }

    getTaskState(taskAlias: string): TaskState {
        if (!(taskAlias in this.usecaseState.tasksStates)) {
            throw new Error(`Status of task "${taskAlias}" not found in usecase ${this.usecaseState.usecaseData.name}`);
        }
        return this.usecaseState.tasksStates[taskAlias];
    }

}


/* TYPES */
export type AliasRecord<T> = {
    [key: string]: T;
}

export enum TaskStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export type TaskState = {
    taskAlias: string;
    status: TaskStatus;
    input: AliasRecord<any>;
    // gateway_alias: task-implementer-defined -> task_alias: flow-orchestrator-agent-defined
    gateways: AliasRecord<string>;
    // null only if it is root task or hasn't been activated yet
    referrerAlias: string | null;
}

export type UsecasesState<ActiveStatus extends boolean = any, ActiveTask extends boolean = any> = {
    appName: string;
    tasksDefinitions: AliasRecord<TaskDefinition>;
    usecasesData: UsecaseData[];
    currentUsecaseState: ActiveStatus extends true ? UsecaseState<ActiveTask> : null
}

export type UsecaseState<ActiveTask extends boolean = any> = {
    usecaseData: UsecaseData;
    currentTask: ActiveTask extends true ? string : null;
    tasksStates: AliasRecord<TaskState>
}
/* STATE VALIDATORS */

const validate_activeUsecase = (state: UsecasesState) => {
    if (state.currentUsecaseState === null) {
        throw new Error('No usecase selected');
    }
}

const validate_activeTask = (state: UsecasesState<true>) => {
    if (state.currentUsecaseState.currentTask === null) {
        throw new Error('No task selected');
    }
}

const validate_noActiveTask = (state: UsecasesState<true>) => {
    if (state.currentUsecaseState.currentTask !== null) {
        throw new Error('A task is already active');
    }
}

/* REDUCERS */


// # tooling

const reducer = <T>(validators: ((state: UsecasesState) => void)[], reducer: (state: UsecasesState, action: PayloadAction<T>) => void) => {
    return (state: UsecasesState, action: PayloadAction<T>) => {
        try {
            for (const validator of validators) {
                validator(state);
            }
        } catch (e) {
            console.error(
                `usecases-ui: reducer validation failed for action ${action.type}`,
                e
            );
            return;
        }
        try {
            reducer(state, action);
        } catch (e) {
            console.error(
                `usecases-ui: reducer failed for action ${action.type}`,
                e
            );
        }
    }
}

// # app setup

function reducer_setAppName(state: UsecasesState, action: PayloadAction<string>) {
    state.appName = action.payload;
}

function reducer_setTaskDefinitions(state: UsecasesState, action: PayloadAction<AliasRecord<TaskDefinition>>) {
    state.tasksDefinitions = action.payload;
}

function reducer_setUsecasesData(state: UsecasesState, action: PayloadAction<UsecaseData[]>) {
    const usecasesStateClass = new UsecasesStateClass(state);
    usecasesStateClass.validateUsecasesData(action.payload);
    console.log('usecases-ui: setting usecases data to', action.payload)
    state.usecasesData = action.payload;
}

// # usecase life cycle

// ## usecase initialization
// This would setup the state so that the first task is ready and shown to the user
const reducer_selectUsecase = reducer([], (state: UsecasesState, {payload: usecaseId}: PayloadAction<string>) => {
    const usecasesStateClass = new UsecasesStateClass(state);
    console.log("usecases-ui: selecting usecase", usecaseId)
    state.currentUsecaseState = usecasesStateClass.initializeUsecaseState(usecaseId);
    console.log("usecases-ui: usecase state initialized", state.currentUsecaseState)
})

// ## usecase termination
const reducer_endUsecase = reducer([
        validate_activeUsecase,
    ],
    (state: UsecasesState, action: PayloadAction<any>) => {
        state.currentUsecaseState = null;
    }
)


const reducer_unselectTask = reducer([
        validate_activeTask,
        validate_activeUsecase,
    ],
    (state: UsecasesState<true>, _: PayloadAction<any>) => {
        const currentTask = state.currentUsecaseState.currentTask!;
        // deactivate
        state.currentUsecaseState.tasksStates[currentTask].status = TaskStatus.INACTIVE;
        // unselect
        state.currentUsecaseState.currentTask = null;
    }
)

type TaskSelectionPayload = {
    input: AliasRecord<any>;
    taskAlias: string;
    referrerAlias: string | null;
}

const reducer_selectTask = reducer([
    validate_activeUsecase,
    validate_noActiveTask,
], (state: UsecasesState<true>, {payload: {input, taskAlias, referrerAlias}}: PayloadAction<TaskSelectionPayload>) => {
    // select
    state.currentUsecaseState.currentTask = taskAlias;
    // activate
    state.currentUsecaseState.tasksStates[taskAlias].status = TaskStatus.ACTIVE;
    // set referrer
    state.currentUsecaseState.tasksStates[taskAlias].referrerAlias = referrerAlias;
    // set input, by way of merging it
    state.currentUsecaseState.tasksStates[taskAlias].input = {
        ...state.currentUsecaseState.tasksStates[taskAlias].input,
        ...input,
    };
})


/* SLICE */

const usecasesInitialState: UsecasesState = {
    currentUsecaseState: null,
    tasksDefinitions: {},
    usecasesData: [],
    appName: 'default',
}


const usecasesSlice = createSlice({
    name: 'usecases',
    initialState: usecasesInitialState,
    reducers: {
        endUsecase: reducer_endUsecase,
        selectUsecase: reducer_selectUsecase,
        setTaskDefinitions: reducer_setTaskDefinitions,
        setUsecasesData: reducer_setUsecasesData,
        unselectTask: reducer_unselectTask,
        selectTask: reducer_selectTask,
        setAppName: reducer_setAppName,
    }
})

export const {
    setAppName,
    setTaskDefinitions,
    setUsecasesData,
    selectUsecase,
    unselectTask,
    selectTask,
    endUsecase,
} = usecasesSlice.actions;

export const tasksReducer = usecasesSlice.reducer;


/* STORE */

export const rootReducer = combineReducers({
    tasks: tasksReducer,
});

export const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.REACT_APP_ENABLE_REDUX_DEV_TOOLS === 'true'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

/* HOOKS */

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector;

export const useDispatch = () => useReduxDispatch<AppDispatch>();

/* App logic aliases */

export enum SystemAlias {
    EndUsecase = 'EndUsecase',
    ParentTask = 'ParentTask',
    RootTask = 'RootTask',
}

/* THUNKS */

const thunk = createAsyncThunk

/* Thunks
- appSetup OK
- setUsecasesData OK
- selectUsecase
- taskTransition({ current_task: implied from state,
    gateway: task will set its gateways from the slots when initialized,
    so the task knows how to read what are each of the gateways in the slots, because
    has a very free structure. So task, from the slots configuration that is inputed
    in the task instance configuration, will set the gateways to the real task aliases,
    so the gateways dict is a dict from gateway alias to task alias.
    Then the task knows which gateway it is using.})
 */

export const thunk_AppSetup = thunk(
    'usecases/appSetup',
    async (payload: { appName: string }, {getState, dispatch}) => {
        const state = (getState as () => RootState)().tasks;
        const currentAppName = state.appName;
        if (currentAppName !== 'default') {
            // app already set, ignore
            return
        }
        const { appName } = payload
        if (!(appName in usecasesAppClass.apps)) {
            throw new Error(`app '${appName}' has not been initialized. Please initialize using 'initUsecasesApp' first`)
        }
        const appTasks = usecasesAppClass.apps[appName]
        dispatch(setAppName(payload.appName));
        // this makes the connection between the redux state and the global module state
        dispatch(setTaskDefinitions(appTasks.taskDefinitions))
        console.log(`usecases-ui: app '${appName}' correctly set up.`)
    }
);

export const thunk_SetUsecasesData = thunk(
    'usecases/setUsecasesData',
    async (payload: {usecasesData: UsecaseData[]}, {getState, dispatch}) => {
        console.log('usecases-ui: setting usecases data')
        dispatch(setUsecasesData(payload.usecasesData))
    }
)

export const thunk_SelectUsecase = thunk(
    'usecases/selectUsecase',
    async (payload: {usecaseId: string}, {getState, dispatch}) => {
        dispatch(selectUsecase(payload.usecaseId))
    }
)

export const thunk_TaskTransition = thunk(
    'usecases/taskTransition',
    async (payload: {taskAlias: string, gatewayAlias: string, input: AliasRecord<any>}, {getState, dispatch}) => {
        try {
            const state = (getState as () => RootState)().tasks as UsecasesState<true>;
            const currentUsecaseState = state.currentUsecaseState;
            const usecasesStateClass = new UsecasesStateClass(state);
            const usecaseClass = usecasesStateClass.usecaseClass(currentUsecaseState.usecaseData.id);
            const usecaseStateClass = new UsecaseStateClass(currentUsecaseState, state.tasksDefinitions, state.appName);

            const currentTask = currentUsecaseState.currentTask!;
            const taskState = usecaseStateClass.getTaskState(currentTask)
            const taskDefinition = usecaseClass.taskDefinitionFromInstanceAlias(currentTask);

            const gatewayTaskAlias = payload.gatewayAlias;

            // first check if gatewayAlias is a special system alias
            if (!gatewayTaskAlias) {
                throw new Error(`Falsey gateway alias ${payload.gatewayAlias} for task ${currentTask}`);
            }
            if (gatewayTaskAlias === SystemAlias.EndUsecase) {
                dispatch(endUsecase({}))
                return
            }
            let targetTaskAlias: null | string = null;
            if (gatewayTaskAlias === SystemAlias.RootTask) {
                targetTaskAlias = currentUsecaseState.usecaseData.rootTaskInstanceAlias;
            } else if (gatewayTaskAlias === SystemAlias.ParentTask) {
                if (taskState.referrerAlias === null) {
                    throw new Error(`Task ${currentTask} has no parent task`);
                }
                // will keep old input for now but will add any new input
                // TODO allow flexibility on this policy in the activate task reducer logic.
                targetTaskAlias = taskState.referrerAlias;
            } else {
                // if no special alias, then it is a task alias
                targetTaskAlias = gatewayTaskAlias;
            }

            // if target task is current task, do nothing and throw warning
            if (targetTaskAlias === currentTask) {
                console.warn(`Task ${targetTaskAlias} is referring to itself, ignoring`)
                return
            }

            // if target task is not in the usecase, throw error
            if (!(targetTaskAlias in currentUsecaseState.tasksStates)) {
                throw new Error(`Task ${targetTaskAlias} not found in usecase ${currentUsecaseState.usecaseData.name}`);
            }

            // unselect current task
            dispatch(unselectTask({}))

            // select target task
            dispatch(selectTask({
                input: payload.input,
                taskAlias: targetTaskAlias,
                referrerAlias: currentTask,
            }))
        } catch (e) {
            console.error('usecases-ui: task transition failed', e)
        }
    }
)



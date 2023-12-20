import {
    AsyncThunk,
    combineReducers,
    configureStore,
    createAsyncThunk,
    createSlice,
    PayloadAction
} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch as useReduxDispatch, useSelector as useReduxSelector} from 'react-redux';
import {usecasesAppClass} from "@/lib/usecases-ui/usecasesApp";
import {AliasRecord} from "@/lib/utils";
import {SystemAlias, TaskDefinition, TaskStatus} from "@/lib/usecases-ui/task";
import {UsecasesState, UsecasesStateClass} from "@/lib/usecases-ui/usecasesState";
import {UsecaseData, UsecaseStateClass} from "@/lib/usecases-ui/UsecaseClass";

/* HELPERS */


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

// Warning: This does not merge, this sets
const reducer_setTaskInput = reducer([
    validate_activeUsecase,
    validate_activeTask,
], (state: UsecasesState<true>, {payload: {input, taskAlias}}: PayloadAction<{
    input: AliasRecord<any>,
    taskAlias: string,
}>) => {
    const task = state.currentUsecaseState.tasksStates[taskAlias];
    if (task === undefined) {
        throw new Error(`Task ${taskAlias} not found in usecase ${state.currentUsecaseState.usecaseData.name}`)
    }
    task.input = input
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
        setTaskInput: reducer_setTaskInput,
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
    setTaskInput,
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

export const thunk_AppSetup: AsyncThunk<any, any, any> = thunk(
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
        const taskDefinitions: AliasRecord<TaskDefinition> = {}
        for (const taskName in appTasks.tasksLogic) {
            taskDefinitions[taskName] = appTasks.tasksLogic[taskName].taskDefinition
        }
        dispatch(setTaskDefinitions(taskDefinitions))
        console.log(`usecases-ui: app '${appName}' correctly set up.`)
    }
);

export const thunk_SetUsecasesData: AsyncThunk<any, any, any> = thunk(
    'usecases/setUsecasesData',
    async (payload: {usecasesData: UsecaseData[]}, {getState, dispatch}) => {
        console.log('usecases-ui: setting usecases data')
        dispatch(setUsecasesData(payload.usecasesData))
    }
)

export const thunk_SelectUsecase: AsyncThunk<any, any, any> = thunk(
    'usecases/selectUsecase',
    async (payload: {usecaseId: string}, {getState, dispatch}) => {
        dispatch(selectUsecase(payload.usecaseId))
    }
)

// setTaskInput: sets the input of the current task
// This is useful when the task could be called again with no input
export const thunk_SetCurrentTaskInput: AsyncThunk<any, any, any> = thunk(
    'usecases/setCurrentTaskInput',
    async (payload: {input: AliasRecord<any>}, {getState, dispatch}) => {
        const state = (getState as () => RootState)().tasks as UsecasesState<true>;
        const currentUsecaseState = state.currentUsecaseState;
        const usecasesStateClass = new UsecasesStateClass(state);
        const usecaseClass = usecasesStateClass.usecaseClass(currentUsecaseState.usecaseData.id);
        const usecaseStateClass = new UsecaseStateClass(currentUsecaseState, state.tasksDefinitions, state.appName);

        const currentTask = currentUsecaseState.currentTask!;
        const taskState = usecaseStateClass.getTaskState(currentTask)
        const taskDefinition = usecaseClass.taskDefinitionFromInstanceAlias(currentTask);

        dispatch(
            setTaskInput({
                input: payload.input,
                taskAlias: currentTask,
            })
        )
    }
)


export const thunk_TaskTransition: AsyncThunk<any, any, any> = thunk(
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



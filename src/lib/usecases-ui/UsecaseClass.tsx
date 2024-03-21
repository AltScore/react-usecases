import { AliasRecord } from '@/lib/utils';
import {
    SystemAlias,
    TaskDefinition,
    TaskDefinitionClass,
    TaskInstanceConfiguration,
    TaskState,
    TaskStatus,
} from '@/lib/usecases-ui/task';
import { usecasesAppClass } from '@/lib/usecases-ui/usecasesApp';

export type UsecaseData = {
    id: string;
    name: string;
    description: string;
    rootTaskInstanceInput: AliasRecord<any>;
    rootTaskInstanceAlias: string;
    taskInstances: AliasRecord<TaskInstanceConfiguration>;
};

export class UsecaseClass {
    appName: string;
    usecaseData: UsecaseData;
    taskDefinitions: AliasRecord<TaskDefinition>;

    constructor(appName: string, usecaseData: UsecaseData, taskDefinitions: AliasRecord<TaskDefinition>) {
        this.appName = appName;
        this.usecaseData = usecaseData;
        this.taskDefinitions = taskDefinitions;
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
        const taskInstance = this.getTaskInstanceConfig(instanceAlias);
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
        const taskInstanceConfig = this.getTaskInstanceConfig(instanceAlias);
        const taskGatewaysBuilder = usecasesAppClass.getTaskGatewaysBuilder(this.appName, taskInstanceConfig.type);
        if (taskGatewaysBuilder === null) {
            console.warn(`No gateways builder found for task ${taskInstanceConfig.type}, setting as {}`);
            return {};
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
        };
    }

    initializeUsecaseTaskStates(): AliasRecord<TaskState> {
        const taskInstanceAliases = Object.keys(this.usecaseData.taskInstances);
        return taskInstanceAliases.reduce((tasksStates: AliasRecord<TaskState>, taskInstanceAlias: string) => {
            return {
                ...tasksStates,
                [taskInstanceAlias]: this.initializeTaskStateForUsecaseStartup(taskInstanceAlias),
            };
        }, {});
    }
}

export class UsecaseStateClass {
    usecaseState: UsecaseState;
    taskDefinitions: AliasRecord<TaskDefinition>;
    usecaseClass: UsecaseClass;

    constructor(usecaseState: UsecaseState, taskDefinitions: AliasRecord<TaskDefinition>, appName: string) {
        this.usecaseState = usecaseState;
        this.taskDefinitions = taskDefinitions;
        this.usecaseClass = new UsecaseClass(appName, usecaseState.usecaseData, taskDefinitions);
    }

    getTaskState(taskAlias: string): TaskState {
        if (!(taskAlias in this.usecaseState.tasksStates)) {
            throw new Error(`Status of task "${taskAlias}" not found in usecase ${this.usecaseState.usecaseData.name}`);
        }
        return this.usecaseState.tasksStates[taskAlias];
    }
}

export type UsecaseState<ActiveTask extends boolean = any> = {
    usecaseData: UsecaseData;
    currentTask: ActiveTask extends true ? string : null;
    tasksStates: AliasRecord<TaskState>;
};

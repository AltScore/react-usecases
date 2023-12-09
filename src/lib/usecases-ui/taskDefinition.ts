import {AliasRecord, TaskState, TaskStatus} from "@/lib/usecases-ui/state";

export type TaskDefinition = {
    input: AliasRecord<any>
    // TODO Add slots schema for validation
    // Idea: Just add the schema and use a json schema validator
    // for validation at runtime when usecases are loaded.
}

export class TaskDefinitionClass {
    taskDefinition: TaskDefinition

    constructor(taskDefinition: TaskDefinition) {
        this.taskDefinition = taskDefinition
    }

    newTaskInstanceState(instanceAlias: string): TaskState {
        const inputs: AliasRecord<any> = {}
        for (const inputName of Object.keys(this.taskDefinition)) {
            inputs[inputName] = null
        }
        return {
            taskAlias: instanceAlias,
            status: TaskStatus.INACTIVE,
            input: inputs,
            // partial result because we don't have access to the
            // gateway logic here
            gateways: {},
            // no one is referred at startup unless it is the root
            referrerAlias: null,
        }
    }
}
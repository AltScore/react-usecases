import {FC} from "react";
import {TaskInstanceConfiguration, TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";

export class UsecasesHelper {
    constructor(
        public taskDefinitions: Record<string, TaskDefinition>,
        public taskComponents: Record<string, FC<TaskInstanceProps>>,
        public taskInstances: Record<string, TaskInstanceConfiguration>,
    ) {
        this.taskDefinitions = taskDefinitions;
        this.taskComponents = taskComponents;
        this.taskInstances = taskInstances;
    }

    getTaskFCForInstance(instanceAlias: string): FC<TaskInstanceProps> {
        const taskInstanceConfiguration = this.getTaskInstanceConfiguration(instanceAlias);
        const taskDefinitionAlias = taskInstanceConfiguration.type;
        if (!(taskDefinitionAlias in this.taskComponents)) {
            throw new Error(`Task ${taskDefinitionAlias} not found`);
        }
        return this.taskComponents[taskDefinitionAlias];
    }

    getTaskInstanceConfiguration(instanceAlias: string): TaskInstanceConfiguration {
        if (!(instanceAlias in this.taskInstances)) {
            throw new Error(`Task instance ${instanceAlias} not found`);
        }
        return this.taskInstances[instanceAlias];
    }

    getTaskDefinitionForInstance(instanceAlias: string) {
        const taskInstanceConfiguration = this.getTaskInstanceConfiguration(instanceAlias);
        return this.getTaskDefinition(taskInstanceConfiguration.type);
    }

    getTaskDefinition(taskDefinitionAlias: string) {
        if (!(taskDefinitionAlias in this.taskDefinitions)) {
            throw new Error(`Task definition ${taskDefinitionAlias} not found`);
        }
        return this.taskDefinitions[taskDefinitionAlias];
    }
}
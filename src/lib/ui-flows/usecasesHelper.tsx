import {TaskDefinition, UsecasesAppConfiguration} from "./index";
import {FC} from "react";
import {TaskInstanceConfiguration} from "@/lib/ui-flows/taskInstance";

type HelperConfig  = {
    taskDefinitions: Record<string, TaskDefinition>;
    tasks: Record<string, FC>;
    taskInstanceConfigurations: Record<string, TaskInstanceConfiguration>;
}

export class UsecasesHelper {
    constructor(
        public configuration: HelperConfig,
    ) {
        this.configuration = configuration;
    }

    getTaskFCForInstance(instanceAlias: string): FC<any> {
        const taskInstanceConfiguration = this.getTaskInstanceConfiguration(instanceAlias);
        const taskDefinitionAlias = taskInstanceConfiguration.type;
        if (!(taskDefinitionAlias in this.configuration.tasks)) {
            throw new Error(`Task ${taskDefinitionAlias} not found`);
        }
        return this.configuration.tasks[taskDefinitionAlias];
    }

    getTaskInstanceConfiguration(instanceAlias: string): TaskInstanceConfiguration {
        if (!(instanceAlias in this.configuration.taskInstanceConfigurations)) {
            throw new Error(`Task instance ${instanceAlias} not found`);
        }
        return this.configuration.taskInstanceConfigurations[instanceAlias];
    }

    getTaskDefinitionForInstance(instanceAlias: string) {
        const taskInstanceConfiguration = this.getTaskInstanceConfiguration(instanceAlias);
        return this.getTaskDefinition(taskInstanceConfiguration.type);
    }

    getTaskDefinition(taskDefinitionAlias: string) {
        if (!(taskDefinitionAlias in this.configuration.taskDefinitions)) {
            throw new Error(`Task definition ${taskDefinitionAlias} not found`);
        }
        return this.configuration.taskDefinitions[taskDefinitionAlias];
    }
}
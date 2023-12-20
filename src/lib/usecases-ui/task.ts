import {AliasRecord} from "@/lib/utils";
import { FC, PropsWithChildren } from "react";

export interface TaskInstanceProps<G=any, I=any> extends PropsWithChildren {
    inputs: I;
    taskAlias: string;
    gateways: G
    goTo: (gatewayAlias: string, payload: AliasRecord<any>) => void;
    setFutureInputs: (inputs: I) => void;
}

export type TaskComponent<G=any, I=any> = FC<TaskInstanceProps<G, I>>
export type TaskGatewaysBuilder<G=any> = (slots: any) => G

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

export enum SystemAlias {
    EndUsecase = 'EndUsecase',
    ParentTask = 'ParentTask',
    RootTask = 'RootTask',
}

export type TaskLogic<G=any, I=any> = {
    taskDefinition: TaskDefinition;
    Component: TaskComponent<G, I>;
    gatewaysBuilder: TaskGatewaysBuilder<G> | null;
}
export type TaskInstanceConfiguration = {
    // this is the alias of the task definition.
    type: string;
    // just any json structure
    // that the task knows how to read.
    // TODO Add parseable slots schema to task definition
    // to improve validation.
    // For now, task implementer must determine what
    // is the schema for the slots.
    // The task then will know how to read this schema
    // and generate the gateways dict accordingly.
    // NOTE: Other dicts may be generated in the future,
    // for example maybe input_overrides, flags, etc.
    // well the task may already do any of these things
    // because it determines how to behave.
    slots: any;
}
// here goes specific usecases-ui configuration for the
// task itself, and for its inputs. For example,
// required, default values, etc.
export type TaskDefinition = {
    // input: Input configuration for each input key
    input: AliasRecord<any>
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
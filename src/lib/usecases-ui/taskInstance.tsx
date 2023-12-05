import {UsecasesHelper} from "./usecasesHelper";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";
import React from "react";

export type TaskInstanceConfiguration = {
    // type: task definition that is instantiated
    type: string;
    // slots: slots that are filled
    // they are json objects, for example,
    // an array of task instance aliases
    // It is the responsibility of the task to validate the slots, for now
    // while there is little tooling
    slots: Record<string, any>;
} // this component is responsible for loading a task

export interface TaskInstanceProps {
    inputs: Record<string, any>;
    taskAlias: string;
    usecasesHelper: UsecasesHelper;
    onCompleted: (outputs: Record<string, any>) => void;
    shouldBeClosed: boolean;
    setOutputKey: (key: string, value: any) => void;
}

export type OnCompletedFunc = (outputs: Record<string, any>) => void;

// TaskInstance - Serves the purpose of a runner. It is a proxy for the task.
export const TaskInstance = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }
        : TaskInstanceProps
) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    const TaskFC = usecasesHelper.getTaskFCForInstance(taskAlias)
    /*
    Here there could be a lot of logic that could for example
    - trigger onCompleted bypassing the task
    - handle shouldBeClosed bypassing the task
    - validate inputs according to task definition
    - create a setOutputKey that would wrap the one passed as prop, adding additional logic
    and checks.
    - Updating a redux state.
    - Getting info from redux state and pass along to the task
     */

    return <TaskFC
        inputs={inputs}
        taskAlias={taskAlias}
        usecasesHelper={usecasesHelper}
        onCompleted={onCompleted}
        shouldBeClosed={shouldBeClosed}
        setOutputKey={setOutputKey}
    />
}

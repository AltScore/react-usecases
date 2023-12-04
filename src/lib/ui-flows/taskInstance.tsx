import { TaskDefinition } from ".";
import {UsecasesHelper} from "./usecasesHelper";

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
export type TaskInstanceWrapperProps = {
    inputs: Record<string, any>;
    taskAlias: string;
    usecasesHelper: UsecasesHelper;
    onCompleted: (outputs: Record<string, any>) => void;
    shouldBeClosed: boolean;
    setOutputKey: (key: string, value: any) => void;
}

export type OnCompletedFunc = (outputs: Record<string, any>) => void;

export const TaskInstance = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }
        : TaskInstanceWrapperProps
) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    const TaskFC = usecasesHelper.getTaskFCForInstance(taskAlias)

    return <TaskFC
        inputs={inputs}
        taskInstanceConfiguration={taskInstanceConfiguration}
        taskDefinition={taskDefinition}
        usecasesHelper={usecasesHelper}
        onCompleted={onCompleted}
        shouldBeClosed={shouldBeClosed}
        setOutputKey={setOutputKey}
    />
}

export type TaskInstanceProps = {
    inputs: Record<string, any>;
    taskInstanceConfiguration: TaskInstanceConfiguration;
    taskDefinition: TaskDefinition;
    usecasesHelper: UsecasesHelper;
    onCompleted: (outputs: Record<string, any>) => void;
    shouldBeClosed: boolean;
    setOutputKey: (key: string, value: any) => void;
}

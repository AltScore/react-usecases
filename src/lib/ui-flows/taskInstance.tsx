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
    slots: Map<string, any>;
} // this component is responsible for loading a task
type TaskInstanceComponentProps = {
    inputs: Map<string, any>;
    taskInstanceConfiguration: TaskInstanceConfiguration;
    taskDefinition: TaskDefinition;
    usecasesHelper: UsecasesHelper;
}
export const TaskInstanceComponent = (
    {
        inputs,
        taskInstanceConfiguration,
        taskDefinition,
    }
        : TaskInstanceComponentProps
) => {
    return null;
}
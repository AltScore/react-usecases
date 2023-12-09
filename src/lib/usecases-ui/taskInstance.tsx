import React, {useCallback, useMemo} from "react";
import {
    AliasRecord,
    thunk_TaskTransition,
    usecasesAppClass,
    UsecasesState,
    UsecasesStateClass,
    UsecaseStateClass,
    useDispatch,
    useSelector
} from "@/lib/usecases-ui/state";

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


// TaskInstance - Serves the purpose of a runner. It is a proxy for the task.
export const TaskInstance = () => {
    const tasksState = useSelector(state => state.tasks) as UsecasesState<true, true>
    const dispatch = useDispatch()

    const currentUsecaseState = tasksState.currentUsecaseState
    const usecasesStateClass = new UsecasesStateClass(tasksState)
    const usecaseStateClass = new UsecaseStateClass(
        currentUsecaseState,
        tasksState.tasksDefinitions,
        tasksState.appName,
    )
    const usecaseClass = usecasesStateClass.usecaseClass(currentUsecaseState.usecaseData.id)
    const currentTaskInstanceAlias = currentUsecaseState.currentTask

    const taskInstanceConfiguration = usecaseClass.getTaskInstanceConfig(currentTaskInstanceAlias)

    const TaskFC = usecasesAppClass.getTaskComponent(
        tasksState.appName,
        taskInstanceConfiguration.type,
    )

    const taskState = usecaseStateClass.getTaskState(currentTaskInstanceAlias);

    const goToTask = useCallback((gatewayAlias: string, payload: AliasRecord<any>) => {
        console.log("goToTask")
        dispatch(
            thunk_TaskTransition({
                taskAlias: currentTaskInstanceAlias,
                input: payload,
                // the target alias in the tasks metalanguage. We convert it to the task instance alias
                // according to configuration
                gatewayAlias,
            })
        );
    }, [dispatch, currentTaskInstanceAlias])

    const memoizedTask = useMemo(() => {
        return <TaskFC
            inputs={taskState.input}
            taskAlias={taskState.taskAlias}
            gateways={taskState.gateways}
            goTo={goToTask}
        />
    }, [taskState.taskAlias, taskState.status])

    return memoizedTask;
}

export interface TaskInstanceProps {
    inputs: AliasRecord<string>;
    taskAlias: string;
    gateways: AliasRecord<string>
    goTo: (gatewayAlias: string, payload: AliasRecord<any>) => void;
}

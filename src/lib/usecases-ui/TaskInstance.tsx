import React, { useCallback, useMemo } from 'react';
import { thunk_SetCurrentTaskInput, thunk_TaskTransition, useDispatch, useSelector } from './state';
import { usecasesAppClass } from '@/lib/usecases-ui/usecasesApp';
import { AliasRecord } from '@/lib/utils';
import { UsecasesState, UsecasesStateClass } from '@/lib/usecases-ui/usecasesState';
import { UsecaseStateClass } from '@/lib/usecases-ui/UsecaseClass';

// TaskInstance - Serves the purpose of a runner. It is a proxy for the task.
export const TaskInstance = () => {
    const tasksState = useSelector((state) => state.tasks) as UsecasesState<true, true>;
    const dispatch = useDispatch();

    const currentUsecaseState = tasksState.currentUsecaseState;
    const usecasesStateClass = new UsecasesStateClass(tasksState);
    const usecaseStateClass = new UsecaseStateClass(
        currentUsecaseState,
        tasksState.tasksDefinitions,
        tasksState.appName,
    );
    const usecaseClass = usecasesStateClass.usecaseClass(currentUsecaseState.usecaseData.id);
    const currentTaskInstanceAlias = currentUsecaseState.currentTask;

    const taskInstanceConfiguration = usecaseClass.getTaskInstanceConfig(currentTaskInstanceAlias);

    const TaskFC = usecasesAppClass.getTaskComponent(tasksState.appName, taskInstanceConfiguration.type);

    const taskState = usecaseStateClass.getTaskState(currentTaskInstanceAlias);

    const goToTask = useCallback(
        (gatewayAlias: string, payload: AliasRecord<any>) => {
            console.log('goToTask');
            dispatch(
                thunk_TaskTransition({
                    taskAlias: currentTaskInstanceAlias,
                    input: payload,
                    // the target alias in the tasks metalanguage. We convert it to the task instance alias
                    // according to configuration
                    gatewayAlias,
                }),
            );
        },
        [dispatch, currentTaskInstanceAlias],
    );

    const setFutureInputs = useCallback(
        (inputs: AliasRecord<any>) => {
            dispatch(
                thunk_SetCurrentTaskInput({
                    input: inputs,
                }),
            );
        },
        [dispatch],
    );

    const memoizedTask = useMemo(() => {
        return (
            <TaskFC
                inputs={taskState.input}
                taskAlias={taskState.taskAlias}
                gateways={taskState.gateways}
                goTo={goToTask}
                setFutureInputs={setFutureInputs}
            />
        );
    }, [taskState.taskAlias, taskState.status]);

    return memoizedTask;
};

import {AliasRecord} from "@/lib/utils";
import {TaskDefinition} from "@/lib/usecases-ui/task";

import {UsecaseClass, UsecaseData, UsecaseState} from "@/lib/usecases-ui/UsecaseClass";

export type UsecasesState<ActiveStatus extends boolean = any, ActiveTask extends boolean = any> = {
    appName: string;
    tasksDefinitions: AliasRecord<TaskDefinition>;
    usecasesData: UsecaseData[];
    currentUsecaseState: ActiveStatus extends true ? UsecaseState<ActiveTask> : null
}

export class UsecasesStateClass {
    usecasesState: UsecasesState

    constructor(usecasesState: UsecasesState) {
        this.usecasesState = usecasesState
    }

    getUsecaseData(usecaseId: string): UsecaseData {
        for (const usecaseData of this.usecasesState.usecasesData) {
            if (usecaseData.id === usecaseId) {
                return usecaseData;
            }
        }
        throw new Error(`Usecase ${usecaseId} not found`);
    }

    initializeUsecaseState(usecaseId: string): UsecaseState {
        return this.usecaseClass(usecaseId).initializeUsecaseState();
    }

    usecaseClass(usecaseId: string): UsecaseClass {
        const usecaseData = this.getUsecaseData(usecaseId);
        return new UsecaseClass(
            this.usecasesState.appName,
            usecaseData,
            this.usecasesState.tasksDefinitions
        );
    }

    validateUsecasesData(usecasesData: UsecaseData[]) {
        // if there are no task definitions, we can't validate anything
        if (Object.keys(this.usecasesState.tasksDefinitions).length === 0) {
            throw new Error('No task definitions found. Set task definitions first.');
        }
    }
}
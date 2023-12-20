// singleton initializer of usecases
import {TaskDefinition, TaskGatewaysBuilder, TaskInstanceProps, TaskLogic} from "@/lib/usecases-ui/task";
import {FC} from "react";
import {AliasRecord} from "@/lib/utils";

class UsecasesAppClass {
    apps: AliasRecord<{
        tasksLogic: AliasRecord<TaskLogic>,
    }>

    constructor() {
        this.apps = {}
    }

    registerApp(appName: string, tasksLogic: AliasRecord<TaskLogic>) {
        // if app is already registered, ignore
        if (appName in this.apps) {
            return
        }
        this.apps[appName] = {
            tasksLogic,
        }
        console.log(`usecases-ui: app '${appName}' correctly registered.`)
    }

    getTaskComponent(appName: string, taskName: string): FC<TaskInstanceProps> {
        if (!(appName in this.apps)) {
            throw new Error(`App ${appName} not found`)
        }
        const app = this.apps[appName]
        if (!(taskName in app.tasksLogic)) {
            throw new Error(`Task ${taskName} not found in app ${appName}`)
        }
        return app.tasksLogic[taskName].Component
    }

    getTaskGatewaysBuilder(appName: string, taskName: string): TaskGatewaysBuilder | null {
        if (!(appName in this.apps)) {
            throw new Error(`App ${appName} not found`)
        }
        const app = this.apps[appName]
        if (!(taskName in app.tasksLogic)) {
            throw new Error(`Task ${taskName} not found in app ${appName}`)
        }
        return app.tasksLogic[taskName].gatewaysBuilder
    }
}

export const usecasesAppClass = new UsecasesAppClass()

export function initUsecasesApp(appName: string, tasksLogic: AliasRecord<TaskLogic>) {
    usecasesAppClass.registerApp(appName, tasksLogic)
    console.log(`usecases-ui: app '${appName}' correctly initialized.`)
}


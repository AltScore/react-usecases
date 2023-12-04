import React, {FC, useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {UsecasesBar} from "./usecasesBar";
import {Usecase, UsecaseData} from "./Usecase";
import {UsecasePillProps} from "./UsecasePill";
import {UsecasesHelper} from "./usecasesHelper";
import {TaskInstanceConfiguration} from "@/lib/ui-flows/taskInstance";

export type InputSpec = {
    type: string;
}

export type OutputSpec = {
    type: string;
}


export type TaskDefinition = {
    name: string;
    inputs: Record<string, InputSpec>;
    outputs: Record<string, OutputSpec>;
}

export type UsecasesAppConfiguration = {
    taskDefinitions: Record<string, TaskDefinition>;
    tasks: Record<string, FC>;
}

const nativeTaskDefinitions: Record<string, TaskDefinition> = {}

const nativeTasks: Record<string, FC> = {}


const useInitUsecasesConfig = (configuration: UsecasesAppConfiguration) => {
    const [context, setContext] = useState<any>(null)
    useEffect(() => {
        // checks
        // - each task definition has an associated task
        for (const taskDefinition of Object.values(configuration.taskDefinitions)) {
            if (!(taskDefinition.name in configuration.tasks)) {
                throw new Error(`Task definition ${taskDefinition.name} has no associated task logic`);
            }
        }

        // - we create the configuration for this context
        const tasksDefinitions = nativeTaskDefinitions;
        const tasks = nativeTasks;

        for (const taskDefinition of Object.values(configuration.taskDefinitions)) {
            tasksDefinitions[taskDefinition.name] = taskDefinition;
        }

        for (const [taskDefAlias, taskFC] of Object.entries(configuration.tasks)) {
            tasks[taskDefAlias] = taskFC;
        }

        const context = {
            taskDefinitions: tasksDefinitions,
            tasks: tasks,
        }
        setContext(context)
    }, [])
    return context;
}


const useLoadUsecases = (usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>, textQuery: string) => {
    const [usecases, setUsecases] = useState<UsecaseData[]>([])
    const reloadUsecases = useCallback(async (textQuery: string) => {
        const usecases = await usecasesLoader(textQuery);
        setUsecases(usecases)
    }, [usecasesLoader])
    return {
        usecases,
        reloadUsecases,
    }
}

const useTextQuery = () => {
    const [textQuery, setTextQuery] = useState("")
    return {
        textQuery,
        setTextQuery,
    }
}


type UsecasesProps = {
    configuration: UsecasesAppConfiguration;
    usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>;
    // UsecasePill is a function that will be used like <UsecasePill usecase={usecase}/>
    UsecasePill: React.FC<UsecasePillProps>;
}
const Usecases = (
    {
        configuration,
        usecasesLoader,
        UsecasePill,
    }: UsecasesProps
) => {

    // runs only once.
    const config = useInitUsecasesConfig(configuration)
    const {textQuery, setTextQuery} = useTextQuery()
    const {usecases, reloadUsecases} = useLoadUsecases(usecasesLoader, textQuery)
    const [showPills, setShowPills] = useState(true)
    const [showBar, setShowBar] = useState(true)
    const [showUseCase, setShowUsecase] = useState(false)
    const [selectedUsecase, setSelectedUsecase] = useState<UsecaseData | null>(null)
    if (config) {
        config.taskInstanceConfigurations = selectedUsecase?.taskInstances as Record<string, TaskInstanceConfiguration>
    }
    const helper = new UsecasesHelper(config)

    useEffect(() => {
        reloadUsecases("").catch(console.error)
    }, [reloadUsecases])


    const onUsecaseClicked = useCallback((usecase: any) => {
        // setShowPills(false)
        // setShowBar(false)
        setShowUsecase(true)
        setSelectedUsecase(usecase)
    }, [])

    const onUseCaseCompleted = useCallback((_: Record<string, any>) => {
        setShowPills(true)
        setShowBar(true)
        setShowUsecase(false)
        setSelectedUsecase(null)
    }, [])

    // return area
    if (!config) {
        // we wait for the context to be created
        return null;
    }
    return <Stack
        height={"100%"}
        direction={"row"}
        alignItems={"start"}
        justifyContent={"center"}>
        <Stack
            height={"100%"}
            direction={"column"}
            justifyContent={"start"}
            spacing={2}
        >
            {showBar && <UsecasesBar setTextQuery={setTextQuery}/>}
            {showPills && <Stack
                spacing={2}
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"start"}
                alignItems={"start"}
            >
                {usecases.map((usecase, index) => {
                    return <UsecasePill
                        key={index}
                        usecase={usecase}
                        onUsecaseClicked={onUsecaseClicked}
                    />
                })}
            </Stack>}
            {showUseCase && selectedUsecase && <Usecase
                usecase={selectedUsecase!}
                usecasesHelper={helper}
                onCompleted={onUseCaseCompleted}
            />}
        </Stack>


    </Stack>
}



export {
    Usecases,

};

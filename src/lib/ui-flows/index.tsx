import React, {useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {UsecasesBar} from "./usecasesBar";
import {Usecase} from "./Usecase";
import {UsecasePillProps} from "./UsecasePill";
import {UsecasesHelper} from "./usecasesHelper";

export type InputSpec = {
    type: string;
}

export type OutputSpec = {
    type: string;
}


export type TaskDefinition = {
    name: string;
    inputs: Map<string, InputSpec>;
    outputs: Map<string, OutputSpec>;
}

export type UsecasesAppConfiguration = {
    taskDefinitions: Map<string, TaskDefinition>;
    tasks: Map<string, any>;
}

const nativeTaskDefinitions = new Map()

const nativeTasks = new Map()

const useInitUsecasesConfig = (configuration: any) => {
    const [context, setContext] = useState<any>(null)
    useEffect(() => {
        // checks
        // - each task definition has an associated task
        for (const taskDefinition of configuration.taskDefinitions.values()) {
            if (!configuration.tasks.has(taskDefinition.name)) {
                throw new Error(`Task definition ${taskDefinition.name} has no associated task logic`);
            }
        }


        // - we create the configuration for this context
        const tasksDefinitions = nativeTaskDefinitions;
        const tasks = nativeTasks;

        for (const taskDefinition of configuration.taskDefinitions.values()) {
            tasksDefinitions.set(taskDefinition.name, taskDefinition);
        }

        for (const task of configuration.tasks.values()) {
            tasks.set(task.name, task);
        }

        const context = {
            taskDefinitions: tasksDefinitions,
            tasks: tasks
        }
        setContext(context)
    }, [])
    return context;
}


const useLoadUsecases = (usecasesLoader: (textQuery: string) => Promise<any[]>, textQuery: string) => {
    const [usecases, setUsecases] = useState<any[]>([])
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
    usecasesLoader: (textQuery: string) => Promise<any[]>;
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
    const helper = new UsecasesHelper(config)
    const {textQuery, setTextQuery} = useTextQuery()
    const {usecases, reloadUsecases} = useLoadUsecases(usecasesLoader, textQuery)
    const [showPills, setShowPills] = useState(true)
    const [showBar, setShowBar] = useState(true)
    const [showUseCase, setShowUsecase] = useState(false)
    const [selectedUsecase, setSelectedUsecase] = useState<any>(null)

    useEffect(() => {
        reloadUsecases("").catch(console.error)
    }, [reloadUsecases])


    const onUsecaseClicked = useCallback((usecase: any) => {
        // setShowPills(false)
        // setShowBar(false)
        setShowUsecase(true)
        setSelectedUsecase(usecase)
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
            {showUseCase && <Usecase
                usecase={selectedUsecase}
                usecasesHelper={helper}
            />}
        </Stack>


    </Stack>
}



export {
    Usecases,

};

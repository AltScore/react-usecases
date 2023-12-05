import React, {FC, useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {UsecasesBar} from "./usecasesBar";
import {Usecase, UsecaseData} from "./Usecase";
import {UsecasePillProps} from "./UsecasePill";
import {UsecasesHelper} from "./usecasesHelper";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";
import {TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";

type UsecasesLoader = (textQuery: string) => Promise<UsecaseData[]>

const useLoadUsecases = (usecasesLoader: UsecasesLoader, textQuery: string) => {
    const [usecases, setUsecases] = useState<UsecaseData[]>([])
    const reloadUsecases = useCallback(async (textQuery: string) => {
        const usecases = await usecasesLoader(textQuery);
        setUsecases(usecases)
    }, [usecasesLoader])
    useEffect(() => {
        reloadUsecases(textQuery).catch(console.error)
    }, [])
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
    taskDefinitions: Record<string, TaskDefinition>;
    taskComponents: Record<string, FC<TaskInstanceProps>>;
    usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>;
    // UsecasePill is a function that will be used like <UsecasePill usecase={usecase}/>
    UsecasePill: React.FC<UsecasePillProps>;
}
const Usecases = (
    {
        taskDefinitions,
        taskComponents,
        usecasesLoader,
        UsecasePill,
    }: UsecasesProps
) => {
    const {textQuery, setTextQuery} = useTextQuery()
    const {usecases, reloadUsecases} = useLoadUsecases(usecasesLoader, textQuery)
    const [showPills, setShowPills] = useState(true)
    const [showBar, setShowBar] = useState(true)
    const [showUseCase, setShowUsecase] = useState(false)
    const [selectedUsecaseData, setSelectedUsecaseData] = useState<UsecaseData | null>(null)
    const helper = new UsecasesHelper(
        taskDefinitions,
        taskComponents,
        selectedUsecaseData?.taskInstances || {},
    )

    const onUsecaseClicked = useCallback((usecase: any) => {
        // setShowPills(false)
        // setShowBar(false)
        setShowUsecase(true)
        setSelectedUsecaseData(usecase)
    }, [])

    const onUseCaseCompleted = useCallback((_: Record<string, any>) => {
        setShowPills(true)
        setShowBar(true)
        setShowUsecase(false)
        setSelectedUsecaseData(null)
    }, [])

    return <Stack
        height={"100%"}
        width={"100%"}
        direction={"row"}
        alignItems={"start"}
        justifyContent={"center"}>
        <Stack
            height={"100%"}
            width={"100%"}
            direction={"column"}
            justifyContent={"start"}
            alignItems={"center"}
            spacing={2}
            px={"2rem"}
        >
            {showBar && <UsecasesBar setTextQuery={setTextQuery}/>}
            {showPills && <Stack
                spacing={2}
                direction={"row"}
                flexWrap={"wrap"}
                justifyContent={"start"}
                alignItems={"start"}
            >
                {usecases.map((usecaseData, index) => {
                    return <UsecasePill
                        key={index}
                        usecase={usecaseData}
                        onUsecaseClicked={onUsecaseClicked}
                    />
                })}
            </Stack>}
            {showUseCase && selectedUsecaseData && <Usecase
                usecaseData={selectedUsecaseData!}
                usecasesHelper={helper}
                onCompleted={onUseCaseCompleted}
            />}
        </Stack>
    </Stack>
}


export {
    Usecases,

};

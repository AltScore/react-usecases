import {Provider as ReduxProvider} from 'react-redux';
import React, {useCallback, useEffect, useState} from "react";
import {Stack} from "@mui/material";
import {UsecasesBar} from "./usecasesBar";
import {Usecase} from "./Usecase";
import {DefaultUsecasePill, UsecasePillProps} from "./UsecasePill";
import {
    AppDispatch,
    store,
    thunk_AppSetup,
    thunk_SelectUsecase,
    thunk_SetUsecasesData,
    useDispatch,
    useSelector
} from "./state";
import {TaskDefinition, TaskLogic} from "@/lib/usecases-ui/task";
import {initUsecasesApp} from "@/lib/usecases-ui/usecasesApp";
import {AliasRecord} from "@/lib/utils";
import {UsecaseData} from "@/lib/usecases-ui/UsecaseClass";

type UsecasesLoader = (textQuery: string) => Promise<UsecaseData[]>

const useLoadUsecases = (usecasesLoader: UsecasesLoader, dispatch: AppDispatch) => {
    const reloadUsecases = useCallback(async (textQuery: string) => {
        const usecasesData = await usecasesLoader(textQuery);
        await dispatch(thunk_SetUsecasesData({usecasesData}))
        console.log("loaded usecasesData", usecasesData)
    }, [dispatch, usecasesLoader])
    return {
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
    usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>;
    // UsecasePill is a function that will be used like <UsecasePill usecase={usecase}/>
    UsecasePill?: React.FC<UsecasePillProps>;
    tasksLogic: AliasRecord<TaskLogic>;
    appName: string;
}
const Usecases = (
    {
        // strategy components
        usecasesLoader,
        UsecasePill=DefaultUsecasePill,

        // app logic components
        tasksLogic,
        appName
    }: UsecasesProps
) => {
    // UI controls
    const [showPills, setShowPills] = useState(true)
    const [showBar, setShowBar] = useState(true)
    const [showUseCase, setShowUsecase] = useState(false)


    // app state TODO change to a usecases slice?
    const tasksState = useSelector(state => state.tasks)
    const dispatch = useDispatch()

    // usecase loading
    const {textQuery, setTextQuery} = useTextQuery()
    const {reloadUsecases} = useLoadUsecases(usecasesLoader, dispatch)

    useEffect(() => {
        reloadUsecases("").catch(console.error)
    }, [reloadUsecases])


    useEffect(() => {
        console.log("initiating app component")
        initUsecasesApp(
            appName,
            tasksLogic,
        )
        dispatch(thunk_AppSetup({
            appName,
        }))
    }, [appName, tasksLogic, dispatch])

    const onUsecaseClicked = useCallback((usecase: UsecaseData) => {
        // setShowPills(false)
        // setShowBar(false)
        dispatch(thunk_SelectUsecase({usecaseId: usecase.id}))
    }, [dispatch])

    const usecaseSelectedId = tasksState?.currentUsecaseState?.usecaseData.id
    console.log(tasksState)

    useEffect(() => {
        console.log("usecaseSelectedId", usecaseSelectedId)
        if (usecaseSelectedId) {
            setShowPills(false)
            setShowBar(false)
            setShowUsecase(true)
        } else {
            setShowPills(true)
            setShowBar(true)
            setShowUsecase(false)
        }
    }, [usecaseSelectedId])

    const usecasesData = tasksState?.usecasesData

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
                {usecasesData && usecasesData.map((usecaseData, index) => {
                    return <UsecasePill
                        key={index}
                        usecase={usecaseData}
                        onUsecaseClicked={onUsecaseClicked}
                    />
                })}
            </Stack>}
            {showUseCase && tasksState?.currentUsecaseState && <Usecase/>}
        </Stack>
    </Stack>
}

const UsecasesApp = (props: UsecasesProps) => {
    return <ReduxProvider store={store}>
        <Usecases {...props}/>
    </ReduxProvider>
}


export {
    UsecasesApp,
};

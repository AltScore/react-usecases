import {Box, Paper} from "@mui/material";
import React from "react";
import {Usecases} from "./index";
import {DefaultUsecasePill} from "./UsecasePill";
import {UsecaseData} from "@/lib/usecases-ui/Usecase";

const usecasesLoaderMock = async (textQuery: string): Promise<UsecaseData[]> => {
    return [
        {
            name: "Usecase 1",
            rootTaskInstanceAlias: "task1",
            description: "This is the first usecase",
            taskInstances: {
                task1: {
                    type: "native",
                    slots: {},
                }
            },
        }
    ]
}
const UsecaseExample = () => {
    const taskDefinitions = {
        native: {
            name: "native",
            inputs: {},
            outputs: {},
            slots: {},
        }
    };
    const taskComponents = {
        native: () => <Paper>Native task</Paper>
    };
    return <Box
        padding={0}
        margin={0}
        height={"100%"}
        width={"100%"}
    >
        <Usecases
            taskDefinitions={taskDefinitions}
            taskComponents={taskComponents}
            usecasesLoader={usecasesLoaderMock}
            UsecasePill={DefaultUsecasePill}
        />
    </Box>
}
export {UsecaseExample};
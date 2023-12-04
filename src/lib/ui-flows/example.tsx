import {Box} from "@mui/material";
import React from "react";
import {Usecases, UsecasesAppConfiguration} from "./index";
import {DefaultUsecasePill} from "./UsecasePill";
import {UsecaseData} from "@/lib/ui-flows/Usecase";

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
    const configuration: UsecasesAppConfiguration = {
        taskDefinitions: {
            native: {
                name: "native",
                inputs: {},
                outputs: {},
            }
        },
        tasks: {
            native: () => <div>Native task</div>
        },
    }
    return <Box
        padding={0}
        margin={0}
        height={"100vh"}
    >
        <Usecases
            configuration={configuration}
            usecasesLoader={usecasesLoaderMock}
            UsecasePill={DefaultUsecasePill}
        />
    </Box>
}
export {UsecaseExample};
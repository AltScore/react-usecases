import {Box} from "@mui/material";
import React from "react";
import {Usecases} from "./index";
import {DefaultUsecasePill} from "./UsecasePill";

const usecasesLoaderMock = async (textQuery: string) => {
    return [
        {
            name: "usecase1",
            description: "description1",
        },
        {
            name: "usecase2",
            description: "description2",
        },
        {
            name: "usecase3",
            description: "description3",
        },
        {
            name: "usecase4",
            description: "description4",
        }
    ]
}
const UsecaseExample = () => {
    const configuration = {
        taskDefinitions: new Map(),
        tasks: new Map(),
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
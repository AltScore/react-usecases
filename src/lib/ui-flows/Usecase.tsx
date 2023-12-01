import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import { TaskInstanceConfiguration } from "./taskInstance";
import {UsecasesHelper} from "./usecasesHelper";

type UsecaseProps = {
    usecase: UsecaseData;
    usecasesHelper: UsecasesHelper;
}
export const Usecase = (
    {
        usecase,
        usecasesHelper,
    }: UsecaseProps
) => {
    return <Paper
        elevation={3}
        sx={{
            flexGrow: 1,
            maxHeight: "80%",
        }}
    >
        <Stack>
            <Box margin={"auto"}>
                <Typography variant={"h5"}>
                    {usecase.name}
                </Typography>
                <Typography variant={"body1"}>
                    {usecase.description}
                </Typography>
            </Box>
        </Stack>
    </Paper>
}
type UsecaseData = {
    name: string;
    description: string;
    rootTaskInstanceAlias: string;
    taskInstances: Map<string, TaskInstanceConfiguration>;
}
import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import {OnCompletedFunc, TaskInstance, TaskInstanceConfiguration} from "./taskInstance";
import {UsecasesHelper} from "./usecasesHelper";

type UsecaseProps = {
    usecase: UsecaseData;
    usecasesHelper: UsecasesHelper;
    onCompleted: OnCompletedFunc;
}
export const Usecase = (
    {
        usecase,
        usecasesHelper,
        onCompleted,
    }: UsecaseProps
) => {
    const localOnCompleted = (outputs: Record<string, any>) => {
        console.log("completed", outputs)
        onCompleted({})
    }
    return <Paper
        elevation={3}
        sx={{
            flexGrow: 1,
            maxHeight: "80%",
        }}
    >
        <Stack>
            <Box margin={"auto"}>
                <TaskInstance
                    inputs={{}}
                    taskAlias={usecase.rootTaskInstanceAlias}
                    usecasesHelper={usecasesHelper}
                    onCompleted={localOnCompleted}
                    shouldBeClosed={false}
                    setOutputKey={() => {}}
                    />
            </Box>
        </Stack>
    </Paper>
}
export type UsecaseData = {
    name: string;
    description: string;
    rootTaskInstanceAlias: string;
    taskInstances: Record<string, TaskInstanceConfiguration>;
}
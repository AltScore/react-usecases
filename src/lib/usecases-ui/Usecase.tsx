import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import {OnCompletedFunc, TaskInstance, TaskInstanceConfiguration} from "./taskInstance";
import {UsecasesHelper} from "./usecasesHelper";

type UsecaseProps = {
    usecaseData: UsecaseData;
    usecasesHelper: UsecasesHelper;
    onCompleted: OnCompletedFunc;
}
export const Usecase = (
    {
        usecaseData,
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
            width: "100%",
            flexGrow: 1,
            maxHeight: "80%",
        }}
    >
        <Stack>
            <Box margin={"auto"}>
                <TaskInstance
                    inputs={{}}
                    taskAlias={usecaseData.rootTaskInstanceAlias}
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
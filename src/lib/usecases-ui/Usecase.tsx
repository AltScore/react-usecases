import {Box, Paper, Stack, Typography} from "@mui/material";
import React from "react";
import {TaskInstance, TaskInstanceConfiguration} from "./taskInstance";
import {AliasRecord, AppDispatch, useDispatch, useSelector} from "@/lib/usecases-ui/state";

export const Usecase = () => {
    // const tasksState = useSelector(state => state.tasks)
    // const dispatch = useDispatch()
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
                <TaskInstance />
            </Box>
        </Stack>
    </Paper>
}
export type UsecaseData = {
    id: string;
    name: string;
    description: string;
    rootTaskInstanceInput: AliasRecord<any>;
    rootTaskInstanceAlias: string;
    taskInstances: AliasRecord<TaskInstanceConfiguration>;
}
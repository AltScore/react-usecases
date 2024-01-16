import {Box, Paper, Stack} from "@mui/material";
import React from "react";
import {TaskInstance} from "./TaskInstance";

export const Usecase = () => {
    return <Paper
        elevation={3}
        sx={{
            width: "100%",
            flexGrow: 1,
            height: "100%",
        }}
    >
        <Stack
            width={"100%"}
            height={"100%"}
            direction={"row"}
            justifyContent={"center"}
        >
                <TaskInstance />
        </Stack>
    </Paper>
}


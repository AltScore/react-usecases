import {Box, Paper, Stack} from "@mui/material";
import React from "react";
import {TaskInstance} from "./TaskInstance";

export const Usecase = () => {
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


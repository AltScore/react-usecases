import {Box, Paper, Stack, Typography} from "@mui/material";

import {UsecaseExample} from "@/lib/usecases-ui/example";

const Page = () => {
    return (
        <Paper sx={{
            backgroundColor: "lightgray",
            width: "100%",
            height: "100vh",
        }}>
            <Box
                component="main"
                sx={{
                    width: "100%",
                    height: "100%",
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'hidden',
                    pt: 8
                }}
            >
                <UsecaseExample />
            </Box>
        </Paper>
    );
};

export default Page;

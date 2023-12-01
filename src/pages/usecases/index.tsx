import {Box, Paper, Stack, Typography} from "@mui/material";

import {UsecaseExample} from "@/lib/ui-flows/example";

const Page = () => {
    return (
        <>
            <Box
                component="main"
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    flexGrow: 1,
                    overflow: 'hidden',
                    pt: 8
                }}
            >
                <UsecaseExample />
            </Box>
        </>
    );
};

Page.getLayout = (page: any) => (
    <Paper>
        {page}
    </Paper>
);

export default Page;

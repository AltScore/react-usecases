import {Page as PageType} from "../../types/page";
import {useSettings} from "../../hooks/use-settings";
import {useTranslation} from "react-i18next";
import {usePageView} from "../../hooks/use-page-view";
import {Seo} from "../../components/seo";
import {Box, Paper, Stack, Typography} from "@mui/material";

import {UsecaseExample} from "../../lib/ui-flows/example";

const Page: PageType = () => {
    const settings = useSettings();
    const { t } = useTranslation();

    usePageView();
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

Page.getLayout = (page) => (
    <Paper>
        {page}
    </Paper>
);

export default Page;

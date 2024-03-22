import { Provider as ReduxProvider } from 'react-redux';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { DefaultUsecasesBar, UsecasesBarProps } from './usecasesBar';
import { DefaultUsecaseContainer } from './DefaultUsecaseContainer';
import { DefaultUsecasePill, UsecasePillProps } from './UsecasePill';
import { store, thunk_AppSetup, thunk_SelectUsecase, useDispatch, useSelector } from './state';
import { TaskLogic } from '@/lib/usecases-ui/task';
import { initUsecasesApp } from '@/lib/usecases-ui/usecasesApp';
import { AliasRecord } from '@/lib/utils';
import { UsecaseData } from '@/lib/usecases-ui/UsecaseClass';
import { TaskInstance } from '@/lib/usecases-ui/TaskInstance';
import { useLoadUsecases, useTextQuery } from '@/lib/usecases-ui/CoreUtils';
import { Variant } from '@mui/material/styles/createTypography';

export type TextConfiguration = {
    label: string;
    variant?: Variant; // TODO: add variants instead of string
    color?: string; // TODO: filter string for colors instead of just a string
    align?: string; // TODO: filter string for alignment instead of just a string
};

export type LayoutConfiguration = {
    generalMarginTop?: string;
    introMarginTop?: string;
    textSpacing?: string;
    textPillSpacing?: string;
    generalAlignment?: string;
    textAlignment?: string;
    pillAlignment?: string;
    introWidth?: string;
    interPillSpacing?: string;
};

type UsecasesProps = {
    usecasesLoader: (textQuery: string) => Promise<UsecaseData[]>;
    introTitle?: TextConfiguration;
    introSubtitle?: TextConfiguration;
    layoutCustomization?: LayoutConfiguration;
    // UsecasePill is a function that will be used like <UsecasePill usecase={usecase}/>
    UsecasePill?: React.FC<UsecasePillProps>;
    UsecasesBar?: React.FC<UsecasesBarProps> | null;
    tasksLogic: AliasRecord<TaskLogic>;
    // usecase container has children
    UsecaseContainer?: React.FC<{
        children: ReactNode;
    }>;
    appName: string;
    // UsecasesLayout: React.FC<UsecasesLayoutProps>;
};

const Usecases = ({
    // strategy components
    usecasesLoader,
    UsecasePill = DefaultUsecasePill,
    introTitle = { label: '', variant: 'h3', color: '#111927', align: 'start' },
    introSubtitle = { label: '', variant: 'h2', color: '#6C737F', align: 'start' },
    layoutCustomization = {
        generalMarginTop: '0px',
        introMarginTop: '0px',
        textSpacing: '8px',
        textPillSpacing: '24px',
        generalAlignment: 'center',
        textAlignment: 'start',
        pillAlignment: 'center',
        introWidth: '768px',
        interPillSpacing: '12px',
    },
    // app logic components
    tasksLogic,
    appName,
    UsecasesBar = DefaultUsecasesBar,
    UsecaseContainer = DefaultUsecaseContainer,
}: UsecasesProps) => {
    // UI controls

    const [showPills, setShowPills] = useState(true);
    const [showBar, setShowBar] = useState(true);
    const [showUseCase, setShowUsecase] = useState(false);

    // app state TODO change to a usecases slice?
    const tasksState = useSelector((state) => state.tasks);
    const dispatch = useDispatch();

    // usecase loading
    const { textQuery, setTextQuery } = useTextQuery();
    const { reloadUsecases, loading } = useLoadUsecases(usecasesLoader, dispatch);

    useEffect(() => {
        reloadUsecases('').catch(console.error);
    }, [reloadUsecases]);

    useEffect(() => {
        reloadUsecases(textQuery).catch(console.error);
    }, [textQuery]);

    useEffect(() => {
        console.log('initiating app component');
        initUsecasesApp(appName, tasksLogic);
        dispatch(
            thunk_AppSetup({
                appName,
            }),
        );
    }, [appName, tasksLogic, dispatch]);

    const onUsecaseClicked = useCallback(
        (usecase: UsecaseData) => {
            // setShowPills(false)
            // setShowBar(false)
            dispatch(thunk_SelectUsecase({ usecaseId: usecase.id }));
        },
        [dispatch],
    );

    const usecaseSelectedId = tasksState?.currentUsecaseState?.usecaseData.id;
    console.log(tasksState);

    useEffect(() => {
        console.log('usecaseSelectedId', usecaseSelectedId);
        if (usecaseSelectedId) {
            setShowPills(false);
            setShowBar(false);
            setShowUsecase(true);
        } else {
            setShowPills(true);
            setShowBar(true);
            setShowUsecase(false);
            // reload usecases
            if (textQuery !== '') {
                setTextQuery('');
            } else {
                reloadUsecases('').catch(console.error);
            }
        }
    }, [usecaseSelectedId]);

    const usecasesData = tasksState?.usecasesData;

    // const pillArray = useMemo((): React.JSX.Element[] => {
    //     return usecasesData.map((usecaseData, index) => {
    //         return (
    //             <UsecasePill
    //                 key={index}
    //                 usecase={usecaseData}
    //                 onUsecaseClicked={onUsecaseClicked}
    //             />
    //         );
    //     });
    // }, [usecasesData, onUsecaseClicked]);

    return (
        <Stack
            id={'usecases-main-stack'}
            height={'100%'}
            width={'100%'}
            direction={'row'}
            justifyContent={'center'}
            marginTop={layoutCustomization.generalMarginTop}
        >
            <Stack
                id={'show-bar-and-pills-stack'}
                height={'100%'}
                width={layoutCustomization.introWidth}
                direction={'column'}
                justifyContent={layoutCustomization.generalAlignment}
                spacing={layoutCustomization.textPillSpacing}
                marginTop={layoutCustomization.introMarginTop}
            >
                {showBar && !loading && UsecasesBar && <UsecasesBar setTextQuery={setTextQuery} />}
                {showPills && !loading && usecasesData && (
                    <Stack
                        id={'landing-titles-box'}
                        width={'100%'}
                        height={'100%'}
                        spacing={layoutCustomization.textSpacing}
                    >
                        {introTitle.label != '' && (
                            <Typography
                                alignItems={introTitle.align ? introTitle.align : 'start'}
                                justifySelf={introTitle.align ? introTitle.align : 'start'}
                                variant={introTitle.variant ? introTitle.variant : 'h3'}
                                color={introTitle.color ? introTitle.color : '#111927'}
                            >
                                {introTitle.label}
                            </Typography>
                        )}
                        {introSubtitle.label != '' && (
                            <Typography
                                alignItems={introSubtitle.align ? introSubtitle.align : 'start'}
                                justifySelf={introSubtitle.align ? introSubtitle.align : 'start'}
                                variant={introSubtitle.variant ? introSubtitle.variant : 'h2'}
                                color={introSubtitle.color ? introSubtitle.color : '#6C737F'}
                            >
                                {introSubtitle.variant ? introSubtitle.variant : 'h2'}
                            </Typography>
                        )}
                    </Stack>
                )}
                {showPills && !loading && (
                    <Stack
                        id={'usecases-pills-column'}
                        width={'100%'}
                        direction={'column'}
                        justifySelf={'start'}
                        justifyContent={'start'}
                        alignItems={'start'}
                    >
                        <Stack
                            id={'usecases-pills-row'}
                            width={'100%'}
                            direction={'row'}
                            spacing={layoutCustomization.interPillSpacing}
                            flexWrap={'wrap'}
                            justifyContent={layoutCustomization.pillAlignment}
                            alignItems={layoutCustomization.pillAlignment}
                        >
                            {usecasesData &&
                                usecasesData.map((usecaseData, index) => {
                                    return (
                                        <UsecasePill
                                            key={index}
                                            usecase={usecaseData}
                                            onUsecaseClicked={onUsecaseClicked}
                                        />
                                    );
                                })}
                        </Stack>
                    </Stack>
                )}
            </Stack>
            {showUseCase && tasksState?.currentUsecaseState && (
                <UsecaseContainer>
                    <TaskInstance />
                </UsecaseContainer>
            )}
        </Stack>
    );
};

const UsecasesApp = (props: UsecasesProps) => {
    return (
        <ReduxProvider store={store}>
            <Usecases {...props} />
        </ReduxProvider>
    );
};

export { UsecasesApp };

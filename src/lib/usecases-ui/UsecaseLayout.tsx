import { Box, CardActionArea, Stack, Typography } from '@mui/material';
import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
import { UsecasesBarProps } from './usecasesBar';
import { DefaultUsecaseContainer } from './DefaultUsecaseContainer';
import { TaskInstance } from '@/lib/usecases-ui/TaskInstance';
import { UsecasesState } from './usecasesState';

export type UsecasesLayoutProps = {
    welcomeTitle?: string;
    welcomeSubtitle?: string;
    usecasesArray?: React.JSX.Element[];
    TaskContainer: React.FC<{
        children: ReactNode;
    }>;
    showUseCase?: boolean;
    tasksState?: UsecasesState;
};
export const DefaultLayout = ({
    welcomeTitle,
    welcomeSubtitle,
    usecasesArray,
    TaskContainer = DefaultUsecaseContainer,
    showUseCase,
    tasksState,
}: UsecasesLayoutProps) => {
    const LayoutComponent = useMemo(() => {
        return () => {
            return (
                <Stack>
                    {usecasesArray && welcomeTitle && welcomeSubtitle && (
                        <Box
                            width={'100%'}
                            height={'100%'}
                            alignItems={'start'}
                            marginBottom={'12px'}
                        >
                            {welcomeTitle != '' && (
                                <Typography
                                    alignItems={'start'}
                                    justifyContent={'start'}
                                    justifySelf={'start'}
                                    variant={'h5'}
                                >
                                    {welcomeTitle}
                                </Typography>
                            )}
                            {welcomeSubtitle != '' && (
                                <Typography
                                    alignItems={'start'}
                                    justifyContent={'start'}
                                    justifySelf={'start'}
                                    variant={'h2'}
                                    color={'textSecondary'}
                                >
                                    {welcomeSubtitle}
                                </Typography>
                            )}
                        </Box>
                    )}
                    {usecasesArray && (
                        <Stack
                            width={'100%'}
                            direction={'column'}
                            spacing={'24px'}
                            justifySelf={'start'}
                            justifyContent={'start'}
                            alignItems={'start'}
                        >
                            <Stack
                                width={'100%'}
                                direction={'row'}
                                gap={'1rem'}
                                flexWrap={'wrap'}
                                justifyContent={'start'}
                                alignItems={'start'}
                            >
                                {usecasesArray}
                            </Stack>
                        </Stack>
                    )}
                    {showUseCase && tasksState?.currentUsecaseState && (
                        <TaskContainer>
                            <TaskInstance />
                        </TaskContainer>
                    )}
                </Stack>
            );
        };
    }, [usecasesArray, showUseCase, tasksState, TaskContainer, welcomeTitle, welcomeSubtitle]);

    return LayoutComponent;
};

import { Box, Button, Paper, Typography } from '@mui/material';
import React from 'react';
import { UsecasesApp } from './index';
import { DefaultUsecasePill } from './UsecasePill';
import { TaskLogic } from '@/lib/usecases-ui/task';
import { AliasRecord } from '@/lib/utils';
import { UsecaseData } from '@/lib/usecases-ui/UsecaseClass';

const usecasesLoaderMock = async (textQuery: string): Promise<UsecaseData[]> => {
    return [
        {
            id: '1',
            rootTaskInstanceInput: {},
            name: 'Usecase 1',
            rootTaskInstanceAlias: 'task2',
            description: 'This is the first usecase',
            taskInstances: {
                task1: {
                    type: 'native',
                    slots: {
                        endGateway: 'EndUsecase',
                    },
                },
                task2: {
                    type: 'rooted',
                    slots: {
                        click1: 'task1',
                        outputToSend: '1',
                    },
                },
            },
        },
    ];
};

type NativeGateways = {
    endGateway: string;
};

type NativeInput = {
    key: string;
};

const NativeLogic: TaskLogic<NativeGateways, NativeInput> = {
    taskDefinition: {
        input: {
            key: {},
        },
    },
    gatewaysBuilder: (slots: any) => {
        return {
            endGateway: slots.endGateway,
        };
    },
    Component: (props) => {
        return (
            <Paper>
                <Typography>Native task</Typography>
                <Typography>Input: {props.inputs.key} </Typography>
                <Button
                    onClick={() => {
                        props.goTo(props.gateways.endGateway, {});
                    }}
                >
                    Go away
                </Button>
            </Paper>
        );
    },
};

type RootedGateways = {
    click1: string;
    outputToSend: string;
};

type RootedInput = {
    key: string;
};

const RootedLogic: TaskLogic<RootedGateways, RootedInput> = {
    taskDefinition: {
        input: {
            key: {},
        },
    },
    Component: (props) => {
        return (
            <Paper>
                <Typography>Rooted task</Typography>
                <Button
                    onClick={() => {
                        props.goTo(props.gateways.click1, {
                            key: props.gateways.outputToSend,
                        });
                    }}
                >
                    Go next
                </Button>
            </Paper>
        );
    },
    gatewaysBuilder: (slots: any) => {
        return {
            click1: slots.click1,
            outputToSend: slots.outputToSend,
        };
    },
};

const tasksLogic: AliasRecord<TaskLogic> = {
    native: NativeLogic,
    rooted: RootedLogic,
};

const UsecaseExample = () => {
    return (
        <Box
            padding={0}
            margin={0}
            height={'100%'}
            width={'100%'}
        >
            <UsecasesApp
                usecasesLoader={usecasesLoaderMock}
                UsecasePill={DefaultUsecasePill}
                appName={'usecases_example_index'}
                tasksLogic={tasksLogic}
            />
        </Box>
    );
};
export { UsecaseExample };

import {Box, Button, Paper, Typography} from "@mui/material";
import React from "react";
import {UsecasesApp} from "./index";
import {DefaultUsecasePill} from "./UsecasePill";
import {UsecaseData} from "@/lib/usecases-ui/Usecase";
import {AliasRecord, SystemAlias, TaskLogic} from "@/lib/usecases-ui/state";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";

const usecasesLoaderMock = async (textQuery: string): Promise<UsecaseData[]> => {
    return [
        {
            id: "1",
            rootTaskInstanceInput: {},
            name: "Usecase 1",
            rootTaskInstanceAlias: "task2",
            description: "This is the first usecase",
            taskInstances: {
                task1: {
                    type: "native",
                    slots: {
                        endGateway: "EndUsecase",
                    },
                },
                task2: {
                    type: "rooted",
                    slots: {
                        click1: "task1",
                        outputToSend: "1",
                    },
                }
            },
        }
    ]
}

const tasksDefinitions: AliasRecord<TaskDefinition> = {
    native: {
        input: {
        }
    },
    rooted: {
        input: {
            "key": {},
        },
    }
};

const tasksLogic: AliasRecord<TaskLogic> = {
    native: {
        component: (props) => {

            return (
                <Paper>
                    <Typography>Native task</Typography>
                    <Typography>Input: {props.inputs.key} </Typography>
                    <Button
                        onClick={() => {
                            props.goTo(props.gateways.endGateway, {
                            })
                        }}
                    >
                        Go away
                    </Button>
                </Paper>
            )
        },
        gatewaysBuilder: (slots: any) => {
            return {
                endGateway: slots.endGateway,
            }
        },
    },
    rooted: {
        component: (props) => {
            return (
                <Paper>
                    <Typography>Rooted task</Typography>
                    <Button
                        onClick={() => {
                            props.goTo(props.gateways.click1, {
                                key: props.gateways.outputToSend,
                            })
                        }}
                    >
                        Go next
                    </Button>
                </Paper>
            )
        },
        gatewaysBuilder: (slots: any) => {
            return {
                click1: slots.click1,
                outputToSend: slots.outputToSend,
            }
        },
    },
}


const UsecaseExample = () => {
    return <Box
        padding={0}
        margin={0}
        height={"100%"}
        width={"100%"}
    >
        <UsecasesApp
            usecasesLoader={usecasesLoaderMock}
            UsecasePill={DefaultUsecasePill}
            taskDefinitions={tasksDefinitions}
            appName={"usecases_example_index"}
            tasksLogic={tasksLogic}
        />
    </Box>
}
export {UsecaseExample};
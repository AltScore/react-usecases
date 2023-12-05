import {Box, Paper} from "@mui/material";

import {UsecaseData} from "@/lib/usecases-ui/Usecase";
import {Usecases} from "@/lib/usecases-ui";
import {DefaultUsecasePill} from "@/lib/usecases-ui/UsecasePill";
import React, {FC} from "react";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";
import {CompoundEntityCreator, IdentityFieldCreator, TextFieldCreator} from "@/components/tasks/example_2";
import {TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";

const usecasesLoaderMock = async (textQuery: string): Promise<UsecaseData[]> => {
    return [
        {
            name: "Usecase: Compound entity creation",
            rootTaskInstanceAlias: "compound_entity_creator_main",
            description: "Usecase for creating a compound entity",
            taskInstances: {
                compound_entity_creator_main: {
                    type: "compoundEntityCreator",
                    slots: {
                        "subentity_creators": [
                            {
                                label: "Text Field",
                                taskAlias: "text_field_creator1",
                            },
                            {
                                label: "Identity",
                                taskAlias: "identity_field_creator1",
                            }
                        ]
                    },
                },
                text_field_creator1: {
                    type: "textFieldCreator",
                    slots: {},
                },
                identity_field_creator1: {
                    type: "identityFieldCreator",
                    slots: {},
                }
            },
        }
    ]
}

const example2TaskComponents: Record<string, FC<TaskInstanceProps>> = {
    compoundEntityCreator: CompoundEntityCreator,
    textFieldCreator: TextFieldCreator,
    identityFieldCreator: IdentityFieldCreator,
}

const UsecaseExample2 = () => {
    const taskDefinitions: Record<string, TaskDefinition> = {
        compoundEntityCreator: {
            name: "compoundEntityCreator",
            inputs: {},
            outputs: {
                "new_entity": {
                    type: "compoundEntity",
                }
            },
            slots: {
                "subentity_creators": {
                    type: "list",
                }
            },
        },
        textFieldCreator: {
            name: "textFieldCreator",
            inputs: {},
            outputs: {
                "new_field": {
                    type: "textField",
                }
            },
            slots: {},
        },
        identityFieldCreator: {
            name: "identityFieldCreator",
            inputs: {},
            outputs: {
                "new_field": {
                    type: "identityField",
                }
            },
            slots: {},
        }
    };
    const taskComponents = example2TaskComponents;
    return <Box
        padding={0}
        margin={0}
        height={"100%"}
        width={"100%"}
    >
        <Usecases
            taskDefinitions={taskDefinitions}
            taskComponents={taskComponents}
            usecasesLoader={usecasesLoaderMock}
            UsecasePill={DefaultUsecasePill}
        />
    </Box>
}
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
                <UsecaseExample2/>
            </Box>
        </Paper>
    );
};

export default Page;

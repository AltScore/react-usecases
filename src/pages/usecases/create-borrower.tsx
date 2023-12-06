import {Box, Paper} from "@mui/material";

import {UsecaseData} from "@/lib/usecases-ui/Usecase";
import {Usecases} from "@/lib/usecases-ui";
import {DefaultUsecasePill} from "@/lib/usecases-ui/UsecasePill";
import React, {FC} from "react";
import {TaskDefinition} from "@/lib/usecases-ui/taskDefinition";
import {TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";
import {
    BorrowerFieldCreator,
    BorrowerFieldEditor,
    CreateBorrowerTask,
    IdentityFieldCreator
} from "@/components/tasks/create_borrower";


const taskDefinitions: Record<string, TaskDefinition> = {
    create_borrower: {
        name: "create_borrower",
        inputs: {},
        outputs: {
            "new_borrower": {
                type: "borrower",
            }
        },
        slots: {
            "label_field": {
                label: "string",
                task_alias: "string",
            },
            "sub_entities": {
                key: {
                    creator: {
                        label: "string",
                        task_alias: "string",
                    },
                    item_component: {
                        task_alias: "string",
                    }
                },
            }
        },
    },
    borrower_field_editor_widget: {
        name: "borrower_field_editor_widget",
        inputs: {
            "borrower_id": {
                type: "string",
            },
            "initial_value": {
                type: "string",
            }
        },
        outputs: {
            "edited_value": {
                type: "string",
            }
        },
        slots: {}
    },
    borrower_field_creator_widget: {
        name: "borrower_field_creator_widget",
        inputs: {
            "borrower_id": {
                type: "string",
            }
        },
        outputs: {
            "new_field": {
                type: "borrower_field",
            },
        },
        slots: {}
    },
    identity_creator_widget: {
        name: "identity_creator_widget",
        inputs: {
            "borrower_id": {
                type: "string",
            }
        },
        outputs: {
            "new_identity": {
                type: "identity",
            }
        },
        slots: {}
    },
    identity_editor_widget: {
        name: "identity_editor_widget",
        inputs: {
            "borrower_id": {
                type: "string",
            }
        },
        outputs: {
            "edited_value": {
                type: "string",
            }
        },
        slots: {}
    },
    borrower_label_widget: {
        name: "borrower_label_widget",
        inputs: {
            "borrower_id": {
                type: "string",
            }
        },
        outputs: {
            "edited_value": {
                type: "string",
            }
        },
        slots: {}
    }
};

const usecasesLoaderMock = async (textQuery: string): Promise<UsecaseData[]> => {
    return [
        {
            name: "Create a Borrower",
            rootTaskInstanceAlias: "create_borrower_",
            description: "You can create a borrower with this tool",
            taskInstances: {
                create_borrower_: {
                    type: "create_borrower",
                    slots: {
                        "sub_entities": {
                            "borrower_field": {
                                creator: {
                                    task_alias: "borrower_field_creator_widget_",
                                    label: "Borrower Field",
                                },
                                item_component: {
                                    task_alias: "borrower_field_editor_widget_",
                                }
                            },
                            "identity": {
                                creator: {
                                    task_alias: "identity_creator_widget_",
                                    label: "Identity",
                                },
                                item_component: {
                                    task_alias: "identity_editor_widget_",
                                }
                            }
                        }
                    }
                },
                borrower_field_creator_widget_: {
                    type: "borrower_field_creator_widget",
                    slots: {}
                },
                borrower_field_editor_widget_: {
                    type: "borrower_field_editor_widget",
                    slots: {}
                },
                identity_creator_widget_: {
                    type: "identity_creator_widget",
                    slots: {}
                },
                identity_editor_widget_: {
                    type: "identity_editor_widget",
                    slots: {}
                },
                borrower_label_widget_: {
                    type: "borrower_label_widget",
                    slots: {}
                }
            },
        }
    ]
}


const example2TaskComponents: Record<string, FC<TaskInstanceProps>> = {
    create_borrower: CreateBorrowerTask,
    borrower_field_creator_widget: BorrowerFieldCreator,
    borrower_field_editor_widget: BorrowerFieldEditor,
    identity_creator_widget: BorrowerFieldCreator,
    identity_editor_widget: BorrowerFieldEditor,
    borrower_label_widget: () => <div>borrower_label_widget</div>,
}

const UsecaseExample2 = () => {
    return <Box
        padding={0}
        margin={0}
        height={"100%"}
        width={"100%"}
    >
        <Usecases
            taskDefinitions={taskDefinitions}
            taskComponents={example2TaskComponents}
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

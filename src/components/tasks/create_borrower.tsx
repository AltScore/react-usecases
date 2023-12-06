import {TaskInstance, TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";
import {Box, Button, Paper, Stack, Typography} from "@mui/material";
import React, {FC} from "react";

interface Field {
    entityKey: string;
    id: string;
}

type SubentitySlots = {
    [key: string]: SubentitySlot;
};

type SubentitySlot = {
    creator: {
        label: string;
        task_alias: string;
    }
    item_component: {
        task_alias: string;
    }
}

export const CreateBorrowerTask = (props: TaskInstanceProps) => {
    const {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey
    } = props;

    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);

    const subentitySlots = taskInstanceConfiguration.slots["sub_entities"] as SubentitySlots;


    const subentityCreators = Object.keys(subentitySlots).map((entityKey) => {
        const subentitySlot = subentitySlots[entityKey];
        return {
            ...subentitySlot.creator,
            entityKey
        }
    });

    const [fields, setFields] = React.useState<Field[]>([]);
    const [showFieldOptions, setShowFieldOptions] = React.useState<boolean>(false);
    const [creatingField, setCreatingField] = React.useState<boolean>(false);
    const [selectedFieldCreator, setSelectedFieldCreator] = React.useState<any>(null);
    const [borrowerId, setBorrowerId] = React.useState<string | null>(null);


    return <Paper>
        {!creatingField ? <>
            <Stack
                direction={"column"}
            >
                <Box>
                    <Typography variant="h6">
                        {taskDefinition.name}
                    </Typography>
                </Box>
                <Stack
                    direction={"column"}
                >
                    {fields.map((field, index) => {
                        return <Box
                            key={field.id}
                            sx={{
                                border: "1px solid black",
                                borderRadius: "5px",
                                padding: "5px",
                                margin: "5px",
                            }}
                        >
                            <TaskInstance
                                inputs={{
                                    borrower_id: borrowerId,
                                    initial_value: field,
                                }}
                                taskAlias={subentitySlots[field.entityKey].item_component.task_alias}
                                usecasesHelper={usecasesHelper}
                                onCompleted={(_) => {
                                    // this means the field was deleted!
                                    setFields(fields.filter((f) => {
                                        return f.id !== field.id;
                                    }))
                                }}
                                shouldBeClosed={false}
                                setOutputKey={(key, value) => {
                                    if (key === "edited_value") {
                                        // handle edited value?
                                        alert("edited value")
                                    }
                                }}
                            />
                        </Box>
                    })}
                </Stack>
                <Button
                    onClick={() => {
                        setShowFieldOptions(!showFieldOptions)
                    }}
                >
                    {showFieldOptions ? "Cancel" : "Add field"}
                </Button>
                {showFieldOptions && <Stack
                    direction={"column"}
                >
                    {subentityCreators.map((subentityCreator: any, index: number) => {
                        return <Button
                            key={index}
                            onClick={() => {
                                setSelectedFieldCreator(subentityCreator);
                                setCreatingField(true);
                            }}
                        >
                            {subentityCreator.label}
                        </Button>
                    })}
                </Stack>}
                <Button
                    onClick={
                        () => {
                            onCompleted({
                                new_entity: {
                                    fields: fields,
                                }
                            })
                        }}
                >
                    OK I am done
                </Button>
            </Stack>
        </> : <Box>
            <Typography variant="h6">
                {selectedFieldCreator.label}
            </Typography>
            <Button
                onClick={() => {
                    setCreatingField(false);
                    setSelectedFieldCreator(null);
                    setShowFieldOptions(false)
                }}
            >
                Cancel
            </Button>
            <TaskInstance
                inputs={{
                    borrower_id: borrowerId,
                }}
                taskAlias={selectedFieldCreator["task_alias"]}
                usecasesHelper={usecasesHelper}
                onCompleted={(outputs: Record<string, any>) => {
                    const newField = {
                        ...outputs["new_field"],
                        entityKey: selectedFieldCreator.entityKey,
                    };

                    setCreatingField(false);
                    setSelectedFieldCreator(null);
                    setFields([...fields, newField]);
                    setShowFieldOptions(false)
                }}
                shouldBeClosed={false}
                setOutputKey={(key, value) => {
                    // do not handle this for now
                }}
            />
        </Box>
        }
    </Paper>
}

export const BorrowerFieldCreator: FC<TaskInstanceProps> = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }: TaskInstanceProps) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    const [key, setKey] = React.useState<string>("");
    const [value, setValue] = React.useState<string>("");
    return <Paper>
        <Box>
            <Typography variant="h6" component="div">
                {taskDefinition.name}
            </Typography>
            <Stack
                direction={"column"}
            >
                <Box>
                    <input
                        placeholder={"key"}
                        value={key}
                        onChange={(e) => {
                            setKey(e.target.value);
                        }}
                    />
                </Box>
                <Box>
                    <input
                        placeholder={"value"}
                        value={value}
                        onChange={(e) => {
                            setValue(e.target.value);
                        }}
                    />
                </Box>
                <Button
                    onClick={() => {
                        onCompleted({
                            new_field: {
                                key: key,
                                value: value,
                                type: "textField",
                            }
                        })
                    }}
                >
                    OK I am done
                </Button>
            </Stack>
        </Box>
    </Paper>
}

export const IdentityFieldCreator: FC<TaskInstanceProps> = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }: TaskInstanceProps) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    return <Paper>
        <Box>
            <Typography variant="h6" component="div">
                {taskDefinition.name}
            </Typography>
        </Box>
    </Paper>
}

export const BorrowerFieldEditor: FC<TaskInstanceProps> = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }: TaskInstanceProps) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    const [value, setValue] = React.useState<Field>(inputs["initial_value"]);
    return (
        <Paper>
            <Box>
                <Typography variant="h6" component="div">
                    {taskDefinition.name}
                </Typography>
                <Stack
                    direction={"column"}
                >
                    <Typography>
                        {value.key}
                    </Typography>
                    <Box>
                        <input
                            placeholder={"value"}
                            value={value.value}
                            onChange={(e) => {
                                setValue({
                                    ...value,
                                    value: e.target.value,
                                });
                            }}
                        />
                    </Box>
                    <Button
                        onClick={() => {
                            setOutputKey("edited_value", value);
                        }}
                    >
                        Set new value
                    </Button>
                </Stack>
            </Box>
        </Paper>
    )
}
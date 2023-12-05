import {TaskInstance, TaskInstanceProps} from "@/lib/usecases-ui/taskInstance";
import {Box, Button, Paper, Stack, Typography} from "@mui/material";
import React, {FC} from "react";

/*
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
 */
export const CompoundEntityCreator: FC<TaskInstanceProps> = (
    {
        inputs,
        taskAlias,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }: TaskInstanceProps) => {
    const taskInstanceConfiguration = usecasesHelper.getTaskInstanceConfiguration(taskAlias);
    const subentityCreators = taskInstanceConfiguration.slots["subentity_creators"];
    const taskDefinition = usecasesHelper.getTaskDefinitionForInstance(taskAlias);
    const [fields, setFields] = React.useState<any[]>([]);
    const [showFieldOptions, setShowFieldOptions] = React.useState<boolean>(false);
    const [creatingField, setCreatingField] = React.useState<boolean>(false);
    const [selectedFieldCreator, setSelectedFieldCreator] = React.useState<any>(null);
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
                            key={index}
                            sx={{
                                border: "1px solid black",
                                borderRadius: "5px",
                                padding: "5px",
                                margin: "5px",
                            }}
                        >
                            {JSON.stringify(field)}
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
                inputs={{}}
                taskAlias={selectedFieldCreator.taskAlias}
                usecasesHelper={usecasesHelper}
                onCompleted={(outputs: Record<string, any>) => {
                    setCreatingField(false);
                    setSelectedFieldCreator(null);
                    setFields([...fields, outputs["new_field"]]);
                    setShowFieldOptions(false)
                }}
                shouldBeClosed={false}
                setOutputKey={() => {
                }}
            />
        </Box>
        }
    </Paper>
}

export const TextFieldCreator: FC<TaskInstanceProps> = (
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
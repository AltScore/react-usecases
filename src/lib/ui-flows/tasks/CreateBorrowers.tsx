import {TaskInstanceWrapperProps} from "@/lib/ui-flows/taskInstance";
import {Box, Stack, Typography} from "@mui/material";
import React from "react";
import {Button} from "@mui/base";

type BorrowerField = {
    key: string;
    value: string;
}

type Borrower = {
    id: string;
    label: string;
    borrowerFields: Record<string, BorrowerField>
}

interface CreateBorrowersProps extends TaskInstanceWrapperProps {
}

export const CreateBorrowers = (
    {
        inputs,
        taskInstanceConfiguration,
        taskDefinition,
        usecasesHelper,
        onCompleted,
        shouldBeClosed,
        setOutputKey,
    }: CreateBorrowersProps
) => {
    const [createdBorrowers, setCreatedBorrowers] = React.useState<Borrower[]>([])
    const localOnCompleted = (output?: Borrower) => {
        if (output) {
            setCreatedBorrowers([...createdBorrowers, output])
        }
    }
    const [localShouldBeClosed, setLocalShouldBeClosed] = React.useState<boolean>(false)

    return <Stack>
        <Button
            onClick={() => {
                setOutputKey("borrowers", createdBorrowers)
                onCompleted({})
            }}
        >
            Exit
        </Button>
        CreateBorrowers
        <Button
            onClick={() => {

            }}
        >
            Create Borrower!
        </Button>
        <Typography>
            {JSON.stringify(createdBorrowers)}
        </Typography>
    </Stack>
}
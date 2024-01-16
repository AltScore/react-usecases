import { TextField } from "@mui/material";
import React from "react";
import {UsecasesBarProps} from "@/lib/usecases-ui/index";

interface DefaultUsecasesBarProps extends UsecasesBarProps {
}

export const DefaultUsecasesBar = (
    {
        setTextQuery,
    }: DefaultUsecasesBarProps
) => {
    const [value, setValue] = React.useState<string>('');
    return <TextField
        fullWidth
        variant="outlined"
        // we need to do something when user presses Enter
        placeholder={"What do you want to do?"}
        value={value}
        onChange={(event) => {
            setValue(event.target.value);
        }}
        onKeyDown={(event) => {
            if (event.key === 'Enter') {
                // @ts-ignore
                setTextQuery(value)
                console.log("Enter pressed")
            }
        }}
    />
}

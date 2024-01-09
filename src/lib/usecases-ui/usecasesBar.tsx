import { TextField } from "@mui/material";
import React from "react";

export type UsecasesBarProps = {
    setTextQuery: (textQuery: string) => void;
}
export const UsecasesBar = (
    {
        setTextQuery,
    }: UsecasesBarProps
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

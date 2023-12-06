export type InputSpec = {
    type?: string;
    schema?: any;
}
export type OutputSpec = {
    type?: string;
    schema?: any;
}
export type SlotSpec = any;

export type TaskDefinition = {
    name: string;
    inputs: Record<string, InputSpec>;
    // There are the slot schemas
    slots: Record<string, SlotSpec>;
    outputs: Record<string, OutputSpec>;
}
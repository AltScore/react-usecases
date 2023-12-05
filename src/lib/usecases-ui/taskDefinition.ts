export type InputSpec = {
    type: string;
}
export type OutputSpec = {
    type: string;
}
export type SlotSpec = {
    type: string;
}
export type TaskDefinition = {
    name: string;
    inputs: Record<string, InputSpec>;
    slots: Record<string, SlotSpec>;
    outputs: Record<string, OutputSpec>;
}
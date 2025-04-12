import { createState } from "./utils";

export type State<T> = ReturnType<typeof createState<T>>;

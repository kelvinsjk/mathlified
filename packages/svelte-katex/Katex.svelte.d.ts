import { SvelteComponentTyped } from "svelte";
declare const __propDef: {
    props: {
        displayMode?: boolean;
    };
    events: {
        [evt: string]: CustomEvent<any>;
    };
    slots: {
        default: {};
    };
};
export declare type KatexProps = typeof __propDef.props;
export declare type KatexEvents = typeof __propDef.events;
export declare type KatexSlots = typeof __propDef.slots;
export default class Katex extends SvelteComponentTyped<KatexProps, KatexEvents, KatexSlots> {
}
export {};

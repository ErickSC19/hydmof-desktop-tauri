import { type } from "os";
import { Component, createSignal } from "solid-js";

interface Alert {
    state: string,
    msg: string,
    show: boolean
}

const AlertInline: Component<{ params: Alert }> = (props) => {
    return (
        <p class={`block ${!props.params.show && "hidden"} text-center mt-4 text-sm border-l-4 py-2 px-2 ${props.params.state === "failed" && "bg-red-200 border-red-800 text-red-950"}${props.params.state === "success" && "bg-green-200 border-green-800 text-green-950"}${props.params.state === "stale" && "bg-yellow-200 border-yellow-800 text-yellow-950"} `}>{props.params.msg}</p>
    );
};

export default AlertInline;
export type {
    Alert
}
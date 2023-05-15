import { type } from "os";
import { Component, createSignal } from "solid-js";

interface Alert {
    failed: boolean,
    msg: string,
    show: boolean
}

const AlertInline: Component<{ params: Alert }> = (props) => {
    return (
        <p class={`block ${!props.params.show && "hidden"} text-center mt-4 text-sm border-l-4 py-2 px-2 ${props.params.failed ? "bg-red-100 border-red-800 text-red-950" : "bg-green-100 border-green-800 text-green-950"} `}>{props.params.msg}</p>
    );
};

export default AlertInline;
export type {
    Alert
}
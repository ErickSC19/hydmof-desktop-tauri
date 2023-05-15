import { Component, children, mergeProps } from "solid-js";

interface StringByString {
    [key: string]: string;
}

const ToolTip: Component<{ id: string, color?: string, position?: string, children: Element | null | string}> = (props) => {
    const merged = mergeProps({ color: "slate", position: "top"}, props);
    const child = children(() => <>{props.children}</>);
    const colors: StringByString = {
        "green": "bg-green-200 border-green-800 text-green-950",
        "red": "bg-red-200 border-red-800 text-red-950",
        "yellow": "bg-yellow-200 border-yellow-800 text-yellow-950",
        "slate": "bg-slate-200 border-slate-800 text-slate-950"
    }
    const positions: StringByString = {
        "right": `tooltipright after:border-r-${props.color}-200 `,
        "left": `after:border-l-${props.color}-200 tooltipleft`,
        "top": `tooltiptop after:border-t-${props.color}-800 `,
        "bottom": `tooltipbottom after:border-b-${props.color}-200 `,
    }
    return <div id={props.id} class={`tooltip ${positions[merged.position]} ${colors[merged.color]}`}>{child()}</div>;
};

export default ToolTip;
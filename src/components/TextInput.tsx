import { Component, mergeProps, splitProps } from 'solid-js';

import { JSX } from 'solid-js';
import ToolTip from './ToolTip';

type TextInputProps = {
  name: string;
  type: 'text' | 'email' | 'tel' | 'password' | 'url' | 'date';
  label?: string;
  placeholder?: string;
  value: string | undefined;
  error: string;
  tooltipPosition?: string;
  required?: boolean;
  ref: (element: HTMLInputElement) => void;
  onInput: JSX.EventHandler<HTMLInputElement, InputEvent>;
  onChange: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur: JSX.EventHandler<HTMLInputElement, FocusEvent>;
};

function TextInput(props: TextInputProps) {
  const merged = mergeProps({tooltipPosition: "right"}, props);
  const [, inputProps] = splitProps(props, ['value', 'label', 'error']);
  return (
    <div class='relative inline-block overflow-visible'>
      {props.label && (
        <label for={props.name}>
          {props.label} {props.required && <span>*</span>}
        </label>
      )}
      <input
        {...inputProps}
        id={props.name}
        value={props.value || ''}
        aria-invalid={!!props.error}
        aria-errormessage={`${props.name}-error`}
        class={`${props.error ? 'bg-red-50 placeholder-red-400 text-red-950 border-red-300 focus:ring-red-800 focus:border-red-800 focus:ring-1' : 'border-slate-300 placeholder-slate-400 focus:ring-blue-600 focus:border-blue-600 focus:ring-1'} focus:ring-0 focus:z-10 shadow-none font-normal rounded text-inherit px-3 py-2 w-full`}
      />
      {props.error && <ToolTip id={`${props.name}-error`} color='red' position={merged.tooltipPosition}>{props.error || ""}</ToolTip>}
    </div>
  );
}

export default TextInput;

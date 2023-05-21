import { Form, SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { Component } from "solid-js";
import { changePasswordSchema } from "../types/AuthTypes";
import { z } from "zod";
import AlertInline, { Alert } from "../components/AlertInline";
import { createStore } from "solid-js/store";
import TextInput from "../components/TextInput";
import { A } from "@solidjs/router";
import { useAuthStore } from "../store/authStore";
import { invoke } from "@tauri-apps/api";
import { shallow } from "zustand/shallow";

const ChangePassword: Component<{}> = (props) => {
  const { idToChase } = useAuthStore((state) => ({
    idToChase: state.idToChase
  }), shallow);
  const { setIdToChase } = useAuthStore((state) => ({
    setIdToChase: state.setIdToChase
  }));
  const [changePasswordForm, { Form, Field, FieldArray }] = createForm<z.infer<typeof changePasswordSchema>>({
    validate: zodForm(changePasswordSchema),
  });
  const [alert, setAlert] = createStore<Alert>({ state: "failed", msg: "hola", show: false });

  const handleSubmit: SubmitHandler<z.infer<typeof changePasswordSchema>> = async (values, event) => {
    setAlert((alert) => ({ state: "failed", msg: "-", show: false }));
    const { password } = values;
    const res: string = await invoke('retrievep', {uid: idToChase, password: password});
    const status = res.split('-');
    if (status[0] !== "\"400") {
      const format = res.split('"')
      setAlert( (alert) => ({ state: "success", msg: `${format[1]}`, show: true }));
      setIdToChase(null);
    } else {
      setAlert( (alert) => ({ state: "failed", msg: `${status[1]}`, show: true }));
    }
  }

  return (<div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
    <h1 class="font-bold text-2xl leading-9 mt-4 text-center">
      Nueva Contraseña
    </h1>
    <Form onSubmit={handleSubmit} class="mt-5 flex flex-col">
      <AlertInline params={alert} />
      <Field name="password">
        {(field, props) => (
          <TextInput {...props} tooltipPosition="left" value={field.value} error={field.error} type="password" placeholder="Contraseña" required />
        )}
      </Field>
      <Field name="repassword">
        {(field, props) => (
          <TextInput {...props} value={field.value} error={field.error} type="password" placeholder="Repetir contraseña" required />
        )}
      </Field>
      <A href="/" class="mx-auto">Ir al login</A>

      <input type="submit" value="Guardar nueva contraseña" disabled={ idToChase ? true : false} class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
      <p class="mx-auto text-center mt-4 text-sm">¿No tienes cuenta? <br /> <A href="/registro">registrate aquí</A></p>
    </Form>
  </div>);
};

export default ChangePassword;
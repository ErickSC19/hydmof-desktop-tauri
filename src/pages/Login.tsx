import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/tauri";
import logo from "../assets/Logo_Hydromotors.svg";
import { Form, SubmitHandler, createForm, zodForm } from "@modular-forms/solid";
import { loginSchema } from "../types/AuthTypes";
import { z } from "zod";
import TextInput from "../components/TextInput";
import AlertInline, { Alert } from "../components/AlertInline";
import { appWindow } from '@tauri-apps/api/window';
import { createStore } from "solid-js/store";
import { useAuthStore } from "../store/authStore";


const Login: Component<{}> = (props) => {
  const [loginForm, { Form, Field, FieldArray }] = createForm<z.infer<typeof loginSchema>>({
    validate: zodForm(loginSchema),
  });
  const [alert, setAlert] = createStore<Alert>({ state: "failed", msg: "-", show: false });
  const { setToken, getBackAuth, keepSession } = useAuthStore((state) => ({
    setToken: state.setToken,
    getBackAuth: state.getBackAuth,
    keepSession: state.keepSession
  }));
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (values, event) => {
    console.log(values);
    setAlert((alert) => ({ state: "failed", msg: "-", show: false }));
    const { email, password, remember } = values;
    const res: string = await invoke('login', { email: email, password: password });
    console.log('res---->', res);

    const status = res.split('-');
    console.log(status);
    if (status[0] == '"400') {
      setAlert((alert) => ({ state: "failed", msg: `${status[1]}`, show: true }));
    } else if (status[0] == '"401') {
      setAlert((alert) => ({ state: "stale", msg: "Cuenta no confirmada", show: true }));
      localStorage.setItem("em", `${email}`);
      setTimeout(() => {
        navigate('/confirmar/registro')
      }, 1000);
    } else {
      setAlert((alert) => ({ state: "success", msg: "Iniciando sesión", show: true }));
      const format = res.split('"')
      localStorage.setItem("hydmot_token", `${format[1]}`);
      if (remember) {
        localStorage.setItem("open", `true`);
        keepSession(true);
      }
      setToken(format[1]);
      getBackAuth(format[1]);
      setTimeout(() => {
        appWindow.toggleMaximize();
        navigate('/finanzas')
      }, 1000);
    }
  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <img src={logo} alt="logo" class="w-auto h-24 mx-auto" />

      <h1 class="font-bold text-2xl leading-9 mt-4 text-center">
        Login
      </h1>
      <Form onSubmit={handleSubmit} class="mt-5 flex flex-col">
        <AlertInline params={alert} />
        <Field name="email">
          {(field, props) => (
            <TextInput {...props} tooltipPosition="left" value={field.value} error={field.error} type="email" placeholder="E-Mail" required />
          )}
        </Field>
        <Field name="password">
          {(field, props) => (
            <TextInput {...props} value={field.value} error={field.error} type="password" placeholder="Contraseña" required />
          )}
        </Field>
        <div class="text-sm mt-4 flex px-1">
          <Field name="remember" type="boolean">
            {(field, props) => (
              <label>
                <input {...props} type="checkbox" checked={field.value} class="mr-auto border-slate-300"/>
                 {" "}Recordar
              </label>
            )}
          </Field>
          <A href="/recuperar-pass" class="ml-auto" onClick={() => localStorage.setItem("op", "new")}>¿Olvidaste la contraseña?</A>
        </div>
        <input type="submit" value="Login" class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        <p class="mx-auto text-center mt-4 text-sm">¿No tienes cuenta? <br /> <A href="/registro">registrate aquí</A></p>
      </Form>
    </div>
  );
};

export default Login;
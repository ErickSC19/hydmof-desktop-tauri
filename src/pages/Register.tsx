import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api";
import AlertInline, { Alert } from "../components/AlertInline";
import { createForm, zodForm, email, minLength, required, SubmitHandler } from "@modular-forms/solid";
import { LoginForm, RegisterForm, registerSchema } from "../types/AuthTypes";
import { z } from 'zod';
import TextInput from "../components/TextInput";

const Register: Component<{}> = (props) => {

  const [loginForm, { Form, Field, FieldArray }] = createForm<z.infer<typeof registerSchema>>({
    validate: zodForm(registerSchema),
  });

  //const [username, setUsername] = createSignal<string>("");
  //const [email, setEmail] = createSignal<string>("");
  //const [password, setPassword] = createSignal<string>("");
  //const [rePassword, setRePassword] = createSignal<string>("");
  const [alert, setAlert] = createStore<Alert>({ state: "failed", msg: "hola", show: false });
  const navigate = useNavigate();

  const handleSubmit: SubmitHandler<z.infer<typeof registerSchema>> = async (values, event) => {
    loginForm.submitting;
    setAlert((alert) => ({ state: "failed", msg: "-", show: false }));
    const { username, email, password, repassword } = values;
    if (password === repassword) {
      const res = await invoke('register', { email: email, password: password, username: username })
      if (res === 'pass') {
        setAlert((alert) => ({ state: "success", msg: "Registro completado, revisa tu email para obtener tu codigo", show: true }));
        localStorage.setItem("em", `${email}`);
        navigate('/Confirmar')
      } else {
        setAlert((alert) => ({ state: "failed", msg: `${res}`, show: true }));
      }
    }
    setAlert((alert) => ({ state: "failed", msg: "Los campos de contraseña no coinciden", show: true }));
  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <h1 class="font-bold text-2xl leading-9 mt-5 text-center">
        Registro
      </h1>
      <div class="text-inherit flex flex-col mt-5">
        <Form onSubmit={handleSubmit} class="mt-5 flex flex-col">
          <AlertInline params={alert} />
          <Field name="username">
            {(field, props) => (
              <TextInput {...props} value={field.value} error={field.error} type="text" placeholder="Nombre de usuario" required />
            )}
          </Field>
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
          <Field name="repassword">
          {(field, props) => (
              <TextInput {...props} tooltipPosition="left" value={field.value} error={field.error} type="password" placeholder="Repetir contraseña" required />
            )}
          </Field>
          <input type="submit" value="Registrarse" class="mt-4 flex w-full justify-center rounded-md transition-colors bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        </Form>
        <p class="mx-auto text-center text-sm mt-4 text-gray-500"><span class="text-red-500">*</span>Se usara el correo para completar el registro</p>
        <p class="mx-auto text-center mt-4 text-sm">¿Ya tienes cuenta? <br /> <A href="/">inicia sesión</A></p>
      </div>
    </div>
  );
};

export default Register;
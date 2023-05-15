import { Component, createSignal } from "solid-js";
import { createStore } from "solid-js/store";
import { A, useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api";
import AlertInline, { Alert } from "../components/AlertInline";

const Register: Component<{}> = (props) => {
  const [username, setUsername] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [rePassword, setRePassword] = createSignal<string>("");
  const [alert, setAlert] = createStore<Alert>({ failed: false, msg: "hola", show: false });
  const navigate = useNavigate();
  alert
  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setAlert( (alert) => ({ failed: true, msg: "adios", show: false }));
    if (password() === rePassword()) {
      const res = await invoke('register', { email: email(), password: password(), username: username() })
      if (res === 'pass') {
        setAlert( (alert) => ({ failed: false, msg: "Registro completado, revisa tu email para obtener tu codigo", show: true }));
        localStorage.setItem("em", `${email()}`);
        navigate('/Confirmar')
      } else {
        setAlert( (alert) => ({ failed: false, msg: `${res}`, show: true }));
      }
    }
    setAlert( (alert) => ({ failed: true, msg: "adios", show: true }));
  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <h1 class="font-bold text-2xl leading-9 mt-5 text-center">
        Registro
      </h1>
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-5">
        <AlertInline params={alert} />
        <input value={username()} type="text" placeholder="Nombre" required onInput={e => setUsername(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal rounded-bl-none rounded-br-none text-inherit mt-5 px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <input value={email()} type="email" placeholder="Correo" autocomplete="email" required onInput={e => setEmail(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal text-inherit px-3 py-2 w-full border-slate-300 placeholder-slate-400 placeholder:after:content-['*'] placeholder:after:ml-0.5 placeholder:after:text-red-500" />
        <input value={password()} type="password" placeholder="Contraseña" required onInput={e => setPassword(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal text-inherit px-3 py-2 w-full border-slate-300 placeholder-slate-400" />
        <input value={rePassword()} type="password" placeholder="Confirmar contraseña" required onInput={e => setRePassword(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal rounded-tl-none rounded-tr-none text-inherit px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <p class="mx-auto text-center text-sm mt-4 text-gray-500"><span class="text-red-500">*</span>Se usara el correo para completar el registro</p>
        <input type="submit" value="Registrarse" class="mt-4 flex w-full justify-center rounded-md transition-colors bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        <p class="mx-auto text-center mt-4 text-sm">¿Ya tienes cuenta? <br /> <A href="/">inicia sesión</A></p>
      </form>
    </div>
  );
};

export default Register;
import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";
import { invoke } from "@tauri-apps/api/tauri";
import logo from "../assets/Logo_Hydromotors.svg";


const Login: Component<{}> = (props) => {
  const [password, setPassword] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    navigate('/Finanzas')

  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <img src={logo} alt="logo" class="w-auto h-24 mx-auto"/>

      <h1 class="font-bold text-2xl leading-9 mt-4 text-center">
        Login
      </h1>
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-4">
        <input value={email()} type="email" placeholder="Correo" autocomplete="email" required onInput={e => setEmail(e.currentTarget.value)} class="focus:z-10 shadow-none box-border font-normal rounded-bl-none rounded-br-none text-inherit mt-4 px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <input value={password()} type="password" placeholder="Contraseña" required onInput={e => setPassword(e.currentTarget.value)} class="focus:z-10 shadow-none box-border font-normal rounded-tl-none rounded-tr-none text-inherit px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <A href="/recuperar-pass" class="ml-auto text-sm mt-4" onClick={() => localStorage.setItem("op", "new")}>¿Olvidaste la contraseña?</A>
        <input type="submit" value="Login" class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        <p class="mx-auto text-center mt-4 text-sm">¿No tienes cuenta? <br /> <A href="/registro">registrate aquí</A></p>
      </form>
    </div>
  );
};

export default Login;
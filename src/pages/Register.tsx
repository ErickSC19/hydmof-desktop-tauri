import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";

const Register: Component<{}> = (props) => {
  const [username, setUsername] = createSignal<string>("");
  const [email, setEmail] = createSignal<string>("");
  const [password, setPassword] = createSignal<string>("");
  const [rePassword, setRePassword] = createSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    navigate('/Confirmar')

  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96">
      <h1 class="font-bold text-2xl leading-9 mt-5">
        Registro
      </h1>
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-5">
        <input value={email()} type="text" placeholder="Nombre" required onInput={e => setEmail(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal rounded-bl-none rounded-br-none text-inherit mt-5 px-3 py-2 w-full rounded-md border-slate-300" />
        <input value={email()} type="email" placeholder="Correo" autocomplete="email" required onInput={e => setEmail(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal text-inherit px-3 py-2 w-full border-slate-300" />
        <input value={password()} type="password" placeholder="Contraseña" required onInput={e => setPassword(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal text-inherit px-3 py-2 w-full border-slate-300" />
        <input value={rePassword()} type="password" placeholder="Confirmar contraseña" required onInput={e => setRePassword(e.currentTarget.value)} class="focus:z-10 shadow-none font-normal rounded-tl-none rounded-tr-none text-inherit px-3 py-2 w-full rounded-md border-slate-300" />
        <p class="mx-auto text-center text-sm mt-4 text-gray-500"><span class="text-red-500">*</span>Se usara el correo para completar el registro</p>
        <input type="submit" value="Registrarse" class="mt-4 flex w-full justify-center rounded-md transition-colors bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        <p class="mx-auto text-center mt-4 text-sm">¿Ya tienes cuenta? <br /> <A href="/">inicia sesión</A></p>
      </form>
    </div>
  );
};

export default Register;
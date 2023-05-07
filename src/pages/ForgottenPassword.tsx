import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";

const ForgottenPassword: Component<{}> = (props) => {
  const [email, setEmail] = createSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    navigate('/Confirmar')

  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col w-96">
      <h1 class="font-bold text-2xl leading-9 mt-5">
        Recuperar Contraseña
      </h1>
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-5">
        <input value={email()} type="email" placeholder="correo@c" autocomplete="email" required onInput={e => setEmail(e.currentTarget.value)} class="focus:z-10 shadow-none box-border font-normal text-inherit mt-5 px-3 py-2 w-full rounded-md placeholder-slate-400 border-slate-300 focus:invalid:border-pink-500 focus:invalid:text-pink-600 focus:invalid:ring-pink-500" />
        <p class="mx-auto text-center mt-4 text-sm p-1 text-gray-500">Enviaremos un codigo de recuperación al correo que proporciones para que puedas recuperar tu cuenta</p>
        <input type="submit" value="Enviar Codigo" class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer" />
        <p class="mx-auto text-center mt-4 text-sm">Ahora puedes <br /> <A href="/">ir al login</A></p>
      </form>
    </div>
  );
};

export default ForgottenPassword;
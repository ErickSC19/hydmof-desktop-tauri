import { Component, createSignal } from "solid-js";
import { A, useNavigate } from "@solidjs/router";

const Confirm: Component<{}> = (props) => {
  const [token, setToken] = createSignal<string>("");
  const navigate = useNavigate();

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    navigate('/Finanzas')
  }

  const resendCode = () => {

  }
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <h1 class="font-bold text-2xl leading-9 mt-5 text-center">
        Confirmar cuenta
      </h1>
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-5">
      <p class="mx-auto text-center mt-4 text-sm p-1 text-gray-500">Escribe el codigo que te llegó al correo</p>
        <input value={token()} type="text" placeholder="codigo" required onInput={e => setToken(e.currentTarget.value)} class="focus:z-10 shadow-none box-border font-normal text-inherit mt-5 px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <button type="button" onclick={() => resendCode()} class="mx-auto py-0 shadow-none bg-transparent active:bg-transparent border-0 text-sm mt-4 text-blue-500 hover:text-cyan-300" >Re-enviar codigo</button>
        <input type="submit" value="Confirmar" class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer placeholder-slate-400" />
        <p class="mx-auto text-center mt-4 text-sm">Ahora puedes <br /> <A href="/">ir al login</A></p>
      </form>
    </div>
  );
};

export default Confirm;
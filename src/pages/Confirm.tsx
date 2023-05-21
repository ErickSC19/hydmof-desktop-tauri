import { Component, createSignal, onMount } from "solid-js";
import { A, useNavigate, useParams } from "@solidjs/router";
import { invoke } from "@tauri-apps/api";
import AlertInline, { Alert } from "../components/AlertInline";
import { createStore } from "solid-js/store";
import { useAuthStore } from "../store/authStore";

const Confirm: Component<{}> = (props) => {
  const params = useParams();
  const { setIdToChase } = useAuthStore((state) => ({
    setIdToChase: state.setIdToChase
  }));
  const [token, setToken] = createSignal<string>("");
  const [email, setEmail] = createSignal<string | null>("");
  const [alert, setAlert] = createStore<Alert>({ state: "failed", msg: "hola", show: false });
  const navigate = useNavigate();

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const res: string = await invoke('confirm', {email: email(), code: token()});
    const status = res.split('-');
    if (status[0] !== "\"400") {
      localStorage.removeItem("em");
      const format = res.split('"')
      setIdToChase(format[1]);
      setTimeout(() => {
        navigate('/');
      }, 1000);
      setAlert( (alert) => ({ state: "success", msg: `Codigo confirmado, redirigiendo al login`, show: true }));
    } else {
      setAlert( (alert) => ({ state: "failed", msg: `${status[1]}`, show: true }));
    }
  }

  const resendCode = async () => {
    await invoke('resend', {email: email()});
    setAlert( (alert) => ({ state: "stale", msg: `Codigo reenviado a ${email()}`, show: true }));
  }

  onMount(async () => {
    const e: string | null = localStorage.getItem("em");
    setEmail(e);
    if (params.option === 'registro') {  
      const res = invoke('resend', {email: email()});
      console.log(res);  
    }
  })
  return (
    <div class="bg-white rounded-md border text-gray-900 border-slate-300 p-10 flex flex-col min-w-fit w-96 z-[5]">
      <h1 class="font-bold text-2xl leading-9 mt-5 text-center">
        {params.option === "registro" ? "Confirmar cuenta" : "Recuperar contraseña"}
      </h1>
      <AlertInline params={alert} />
      <form action="" onsubmit={e => handleSubmit(e)} class="text-inherit flex flex-col mt-5">
      <p class="mx-auto text-center mt-4 text-sm p-1 text-gray-500">Escribe el codigo que te llegó al correo <br /> {email && ": " + email()}</p>
        <input value={token()} type="text" placeholder="codigo" required onInput={e => setToken(e.currentTarget.value)} class="focus:z-10 shadow-none box-border font-normal text-inherit mt-5 px-3 py-2 w-full rounded-md border-slate-300 placeholder-slate-400" />
        <button type="button" onclick={() => resendCode()} class="mx-auto py-0 shadow-none bg-transparent active:bg-transparent border-0 text-sm mt-4 text-blue-500 hover:text-cyan-300" >Re-enviar codigo</button>
        <input type="submit" value="Confirmar" class="mt-4 flex w-full justify-center rounded-md bg-primary-800 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700 hover:cursor-pointer placeholder-slate-400" />
        <p class="mx-auto text-center mt-4 text-sm">Ahora puedes <br /> <A href="/">ir al login</A></p>
      </form>
    </div>
  );
};

export default Confirm;
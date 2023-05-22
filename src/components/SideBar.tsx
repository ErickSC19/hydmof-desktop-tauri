import { Component } from "solid-js";
import logo from "../assets/Logo_Hydromotors.svg";
import { calendarDays, currencyDollar, clipboardDocumentList, userCircle, creditCard } from "solid-heroicons/outline";
import { Icon } from "solid-heroicons";
import { A } from "@solidjs/router";
import { useAuthStore } from "../store/authStore";

const SideBar: Component<{}> = (props) => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth,
  }));
  
  return (
    <div class="lg:w-[20%] w-1/12 bg-gray-800 text-white lg:p-4 p-2 flex flex-col">
      <img src={logo} alt="logo" class="w-auto h-16 mx-auto mt-2 lg:p-0 p-1" />
      <A href="/finanzas" class="lg:mt-16 mt-8 hover:bg-gray-700 hover:text-white rounded p-2 text-white flex items-center">
      <Icon path={calendarDays} style="width: 48px;" />
      <span class="ml-4 text-lg font-bold lg:block hidden">Años</span>
      </A>
      <A href="/finanzas/costos" class="mt-2 hover:bg-gray-700 hover:text-white rounded p-2 text-white flex items-center">
      <Icon path={currencyDollar} style="width: 48px;" />
      <span class="ml-4 text-lg font-bold lg:block hidden">Costos</span>
      </A>
      <A href="/finanzas/resultados" class="mt-2 hover:bg-gray-700 hover:text-white rounded p-2 text-white flex items-center">
      <Icon path={clipboardDocumentList} style="width: 48px;" />
      <span class="ml-4 text-lg font-bold lg:block hidden">Resultados</span>
      </A>
      <A href="/finanzas/cuentas" class="mt-2 hover:bg-gray-700 hover:text-white rounded p-2 text-white flex items-center">
      <Icon path={creditCard} style="width: 48px;" />
      <span class="ml-4 text-lg font-bold lg:block hidden">Cuentas</span>
      </A>
      <A href="/finanzas/perfil" class="mt-auto hover:bg-gray-700 hover:text-white rounded p-2 text-white flex items-center">
      <Icon path={userCircle} style="width: 48px;" />
      <span class="ml-4 text-lg font-bold lg:block hidden">{auth?.username}</span>
      </A>
    </div>
  );
};

export default SideBar;
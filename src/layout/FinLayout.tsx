import { Component } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { useAuthStore } from "../store/authStore";
import SideBar from "../components/SideBar";

const FinLayout: Component<{}> = (props) => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth,
  }));
  
  return (
    <main class="w-screen bg-slate-50 text-slate-950 font-sans min-h-screen text-base flex">
      <SideBar />
      {auth?.admin_id ? <Outlet /> : <Navigate href="/" />}
    </main>
  );
};

export default FinLayout;
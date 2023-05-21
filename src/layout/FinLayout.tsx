import { Component } from "solid-js";
import { Navigate, Outlet } from "@solidjs/router";
import { useAuthStore } from "../store/authStore";

const FinLayout: Component<{}> = (props) => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth,
  }));
  
  return (
    <div class="w-screen bg-slate-50 text-slate-950 font-sans min-h-screen text-base flex">
      {auth?.admin_id ? <Outlet /> : <Navigate href="/" />}
    </div>
  );
};

export default FinLayout;
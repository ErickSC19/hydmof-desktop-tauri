import { Component, createMemo } from "solid-js";
import { Outlet, useLocation } from "@solidjs/router";

const AuthLayout: Component<{}> = (props) => {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);
  console.log(pathname);
  
  return (
    <main class="w-screen bg-slate-50 text-slate-950 font-sans min-h-screen text-base flex flex-col justify-center items-center">
      <Outlet />
    </main>
  );
};

export default AuthLayout;
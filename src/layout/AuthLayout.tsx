import { Component, createMemo } from "solid-js";
import { Outlet, useLocation } from "@solidjs/router";

const AuthLayout: Component<{}> = (props) => {
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);
  console.log(pathname);
  
  return (
    <main class="w-screen bg-slate-50 text-slate-950 font-sans min-h-screen text-base flex flex-col justify-center items-center">
      <Outlet />
      <div class="wavy-top absolute inset-x-0 bottom-0 h-16 mb-3"></div>
      <div class="wavy absolute inset-x-0 bottom-0 h-16"></div>
    </main>
  );
};

export default AuthLayout;
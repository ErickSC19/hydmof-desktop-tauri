import { Component, createMemo, onMount } from 'solid-js';
import { Navigate, Outlet, useLocation, useNavigate } from '@solidjs/router';
import { useAuthStore } from '../store/authStore';
import { shallow } from 'zustand/shallow';
import { appWindow } from '@tauri-apps/api/window';


const AuthLayout: Component<{}> = (props) => {
  const { auth } = useAuthStore((state) => ({
    auth: state.auth,
  }), shallow);
  const { setToken, getBackAuth } = useAuthStore((state) => ({
    setToken: state.setToken,
    getBackAuth: state.getBackAuth
  }));
  const location = useLocation();
  const pathname = createMemo(() => location.pathname);
  console.log(pathname);
  const navigate = useNavigate();
  
  onMount(async () => {
    const t: string | null = localStorage.getItem('hydmot_token');
    if (t) {
      try {
        setToken(t);
        await getBackAuth(t);
        await appWindow.toggleMaximize();
        navigate('/finanzas')
      } catch (error) {
        console.log('---> ', error);
      }
    }
  });
  return (
    <main class="w-screen bg-slate-50 text-slate-950 font-sans min-h-screen text-base flex flex-col justify-center items-center">
      {auth?.admin_id ? <Navigate href="/finances" /> : <Outlet />}
      <div class="wavy-top absolute inset-x-0 bottom-0 h-16 mb-3"></div>
      <div class="wavy absolute inset-x-0 bottom-0 h-16"></div>
    </main>
  );
};

export default AuthLayout;

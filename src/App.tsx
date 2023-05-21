import { createSignal } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import FinLayout from "./layout/FinLayout";
import Login from "./pages/Login";
import AuthLayout from "./layout/AuthLayout";
import Finances from "./pages/Finances";
import {attachDebugger} from '@solid-devtools/debugger';
import { attachDevtoolsOverlay } from '@solid-devtools/overlay'
import Register from "./pages/Register";
import Confirm from "./pages/Confirm";
import ForgottenPassword from "./pages/ForgottenPassword";
import ChangePassword from "./pages/ChangePassword";
import { appWindow } from "@tauri-apps/api/window";
import { exit } from '@tauri-apps/api/process';

function App() {
  attachDebugger();
  // attachDevtoolsOverlay()
  appWindow.onCloseRequested(async (event) => {
    const t: string | null = localStorage.getItem('open'); 
    if (!t) {
      localStorage.removeItem('hydmot_token');
    }
  });
  return (
    <Router>
      <Routes>
        <Route path="/" component={AuthLayout}>
          <Route path="/" component={Login} />
          <Route path="registro" component={Register} />
          <Route path="confirmar/:option" component={Confirm} />
          <Route path="recuperar-pass" component={ForgottenPassword} />
          <Route path="restablecer-pass" component={ChangePassword} />
        </Route>
        <Route path="/finanzas" component={FinLayout}>
          <Route path="/" component={Finances} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

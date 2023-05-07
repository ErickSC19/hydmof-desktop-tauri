import { createSignal } from "solid-js";
import { Router, Routes, Route } from "@solidjs/router";
import logo from "./assets/logo.svg";
import { invoke } from "@tauri-apps/api/tauri";
import "./App.css";
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


function App() {
  attachDebugger();
  // attachDevtoolsOverlay()
  const [greetMsg, setGreetMsg] = createSignal("");
  const [name, setName] = createSignal("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name: name() }));
  }

  return (
    <Router>
      <Routes>
        <Route path="/" component={AuthLayout}>
          <Route path="/" component={Login} />
          <Route path="registro" component={Register} />
          <Route path="confirmar" component={Confirm} />
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

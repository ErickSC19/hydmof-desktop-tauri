import { Component } from "solid-js";
import { Outlet } from "@solidjs/router";

const FinLayout: Component<{}> = (props) => {

  return (
    <div class="w-screen">
      <Outlet />
    </div>
  );
};

export default FinLayout;
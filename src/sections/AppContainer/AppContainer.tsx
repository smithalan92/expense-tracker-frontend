import { Outlet } from "react-router-dom";

export default function AppContainer() {
  return (
    <div className="App">
      <div>Header</div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

import { useLocation } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./Layouts/defaultLayout";
import RoutesComponent from "./components/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import DropMenu from "./components/dropmenu";

function App() {
  return (
    <>
      {" "}
      {!localStorage.getItem("moreenglishlogin") ? (
        <RoutesComponent />
      ) : (
        <DefaultLayout>
          <RoutesComponent />
          {/* <DropMenu /> */}
        </DefaultLayout>
      )}
    </>
  );
}

export default App;

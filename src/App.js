import { useLocation } from "react-router-dom";
import "./App.css";
import DefaultLayout from "./Layouts/defaultLayout";
import RoutesComponent from "./components/Routes";
import "bootstrap/dist/css/bootstrap.min.css";
import DropMenu from "./components/dropmenu";
import { Toaster } from "react-hot-toast";

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
      <Toaster />
    </>
  );
}

export default App;

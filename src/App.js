import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useDeviceCheck from "./hooks/useDeviceCheck";

function App() {
  const isMobile = useDeviceCheck();
  return (
    <Provider store={store}>
      <div
        className={`${
          isMobile ? "h-[92vh]" : "h-screen sm:h-screen"
        } flex flex-col overflow-y-hidden`}
      >
        <ToastContainer />
        <AppRoutes />
      </div>
    </Provider>
  );
}

export default App;

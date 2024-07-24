import { Provider } from "react-redux";
import "./App.css";
import AppRoutes from "./routes/AppRoutes";
import store from "./redux/store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <Provider store={store}>
      <div className="h-[99vh] sm:h-screen flex flex-col overflow-hidden">
        <ToastContainer />
        <AppRoutes />
      </div>
    </Provider>
  );
}

export default App;

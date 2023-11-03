import "./index.css";

import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import App from "./App.jsx";
import store from "./store/Store.js";


ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
      <ToastContainer position="bottom-left" autoClose={2000} theme="colored" />
    </BrowserRouter>
  </Provider>
);

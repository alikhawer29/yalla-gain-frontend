import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { BrowserRouter } from "react-router-dom";
import ApiConfig from "./Config/ApiConfig";
import { persistor, store } from "./Store/store.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename={process.env.REACT_APP_BASE_NAME}>
        <ApiConfig />{" "}
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

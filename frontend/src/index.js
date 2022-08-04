import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import App from "./App";
import { Provider } from "react-redux";
import store from "./reduxs/store";
import { BrowserRouter } from "react-router-dom";
import { SnackbarProvider } from "notistack";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <Provider store={store}>
        <SnackbarProvider maxSnack={5}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </SnackbarProvider>
    </Provider>
);

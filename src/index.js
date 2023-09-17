import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<RouterProvider router={router}>
		<ConfigProvider locale={viVN}>
			<App />
		</ConfigProvider>
	</RouterProvider>
);

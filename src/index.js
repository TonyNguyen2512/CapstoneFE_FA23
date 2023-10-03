import viVN from "antd/locale/vi_VN";
import ReactDOM from "react-dom/client";
import React from "react";
import { RouterProvider } from "react-router-dom";
import { ConfigProvider } from "antd";
import { router } from "./router";
import "./assets/styles/index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
	<RouterProvider router={router}>
		<ConfigProvider locale={viVN} theme={{
			token: {
				colorPrimary: "#ddb850",
				colorInfo: "#ddb850",
				colorWarning: "#f1ca7f",
				colorError: "#ff7777",
				colorSuccess: "#29cb00",
				colorTextBase: "#333333"
			}
		}}>
			{/* More Wrappers or Providers */}
		</ConfigProvider>
	</RouterProvider>
);

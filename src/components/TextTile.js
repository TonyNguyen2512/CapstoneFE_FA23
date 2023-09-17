import React from "react";
import { Typography } from "antd";

const { Text } = Typography;

export const TextTile = ({
	className,
	label,
	size,
	colon,
	children,
	layout = "vertical" | "horizontal",
}) => {
	return (
		<div
			className={className}
			style={{
				display: "flex",
				flexDirection: layout === "horizontal" ? "row" : "column",
			}}
		>
			<div>
				<Text style={{ fontSize: size }} strong>
					{label}
					{colon && ":"}
				</Text>
			</div>
			<div style={{ fontSize: size }}>{children}</div>
		</div>
	);
};

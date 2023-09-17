import { Check, Close, Pencil } from "@icon-park/react";
import { Button } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { styled } from "styled-components";
import { RawHtml } from "./RawHtml";
import { RichTextEditor } from "./RichTextEditor";

const Container = styled.div`
	transition: ${(props) => (props.showInput ? "0.2s" : "0s")};
	border-radius: 4px;
	padding: ${(props) => (props.showInput ? "0" : "8px 10px")};
	cursor: text;
	display: flex;
	justify-content: space-between;
	align-items: start;
	&:hover {
		background-color: ${(props) => (props.showInput ? "white" : "#ececec")};
	}
`;

export const EditableRichText = ({
	placeholder,
	value,
	onChange,
	editable,
}) => {
	const [internalValue, setInternalValue] = useState("");
	const [showInput, setShowInput] = useState(false);

	const handleCancel = () => {
		setShowInput(false);
	};

	useEffect(() => {
		setInternalValue(value);
	}, [value]);

	return (
		<Container
			showInput={showInput}
			onClick={() => {
				if (!editable) return;

				if (!showInput) {
					setShowInput(true);
				}
			}}
		>
			{showInput ? (
				<div className="w-full mr-2">
					<RichTextEditor
						value={internalValue}
						placeholder={placeholder}
						onChange={(value) => {
							setInternalValue(value);
							onChange && onChange(value);
						}}
						onBlur={(e) => handleCancel()}
						autoFocus
					/>
				</div>
			) : (
				<RawHtml html={internalValue} />
			)}
			{!showInput && editable && <Pencil className="mr-2" />}
		</Container>
	);
};

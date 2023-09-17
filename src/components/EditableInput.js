import { Pencil } from "@icon-park/react";
import { Input } from "antd";
import React, { useEffect, useState } from "react";
import { styled } from "styled-components";

const Container = styled.div`
	transition: ${(props) => (props.showInput ? "0.2s" : "0s")};
	border-radius: 4px;
	cursor: text;
	display: flex;
	justify-content: space-between;
	align-items: center;
	&:hover {
		background-color: ${(props) => (props.showInput ? "white" : "#ececec")};
	}
`;

export const EditableInput = ({
	placeholder,
	value,
	onChange,
	fontSize,
	fontWeight,
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
		<Container showInput={showInput}>
			<Input
				className="w-full mr-2"
				autoFocus
				placeholder={placeholder}
				value={internalValue}
				onChange={(e) => {
					setInternalValue(e.target.value);
					onChange && onChange(e.target.value);
				}}
				bordered={showInput}
				readOnly={!showInput}
				style={{
					fontSize: !showInput ? fontSize : undefined,
					fontWeight: !showInput ? fontWeight : undefined,
				}}
				onClick={editable ? () => setShowInput(true) : undefined}
				onBlur={(e) => handleCancel()}
			/>
			{!showInput && editable && <Pencil className="pr-4" />}
		</Container>
	);
};

import React, { useEffect, useRef, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill/lib";

export const RichTextEditor = ({
	value,
	onChange,
	placeholder,
	height,
	className,
	onBlur,
	autoFocus,
}) => {
	const [text, setText] = useState();
	const ref = useRef();

	useEffect(() => {
		setText(value);
	}, [value]);

	useEffect(() => {
		if (autoFocus) {
			ref.current.focus();
		}
	}, [autoFocus]);

	const handleChange = (value) => {
		setText(value);
		onChange && onChange(value);
	};

	return (
		<div>
			<ReactQuill
				onBlur={onBlur}
				className={className}
				value={text}
				onChange={handleChange}
				modules={RichTextEditor.modules}
				formats={RichTextEditor.formats}
				placeholder={placeholder}
				style={{
					height: height,
				}}
				ref={ref}
			/>
		</div>
	);
};

RichTextEditor.modules = {
	toolbar: [
		[{ header: "1" }, { header: "2" }, { font: [] }],
		[{ list: "ordered" }, { list: "bullet" }],
		["bold", "italic", "underline"],
		[{ color: [] }, { background: [] }],
		["link", "image"],
		["clean"],
	],
};

RichTextEditor.formats = [
	"header",
	"font",
	"list",
	"bullet",
	"bold",
	"italic",
	"underline",
	"color",
	"background",
	"link",
	"image",
];

import { Select } from "antd";
import React, { useEffect, useState } from "react";
import ClassApi from "../../../apis/class";

export const ClassSelect = ({
	value,
	onChange,
	allowClear,
	className,
	disabled,
	onLoaded,
}) => {
	const [classes, setClasses] = useState([]);
	const [loading, setLoading] = useState(false);

	const getClasses = async () => {
		setLoading(true);
		const data = await ClassApi.searchClass();
		setClasses(data);
		setLoading(false);
		onLoaded && onLoaded(data);
	};

	useEffect(() => {
		getClasses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const classOptions = classes.map((e) => {
		return {
			value: e.classId,
			label: e.className,
		};
	});

	return (
		<Select
			className={className}
			showSearch
			value={value}
			options={classOptions}
			placeholder="Chọn lớp học"
			loading={loading}
			onChange={onChange}
			allowClear={allowClear}
			disabled={disabled}
		/>
	);
};

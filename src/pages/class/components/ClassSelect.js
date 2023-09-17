import { Select } from "antd";
import React, { useEffect, useState } from "react";
import CourseApi from "../../../apis/course";

export const CourseSelect = ({ onChange, allowClear, onClear, mode }) => {
	const [courses, setCourses] = useState([]);
	const [loading, setLoading] = useState(false);

	const getCourses = async () => {
		setLoading(true);
		const data = await CourseApi.searchCourses();
		setCourses(data);
		setLoading(false);
	};

	useEffect(() => {
		getCourses();
	}, []);

	const courseOptions = courses.map((e) => {
		return {
			value: e.courseId,
			label: `${e.courseCode} - ${e.courseName}`,
		};
	});

	return (
		<Select
			mode={mode}
			showSearch
			onClear={onClear}
			options={courseOptions}
			placeholder="Chọn môn học"
			loading={loading}
			onChange={onChange}
			allowClear={allowClear}
		/>
	);
};

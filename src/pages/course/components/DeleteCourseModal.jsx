import React, { useState } from "react";
import BaseModal from "../../../components/BaseModal";
import CourseApi from "../../../apis/course";
import { message } from "antd";

export const DeleteCourseModal = ({
	open,
	onCancel,
	course,
	onDeleteSuccess,
}) => {
	const [loading, setLoading] = useState(false);

	const handleDeleteCourse = () => {
		const { courseId } = course;
		setLoading(true);
		CourseApi.deleteCourse(courseId).then((success) => {
			if (success) {
				message.success("Xóa môn học thành công");
				onCancel();
				onDeleteSuccess();
			} else {
				message.error("Xóa môn học thất bại");
				onCancel();
			}
			setLoading(false);
		});
	};

	return (
		<BaseModal
			open={open}
			title="Bạn muốn xóa môn học này?"
			onCancel={onCancel}
			onOk={handleDeleteCourse}
			okType="danger"
			confirmLoading={loading}
		/>
	);
};

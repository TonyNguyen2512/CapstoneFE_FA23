import { Spin, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import CourseApi from "../../../apis/course";
import { ALL_PERMISSIONS } from "../../../constants/app";
import { usePermissions } from "../../../hooks/permission";
import { CourseFormModal } from "../components/CourseFormModal";
import { DeleteCourseModal } from "../components/DeleteCourseModal";
import { CourseList } from "./components/CourseList";

export const CourseListPage = () => {
	const permissions = usePermissions();
	const canView = permissions?.includes(ALL_PERMISSIONS.course.view);

	const [showCreateCourseModal, setShowCreateCourseModal] = useState(false);
	const [courseCreating, setCourseCreating] = useState(false);

	const [showDeleteCourseModal, setShowDeleteCourseModal] = useState(false);
	const [showUpdateCourseModal, setShowUpdateCourseModal] = useState(false);
	const [courseUpdating, setCourseUpdating] = useState(false);

	const [courseLoading, setCourseLoading] = useState(false);
	const [courses, setCourses] = useState([]);

	const deletingCourse = useRef();
	const updatingCourse = useRef();

	useEffect(() => {
		getCourses();
	}, []);

	// Get courses
	const getCourses = async (keyword) => {
		setCourseLoading(true);
		const data = await CourseApi.searchCourses(keyword);
		setCourses(data);
		setCourseLoading(false);
	};
	// End get courses

	// Add course
	const handleShowAddCourseModal = () => {
		setShowCreateCourseModal(true);
	};
	const handleCloseCreateCourseModal = () => {
		setShowCreateCourseModal(false);
		setCourseCreating(false);
	};
	const handleAddCourse = (course) => {
		setCourseCreating(true);
		const { code, name } = course;
		const data = {
			courseCode: code,
			courseName: name,
		};

		CourseApi.createCourse(data).then(({ success, data }) => {
			if (success) {
				message.success(data);
				handleCloseCreateCourseModal();
				getCourses();
			} else {
				message.error(data);
			}
			setCourseCreating(false);
		});
	};
	// End add course

	// Delete course
	const handleShowDeleteCourseModal = (course) => {
		deletingCourse.current = course;
		setShowDeleteCourseModal(true);
	};
	const handleCloseDeleteCourseModal = () => {
		deletingCourse.current = undefined;
		setShowDeleteCourseModal(false);
	};
	const handleDeleteSuccess = () => {
		getCourses();
	};
	// End delete course

	const handleUpdateCourse = (course) => {
		setCourseUpdating(true);
		const { code, name, courseId } = course;
		const data = {
			courseId,
			courseCode: code,
			courseName: name,
		};

		CourseApi.updateCourse(data).then((success) => {
			if (success) {
				message.success("Cập nhật môn học thành công");
				getCourses();
			} else {
				message.error("Cập nhật môn học thất bại");
			}
			setCourseUpdating(false);
			setShowUpdateCourseModal(false);
		});
	};

	return (
		<div>
			{canView && (
				<Spin spinning={courseLoading}>
					<CourseList
						courses={courses}
						onDelete={handleShowDeleteCourseModal}
						onUpdate={(course) => {
							updatingCourse.current = course;
							setShowUpdateCourseModal(true);
						}}
						onAdd={handleShowAddCourseModal}
						onSearch={(value) => getCourses(value)}
					/>
				</Spin>
			)}
			<CourseFormModal
				open={showCreateCourseModal}
				title="Tạo môn học"
				onCancel={handleCloseCreateCourseModal}
				onSubmit={handleAddCourse}
				confirmLoading={courseCreating}
			/>

			<CourseFormModal
				open={showUpdateCourseModal}
				title="Cập nhật môn học"
				onCancel={() => setShowUpdateCourseModal(false)}
				onSubmit={handleUpdateCourse}
				course={updatingCourse.current}
				confirmLoading={courseUpdating}
			/>

			<DeleteCourseModal
				onCancel={handleCloseDeleteCourseModal}
				onDeleteSuccess={handleDeleteSuccess}
				open={showDeleteCourseModal}
				course={deletingCourse.current}
			/>
		</div>
	);
};

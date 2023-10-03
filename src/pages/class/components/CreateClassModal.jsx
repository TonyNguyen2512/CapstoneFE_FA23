import { Form, Input, Select, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import CourseApi from "../../../apis/course";
import BaseModal from "../../../components/BaseModal";
import { UserContext } from "../../../providers/user";
import ClassApi from "../../../apis/class";
import SemesterApi from "../../../apis/semester";
import UserApi from "../../../apis/user";

export const CreateClassModal = ({ open, onCancel, onSuccess }) => {
	const { user } = useContext(UserContext);

	const formRef = useRef();

	const [classCreating, setClassCreating] = useState(false);

	const [courseLoading, setCourseLoading] = useState(false);
	const [semestersLoading, setSemestersLoading] = useState(false);
	const [teacherLoading, setTeacherLoading] = useState(false);
	const [courses, setCourses] = useState([]);
	const [semesters, setSemesters] = useState([]);
	const [teacher, setTeacher] = useState([]);

	const getCourses = async () => {
		setCourseLoading(true);
		const data = await CourseApi.searchCourses();
		setCourses(data);
		setCourseLoading(false);
	};

	const getSemester = async () => {
		setSemestersLoading(true);
		const data = await SemesterApi.getSemesters();
		setSemesters(data);
		setSemestersLoading(false);
	};

	const getTeacher = async () => {
		setTeacherLoading(true);
		const data = await UserApi.getListTeacher();
		setTeacher(data);
		setTeacherLoading(false);
	};

	useEffect(() => {
		getCourses();
		getSemester();
		getTeacher();
		console.log(user);
	}, [user]);

	const courseOptions = courses.map((e) => {
		return {
			value: e.courseId,
			label: `${e.courseCode} - ${e.courseName}`,
		};
	});

	const semestersOptions = semesters.map((e) => {
		return {
			value: e.semesterId,
			label: e.semesterName,
		};
	});

	const teacherOptions = teacher.map((e) => {
		return {
			value: e.userId,
			label: e.fullName,
		};
	});

	const handleCreateClass = async (values) => {
		const { teacher, course, name, enrollCode, semester } = values;

		const data = {
			courseId: course,
			teacherId: teacher,
			className: name,
			enrollCode: enrollCode,
			semesterId: semester,
		};

		setClassCreating(true);
		const success = await ClassApi.createClass(data);
		if (success) {
			message.success("Tạo lớp học thành công");
			onSuccess();
		} else {
			message.error("Tạo lớp học thất bại");
		}
		setClassCreating(false);
		onCancel();
	};

	return (
		<BaseModal
			title="Tạo lớp học"
			open={open}
			onCancel={onCancel}
			confirmLoading={classCreating}
			onOk={() => formRef.current?.submit()}
		>
			<Form ref={formRef} layout="vertical" onFinish={handleCreateClass}>
				<Form.Item
					name="name"
					label="Tên lớp học"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập tên lớp",
						},
					]}
				>
					<Input placeholder="Nhập tên lớp học..." />
				</Form.Item>
				{/* <Form.Item
					name="dates"
					label="Thời gian"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn ngày bắt đầu & kết thúc của lớp học",
						},
					]}
				>
					<RangePicker
						format="DD/MM/YYYY"
						placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
						disabledDate={(date) => date.isBefore(moment().subtract(1, "days"))}
					/>
				</Form.Item> */}
				<Form.Item
					name="teacher"
					label="Giáo viên hướng dẫn"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn giáo viên",
						},
					]}
				>
					<Select
						// showSearch
						options={teacherOptions}
						placeholder="Chọn giáo viên"
						loading={teacherLoading}
					/>
				</Form.Item>
				<Form.Item
					name="course"
					label="Môn học"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn môn học",
						},
					]}
				>
					<Select
						// showSearch
						options={courseOptions}
						placeholder="Chọn môn học"
						loading={courseLoading}
					/>
				</Form.Item>
				<Form.Item
					name="semester"
					label="Học kỳ"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn môn học",
						},
					]}
				>
					<Select
						// showSearch
						options={semestersOptions}
						placeholder="Chọn kỳ học"
						loading={semestersLoading}
					/>
				</Form.Item>
				<Form.Item
					name="enrollCode"
					label="Mã tham gia"
					rules={[
						{
							required: true,
							message: "Vui lòng nhập mã tham gia",
						},
					]}
				>
					<Input.Password placeholder="Nhập mã tham gia..." />
				</Form.Item>
			</Form>
		</BaseModal>
	);
};
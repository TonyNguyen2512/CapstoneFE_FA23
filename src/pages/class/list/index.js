import { Plus } from "@icon-park/react";
import { Button, Col, Input, Row, Select, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import ClassApi from "../../../apis/class";
import { CreateClassModal } from "../components/CreateClassModal";
import { ClassList } from "./components/ClassList";
import { CourseSelect } from "../components/ClassSelect";
import { DeleteClassModal } from "../components/DeleteClassModal";
import { useSearchParams } from "react-router-dom";
import { usePermissions } from "../../../hooks/permission";
import { ALL_PERMISSIONS, roles } from "../../../constants/app";
import { useRole } from "../../../hooks/role";
import { UserContext } from "../../../providers/user";

const ClassListPage = () => {
	const { user } = useContext(UserContext);
	const role = useRole();
	const permissions = usePermissions();
	const canCreate = permissions?.includes(ALL_PERMISSIONS.class.create);
	const canView = permissions?.includes(ALL_PERMISSIONS.class.view);

	const [searchParams, setSearchParams] = useSearchParams();
	const [showDeleteClassModal, setShowDeleteClassModal] = useState(false);
	const [classLoading, setClassLoading] = useState(false);
	const [classes, setClasses] = useState([]);
	const deletingClass = useRef();

	const [showCreateClassModal, setShowCreateClassModal] = useState(false);

	const statusOptions = [
		{
			label: "Đã tham gia",
			value: true,
		},
		{
			label: "Chưa tham gia",
			value: false,
		},
	];

	const handleShowCreateClassModal = () => {
		setShowCreateClassModal(true);
	};
	const handleCloseCreateClassModal = () => {
		setShowCreateClassModal(false);
	};

	// Delete class
	const handleShowDeleteClassModal = (currentClass) => {
		deletingClass.current = currentClass;
		setShowDeleteClassModal(true);
	};
	const handleCloseDeleteClassModal = () => {
		deletingClass.current = undefined;
		setShowDeleteClassModal(false);
	};

	const getClasses = async (keyword, courseId, enrolled) => {
		console.log("get classes: ", enrolled);
		setClassLoading(true);
		var data = await ClassApi.searchClass(
			keyword,
			courseId,
			undefined,
			role === roles.FACTORY ? user?.userId : undefined
		);
		if (enrolled !== undefined) {
			data = data?.filter((e) => e.enrolled === enrolled);
		}
		setClasses(data);
		setClassLoading(false);
	};

	const handleCreateClassSuccess = () => {
		getClasses();
	};

	const handleSearchClass = (keyword) => {
		if (keyword.length > 0) {
			searchParams.set("search", keyword);
		} else {
			searchParams.delete("search");
		}
		setSearchParams(searchParams);
	};

	const handleChangeCourse = (courseId) => {
		if (courseId) {
			searchParams.set("course", courseId);
		} else {
			searchParams.delete("course");
		}
		setSearchParams(searchParams);
	};

	const handleClearCourse = () => {
		searchParams.delete("course");
		setSearchParams(searchParams);
	};

	const handleDeleteSuccess = () => {
		getClasses();
	};

	useEffect(() => {
		const courseId = searchParams.get("course");
		const search = searchParams.get("search");
		const enrolled = searchParams.get("enrolled");
		getClasses(search, courseId, enrolled ? enrolled === "true" : undefined);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [searchParams]);

	return (
		<div>
			<Row justify="space-between" className="mb-4">
				<Col span={22}>
					{canView && (
						<Row align="middle" className="w-full">
							<Input.Search
								className="w-1/3 mr-2"
								placeholder="Tìm lớp học..."
								onSearch={handleSearchClass}
							/>
							<span className="mr-2">Môn học:</span>
							<CourseSelect
								allowClear
								onChange={handleChangeCourse}
								onClear={handleClearCourse}
							/>
							{role === roles.WORKER && (
								<>
									<span className="mr-2 ml-4">Trạng thái:</span>
									<Select
										allowClear
										options={statusOptions}
										placeholder="Chọn trạng thái"
										onChange={(enrolled) => {
											if (enrolled === undefined || enrolled == null) {
												return;
											}
											searchParams.set("enrolled", enrolled);
											setSearchParams(searchParams);
										}}
										onClear={() => {
											searchParams.delete("enrolled");
											setSearchParams(searchParams);
										}}
									/>
								</>
							)}
						</Row>
					)}
				</Col>
				<Col span={2}>
					{canCreate && (
						<Row justify="end">
							<Button
								className="flex-center"
								type="primary"
								icon={<Plus />}
								onClick={handleShowCreateClassModal}
							>
								Thêm lớp học
							</Button>
						</Row>
					)}
				</Col>
			</Row>
			{canView && (
				<Spin spinning={classLoading}>
					<ClassList classes={classes} onDelete={handleShowDeleteClassModal} />
				</Spin>
			)}
			<CreateClassModal
				open={showCreateClassModal}
				onCancel={handleCloseCreateClassModal}
				onSuccess={handleCreateClassSuccess}
			/>
			<DeleteClassModal
				onCancel={handleCloseDeleteClassModal}
				onDeleteSuccess={handleDeleteSuccess}
				open={showDeleteClassModal}
				currentClass={deletingClass.current}
			/>
		</div>
	);
};

export default ClassListPage;

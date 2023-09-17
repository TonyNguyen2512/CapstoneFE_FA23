import { Edit, More, Plus, PreviewOpen } from "@icon-park/react";
import { Button, Dropdown, message } from "antd";
import moment from "moment";
import React, { useRef, useState } from "react";
import SemesterApi from "../../../../apis/semester";
import { BaseTable } from "../../../../components/BaseTable";
import { SemesterFormModal } from "../../components/SemesterFormModal";
import { useNavigate } from "react-router-dom";

export const SemesterList = ({ semesters, loading, onSuccess }) => {
	const [showCreateModal, setShowCreateModal] = useState(false);
	const [showUpdateModal, setShowUpdateModal] = useState(false);

	const [creating, setCreating] = useState(false);
	const [updating, setUpdating] = useState(false);

	const semesterRef = useRef();
	const navigate = useNavigate();

	const columns = [
		{
			title: "Tên học kỳ",
			dataIndex: "semesterName",
			key: "semesterName",
		},
		{
			title: "Ngày bắt đầu",
			dataIndex: "startTime",
			key: "startTime",
			render: (_, { startTime }) => {
				return moment(startTime).format("DD/MM/YYYY");
			},
		},
		{
			title: "Ngày kết thúc",
			dataIndex: "endTime",
			key: "endTime",
			render: (_, { endTime }) => {
				return moment(endTime).format("DD/MM/YYYY");
			},
		},
		{
			title: "Thao tác",
			render: (_, record) => {
				return (
					<Dropdown
						menu={{
							items: [
								{
									label: "Xem chi tiết",
									icon: <PreviewOpen />,
									onClick: () => {
										navigate(record.semesterId);
									},

								},
								{
									label: "Cập nhật",
									icon: <Edit />,
									onClick: () => {
										semesterRef.current = record;
										setShowUpdateModal(true);
									},
								},
							],
						}}
					>
						<Button icon={<More />} className="flex-center" />
					</Dropdown>
				);
			},
		},
	];


	const handleCreateSemester = async (values) => {
		setCreating(true);
		const response = await SemesterApi.createSemester(values);
		if (response.code === 100) {
			message.success("Thêm học kỳ thành công");
			onSuccess && onSuccess();
		} else {
			message.error(response.message);
		}
		setCreating(false);
		setShowCreateModal(false);
	};

	const handleUpdateSemester = async (values) => {
		const semesterId = semesterRef.current?.semesterId;
		if (!semesterId) return;

		setUpdating(true);
		const response = await SemesterApi.updateSemester(semesterId, values);
		if (response.code === 100) {
			message.success("Cập nhật học kỳ thành công");
			onSuccess && onSuccess();
		} else {
			message.error(response.message);
		}
		setUpdating(false);
		setShowUpdateModal(false);
	};

	return (
		<>
			<BaseTable
				pagination={false}
				rowKey={(e) => {
					return e.semesterId;
				}}
				title="Danh sách học kỳ"
				columns={columns}
				dataSource={semesters}
				loading={loading}
				searchOptions={{ visible: false }}
				actions={[
					<Button
						type="primary"
						icon={<Plus />}
						className="flex-center"
						onClick={() => setShowCreateModal(true)}
					>
						Thêm học kỳ
					</Button>,
				]}
			/>
			<SemesterFormModal
				title="Thêm học kỳ"
				open={showCreateModal}
				onCancel={() => setShowCreateModal(false)}
				onSubmit={handleCreateSemester}
				submitting={creating}
			/>
			<SemesterFormModal
				title="Cập nhật học kỳ"
				open={showUpdateModal}
				onCancel={() => {
					semesterRef.current = undefined;
					setShowUpdateModal(false);
				}}
				onSubmit={handleUpdateSemester}
				submitting={updating}
				semester={semesterRef.current}
			/>
		</>
	);
};

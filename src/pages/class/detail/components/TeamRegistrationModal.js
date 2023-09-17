import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { User } from "@icon-park/react";
import { Button, Col, Form, Row, Select, Typography, message } from "antd";
import React, { useContext, useRef, useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import { UserContext } from "../../../../providers/user";

const { Text } = Typography;

export const TeamRegistrationModal = ({
	title,
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	students,
	project,
}) => {
	const STUDENTS_KEY = "listStudent";
	const { user } = useContext(UserContext);

	const [selectedMemberIds, setSelectedMemberIds] = useState([user?.userId]);

	const formRef = useRef();

	const onFinish = async (values) => {
		await onSubmit({ ...values, projectId: project?.id });
	};

	const getStudentOptions = (memberId) => {
		const allOptions = students.map((item) => {
			return {
				value: item.id,
				label: `${item.fullName} (${item.email})`,
			};
		});

		const filteredOptions = allOptions.filter((item) => {
			const { value } = item;
			if (selectedMemberIds.includes(value) && value !== memberId) {
				return false;
			}

			return true;
		});

		return filteredOptions;
	};

	return (
		<BaseModal
			title={title}
			open={open}
			onCancel={onCancel}
			onOk={() => formRef.current.submit()}
			confirmLoading={confirmLoading}
		>
			<Form
				ref={formRef}
				layout="vertical"
				onFinish={onFinish}
				initialValues={{
					listStudent: [user?.userId],
				}}
				onValuesChange={(_, values) => {
					const selectedStudents = values.listStudent.filter((e) => e);
					setSelectedMemberIds(selectedStudents);
				}}
			>
				<div>
					<Text strong style={{ fontSize: 16 }}>
						Dự án mong muốn làm:
					</Text>
				</div>
				<div className="mb-4 mt-2">
					<Text>{project?.projectName}</Text>
				</div>
				<Text strong style={{ fontSize: 16 }}>
					Thành viên nhóm (Tối đa 5)
				</Text>
				<div className="mb-2"></div>
				<Form.List name={STUDENTS_KEY}>
					{(fields, { add, remove }) => (
						<>
							{fields.map((field, index) => {
								const memberId =
									index === 0
										? user?.userId
										: formRef.current?.getFieldValue(STUDENTS_KEY)[index];

								return (
									<Row key={field.key} align="middle" gutter={4}>
										<Col span={22}>
											<Form.Item
												{...field}
												label={
													<div>
														<span>Thành viên {index + 1}</span>
														{index === 0 && (
															<strong className="ml-2">(Nhóm trưởng)</strong>
														)}
													</div>
												}
												key={`member-${index}`}
												rules={[
													{
														required: true,
														message: "Vui lòng chọn thành viên nhóm",
													},
												]}
											>
												<Select
													placeholder="Chọn thành viên"
													options={getStudentOptions(memberId)}
													allowClear
													suffixIcon={<User />}
													disabled={index === 0}
												/>
											</Form.Item>
										</Col>
										<Col>
											{fields.length > 1 && index > 0 && (
												<Button
													className="flex-center mt-1"
													type="text"
													danger
													icon={<MinusCircleOutlined />}
													onClick={() => remove(field.name)}
												/>
											)}
										</Col>
									</Row>
								);
							})}
							{fields.length < 5 && (
								<Form.Item>
									<Button
										type="dashed"
										onClick={() => {
											if (fields.length >= 5) {
												message.error("Đã vượt quá số lượng thành viên");
												return;
											}
											add();
										}}
										block
										icon={<PlusOutlined />}
									>
										Thêm thành viên
									</Button>
								</Form.Item>
							)}
						</>
					)}
				</Form.List>
			</Form>
		</BaseModal>
	);
};

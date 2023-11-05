import { Info } from "@icon-park/react";
import { Row, Col, Form, Input, Select, DatePicker, Button, Tooltip } from "antd";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import BaseModal from "../../../../../components/BaseModal";
import { RichTextEditor } from "../../../../../components/RichTextEditor";
import { mockItems } from "../../../../../__mocks__/jama/items";
import { mockTasks } from "../../../../../__mocks__/jama/tasks";
import { formatDate } from "../../../../../utils";

export const ManagerTaskModal = ({
	open,
	onCancel,
	onSubmit,
	confirmLoading,
	dataSource,
	mode,
}) => {
	const FORMAT_DATE = "DD/MM/YYYY";
	const title = `${mode === "1" ? "Thêm" : "Cập nhật"} công việc`;

	const [itemList, setItemList] = useState([]);
	const [taskList, setTaskList] = useState([]);
	const [taskNameRef, setTaskNameRef] = useState([]);
	const [managerNameRef, setManagerNameRef] = useState([]);
	const [timeStartFormat, setTimeStartFormat] = useState([]);
	const [timeEndFormat, setTimeEndFormat] = useState([]);

	const [initialValues, setInitialValues] = useState();
	const [mgrTaskForm] = Form.useForm();
	const handleValue = (values) => {
		mgrTaskForm.setFieldsValue(values);
	};

	const onFinish = async (values) => {
		const data = {
			id: values.id,
			orderId: values.orderId,
			managerId: values.managerId,
			timeStart: dayjs(values.timeStart),
			timeEnd: dayjs(values.timeEnd)
		}
		await onSubmit(data);
	};

	useEffect(() => {

		const itemData = mockItems;
		setItemList(itemData);

		const taskData = mockTasks;
		setTaskList(taskData);

		handleValue({
			id: dataSource?.id,
			orderId: dataSource?.orderId,
			managerId: dataSource?.managerId,
			timeStart: dataSource?.timeStart && dayjs(dataSource?.timeStart),
			timeEnd: dataSource?.timeEnd && dayjs(dataSource?.timeEnd)
		});

	}, [dataSource]);

	return (
		<BaseModal
			open={open}
			onCancel={() => {
				onCancel();
				mgrTaskForm.resetFields();
			}}
			title={title}
			onOk={() => {
				mgrTaskForm.current?.submit();
			}}
			confirmLoading={confirmLoading}
			width="30%"
			okText="Nhập"
		>
			<Form
				form={mgrTaskForm}
				layout="vertical"
				onFinish={onFinish}
				initialValues={initialValues}
			>
				<Form.Item name="id" hidden>
					<Input />
				</Form.Item>
				<Form.Item
					name="orderId"
					label="Tên đơn hàng"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn đơn hàng",
						},
					]}
				>
					<Select
						placeholder="Tên đơn hàng"
						// options={id}
						onChange={(value) => {
							setTaskNameRef(value);
						}}
					/>
				</Form.Item>
				<Form.Item
					name="managerId"
					label="Tên công việc"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn công việc",
						},
					]}
				>
					<Select
						placeholder="Chọn loại công việc"
						// options={}
						onChange={(value) => {
							setManagerNameRef(value);
						}}
					/>
				</Form.Item>
				<Form.Item
					name="managerName"
					label="Tên quản lý"
					rules={[
						{
							required: true,
							message: "Vui lòng điền tên quản lý",
						},
					]}
				>
					<Input
						showCount
						maxLength={255}
						placeholder="Tên quản lý"
					/>
				</Form.Item>
				<Form.Item
					name="timeStart"
					label="Thời gian bắt đầu"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn thời gian bắt đầu",
						},
					]}
				>
					<DatePicker
						format={FORMAT_DATE}
						placeholder={FORMAT_DATE}
						// onChange={handleChange}
						// disabledDate={disabledDate}
						className="w-full"
					/>
				</Form.Item>
				<Form.Item
					name="timeEnd"
					label="Thời gian kết thúc"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn thời gian kết thúc",
						},
					]}
				>
					<DatePicker
						format={FORMAT_DATE}
						placeholder={FORMAT_DATE}
						// onChange={handleChange}
						// disabledDate={disabledDate}
						className="w-full"
					/>
				</Form.Item>
			</Form>
		</BaseModal>
	);
};

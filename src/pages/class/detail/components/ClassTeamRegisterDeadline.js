import { Button, DatePicker, Form, Row, message } from "antd";
import dayjs from "dayjs";
import React, { useContext, useEffect, useRef } from "react";
import { ClassContext } from "../../../../providers/class";
import ClassApi from "../../../../apis/class";

export const ClassTeamRegisterDeadline = () => {
	const formRef = useRef();

	const { data } = useContext(ClassContext);
	const semesterStartTime = data?.semester?.startTime;
	const semesterEndTime = data?.semester?.endTime;

	const initialDates = () =>
		[
			data?.registerTeamStartDate && dayjs(data?.registerTeamStartDate),
			data?.registerTeamEndDate && dayjs(data?.registerTeamEndDate),
		].filter((e) => e);

	const onSubmit = async (values) => {
		const dates = values.dates;
		const startTime = dates?.[0];
		const endTime = dates?.[1];

		const request = {
			classId: data?.classId,
			startTime,
			endTime,
		};
		const success = await ClassApi.updateTeamRegisterDeadline(request);
		if (success) {
			message.success("Đã cập nhật thời hạn đăng ký nhóm");
		}
	};

	useEffect(() => {
		formRef.current?.setFieldValue("dates", initialDates());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Form ref={formRef} onFinish={onSubmit}>
			<Row>
				<Form.Item
					name="dates"
					label="Đăng ký nhóm"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn thời hạn đăng ký nhóm",
						},
					]}
				>
					<DatePicker.RangePicker
						format="DD/MM/YYYY"
						placeholder={["Bắt đầu", "Kết thúc"]}
						disabledDate={(date) => {
							return (
								date.isBefore(semesterStartTime) ||
								date.isAfter(semesterEndTime)
							);
						}}
					/>
				</Form.Item>
				<Button htmlType="submit" type="primary" className="ml-2">
					Cập nhật
				</Button>
			</Row>
		</Form>
	);
};

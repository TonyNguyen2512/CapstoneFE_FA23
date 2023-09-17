import { Button, DatePicker, Form, Row, message } from "antd";
import React, { useContext, useEffect, useRef } from "react";
import ClassApi from "../../../../apis/class";
import { ClassContext } from "../../../../providers/class";
import dayjs from "dayjs";

export const ClassTeamReportDeadline = () => {
	const formRef = useRef();

	const { data } = useContext(ClassContext);
	const semesterStartTime = data?.semester?.startTime;
	const semesterEndTime = data?.semester?.endTime;

	const initialDates = () =>
		[
			data?.reportStartDate && dayjs(data?.reportStartDate),
			data?.reportEndDate && dayjs(data?.reportEndDate),
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
		const success = await ClassApi.updateTeamReportDeadline(request);
		if (success) {
			message.success("Đã cập nhật thời hạn báo cáo nhóm");
		}
	};

	useEffect(() => {
		formRef.current?.setFieldValue("dates", initialDates());
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data]);

	return (
		<Form
			ref={formRef}
			onFinish={onSubmit}
			initialValues={{
				dates: initialDates,
			}}
		>
			<Row>
				<Form.Item
					name="dates"
					label="Báo cáo nhóm"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn thời hạn báo cáo",
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

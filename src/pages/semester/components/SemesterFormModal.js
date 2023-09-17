import { Info } from "@icon-park/react";
import {
	Button,
	DatePicker,
	Form,
	Row,
	Select,
	Tooltip,
	Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import {
	SemesterTypeOptions,
	SemesterTypeRanges,
} from "../../../constants/app";
import dayjs from "dayjs";

const { Text } = Typography;

export const SemesterFormModal = ({
	title,
	open,
	onCancel,
	onSubmit,
	submitting,
	semester,
}) => {
	const formRef = useRef();

	const [startDate, setStartDate] = useState();
	const [endDate, setEndDate] = useState();
	const [semesterType, setSemesterType] = useState("Spring");

	const getSemesterName = () => {
		if (!startDate || !endDate || !semesterType) {
			return "-";
		}

		var year;
		const y1 = startDate?.year();
		const y2 = endDate?.year();
		if (y1 === y2) {
			year = y1;
		} else {
			year = `${y1}_${y2}`;
		}

		return `${semesterType}${year}_${startDate.date()}${startDate.format(
			"MM"
		)}_${endDate.date()}${endDate.format("MM")}`;
	};

	const handleChange = (values) => {
		setStartDate(values?.[0]);
		setEndDate(values?.[1]);
	};

	const onFinish = (values) => {
		const semesterName = getSemesterName();
		const dates = values.dates;
		const startTime = dates[0];
		const endTime = dates[1];

		const data = {
			semesterName,
			startTime,
			endTime,
		};
		onSubmit?.(data);
	};

	const disabledDate = (current) => {
		const isBeforeNow = current.isBefore(moment().subtract(1, "days"));

		const ranges = SemesterTypeRanges[semesterType];
		const startMonth = ranges?.startMonth;
		const startDay = ranges?.startDay;
		const endMonth = ranges?.endMonth;
		const endDay = ranges?.endDay;

		const currentMonth = current.month();
		const currentDay = current.date();

		const notInSemesterTypeRange =
			(currentMonth === startMonth && currentDay < startDay) ||
			(currentMonth === endMonth && currentDay > endDay) ||
			currentMonth < startMonth ||
			currentMonth > endMonth;

		return notInSemesterTypeRange || isBeforeNow;
	};

	useEffect(() => {
		if (semester !== undefined) {
			// Extract semester type from name
			// Ex: name: Spring2023_xxx => "Spring"
			const pattern = /^[a-zA-Z]+/;
			const semesterName = semester?.semesterName;
			const match = semesterName?.match(pattern);
			const type = match ? match[0] : "";
			setSemesterType(type);
			setStartDate(dayjs(semester?.startTime));
			setEndDate(dayjs(semester?.endTime));
		} else {
			setSemesterType("Spring");
		}
	}, [semester]);

	const handleCancel = () => {
		setSemesterType("Spring");
		setStartDate(undefined);
		setEndDate(undefined);
		onCancel();
	};

	return (
		<BaseModal
			title={title}
			open={open}
			onCancel={handleCancel}
			onOk={() => formRef.current?.submit()}
			confirmLoading={submitting}
		>
			<Form
				ref={formRef}
				onFinish={onFinish}
				layout="vertical"
				initialValues={{
					dates:
						semester !== undefined
							? [dayjs(semester?.startTime), dayjs(semester?.endTime)]
							: undefined,
				}}
			>
				<Form.Item
					name="semeterName"
					label={
						<Row align="middle">
							<Text style={{ margin: 0, padding: 0 }}>Tên học kỳ</Text>
							<Tooltip title="Tên học kỳ theo định dạng [Loại]_[Năm học]_[Ngày bắt đầu]_[Ngày kết thúc]">
								<Button icon={<Info />} type="link" style={{ padding: 0 }} />
							</Tooltip>
						</Row>
					}
				>
					<Text strong>{getSemesterName()}</Text>
				</Form.Item>
				<Form.Item
					label={
						<div>
							Loại học kỳ
							<Tooltip title="Loại học kỳ sẽ qui định thời gian được phép tạo học kỳ">
								<Button icon={<Info />} type="link" style={{ padding: 0 }} />
							</Tooltip>
						</div>
					}
					rules={[
						{
							required: true,
							message: "Vui lòng chọn loại học kỳ",
						},
					]}
				>
					<Select
						placeholder="Chọn loại học kỳ"
						options={SemesterTypeOptions}
						onChange={(value) => {
							setSemesterType(value);
						}}
						value={semesterType}
					/>
				</Form.Item>
				<Form.Item
					name="dates"
					label="Thời gian"
					rules={[
						{
							required: true,
							message: "Vui lòng chọn ngày bắt đầu & kết thúc",
						},
					]}
				>
					<DatePicker.RangePicker
						value={[startDate, endDate]}
						format="DD/MM/YYYY"
						placeholder={["Ngày bắt đầu", "Ngày kết thúc"]}
						onChange={handleChange}
						disabledDate={disabledDate}
						className="w-full"
					/>
				</Form.Item>
			</Form>
		</BaseModal>
	);
};

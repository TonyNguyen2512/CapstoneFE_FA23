import { Card, Descriptions } from "antd";
import React, { useContext } from "react";
import { ClassContext } from "../../../../providers/class";
import { formatDate } from "../../../../utils";

export const ClassBasicInfo = () => {
	// const role = useRole();
	const { data } = useContext(ClassContext);
	const semester = data?.semester;

	const items1 = [
		{
			key: "CLASS_NAME",
			label: "Tên lớp",
			children: <strong>{data?.className?.toUpperCase()}</strong>,
		},
		{
			key: "COURSE",
			label: "Môn học",
			children: (
				<strong>
					{`${data?.courseCode ?? ""} - ${data?.courseName ?? ""}`}
				</strong>
			),
		},
		{
			key: "FACTORY",
			label: "Giáo viên",
			children: data?.teacherName ?? "(Chưa có giáo viên)",
		},
	];

	const items2 = [
		{
			key: "SEMESTER",
			label: "Học kỳ",
			children: `${semester?.name}`,
		},
		{
			key: "START_DATE",
			label: "Ngày bắt đầu",
			children: formatDate(semester?.startTime, "DD/MM/yyyy"),
		},
		{
			key: "END_DATE",
			label: "Ngày kết thúc",
			children: formatDate(semester?.endTime, "DD/MM/yyyy"),
		},
	];

	return (
		<Card className="mt-3 mb-4" title="Thông tin cơ bản">
			<Descriptions layout="vertical" items={items1} />
			<Descriptions layout="vertical" items={items2} />
		</Card>
	);
};

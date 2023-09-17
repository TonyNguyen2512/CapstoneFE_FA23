import React, { useContext } from "react";
import { ClassContext } from "../../../../providers/class";
import { ClassDetailArea } from "../../components/ClassDetailArea";
import { StudentList } from "./StudentList";

export const ClassStudentList = () => {
	const { data } = useContext(ClassContext);

	return (
		<ClassDetailArea
			title={`Danh sách sinh viên (${data?.students?.length ?? 0})`}
			defaultOpen
		>
			<StudentList students={data?.students} />
		</ClassDetailArea>
	);
};

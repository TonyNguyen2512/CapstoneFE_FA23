import React, { useContext, useEffect, useState } from "react";
import SemesterApi from "../../../apis/semester";
import { SemesterList } from "./components/SemesterList";
import { SemesterTypeContext } from "../../../providers/semesterType";

const SemesterListPage = () => {
	const data = useContext(SemesterTypeContext);

	const [semesters, setSemesters] = useState([]);
	const [loading, setLoading] = useState(false);

	const getSemesters = async () => {
		setLoading(true);
		const data = await SemesterApi.getSemesters();
		setSemesters(data);
		setLoading(false);
	};

	useEffect(() => {
		getSemesters();
	}, [data]);

	return (
		<SemesterList
			loading={loading}
			semesters={semesters}
			onSuccess={() => getSemesters()}
		/>
	);
};

export default SemesterListPage;

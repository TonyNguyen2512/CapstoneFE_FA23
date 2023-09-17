import {
	DegreeHat,
	User,
	Dashboard,
	Classroom,
	Analysis,
	Hourglass,
	EveryUser,
} from "@icon-park/react";
import { Menu, Typography } from "antd";
import Sider from "antd/es/layout/Sider";
import { Header } from "antd/es/layout/layout";
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import { usePermissions } from "../../hooks/permission";
import { ALL_PERMISSIONS } from "../../constants/app";
import config from "../../constants/config";

const { Title } = Typography;

export const AppSider = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const permissions = usePermissions();

	const canViewAccount = permissions?.includes(ALL_PERMISSIONS.account.sider);
	const canViewCourse = permissions?.includes(ALL_PERMISSIONS.course.sider);
	const canViewClass = permissions?.includes(ALL_PERMISSIONS.class.sider);
	const canViewTeam = permissions?.includes(ALL_PERMISSIONS.team.sider);
	const canViewReport = permissions?.includes(ALL_PERMISSIONS.report.sider);
	const canViewSemester = permissions?.includes(ALL_PERMISSIONS.semester.sider);

	const itemKeys = {
		ACCOUNT: "MANAGE_ACCOUNT",
		COURSE: "MANAGE_COURSE",
		TEAM: "MANAGE_TEAM",
		CLASS: "MANAGE_CLASS",
		REPORT: "MANAGE_REPORT",
		SEMESTER: "MANAGE_SEMESTER",
	};
	const iconSize = 20;
	const items = [
		canViewAccount && {
			key: itemKeys.ACCOUNT,
			icon: <User size={iconSize} />,
			label: <Link to={routes.dashboard.accounts}>Tài khoản</Link>,
		},
		canViewCourse && {
			key: itemKeys.COURSE,
			icon: <DegreeHat size={iconSize} />,
			label: <Link to={routes.dashboard.courses}>Môn học</Link>,
		},
		canViewSemester && {
			key: itemKeys.SEMESTER,
			icon: <Hourglass size={iconSize} />,
			label: <Link to={routes.dashboard.semester}>Học kỳ</Link>,
		},
		canViewClass && {
			key: itemKeys.CLASS,
			icon: <Classroom size={iconSize} />,
			label: <Link to={routes.dashboard.classes}>Lớp học</Link>,
		},
		canViewTeam && {
			key: itemKeys.TEAM,
			icon: <EveryUser size={iconSize} />,
			label: <Link to={routes.dashboard.teams}>Nhóm của tôi</Link>,
		},
		canViewReport && {
			key: itemKeys.REPORT,
			icon: <Analysis size={iconSize} />,
			label: <Link to={routes.dashboard.report}>Báo cáo nhóm</Link>,
		},
	];

	const getSelectedKey = () => {
		const paths = location.pathname.split("/").filter((e) => e);
		const dashboard = routes.dashboard.root.slice(1);
		if (paths[0] !== dashboard) {
			return undefined;
		}

		switch (paths[1]) {
			case routes.dashboard.accounts:
				return itemKeys.ACCOUNT;
			case routes.dashboard.courses:
				return itemKeys.COURSE;
			case routes.dashboard.projects:
				return itemKeys.PROJECT;
			case routes.dashboard.classes:
				return itemKeys.CLASS;
			case routes.dashboard.teamRequest:
				return itemKeys.TEAM_REQUEST;
			case routes.dashboard.report:
				return itemKeys.REPORT;
			case routes.dashboard.semester:
				return itemKeys.SEMESTER;
			case routes.dashboard.teams:
				return itemKeys.TEAM;
			default:
		}

		return undefined;
	};

	return (
		<Sider
			width={config.SIDER_WIDTH}
			theme="light"
			className="pb-4"
			style={{
				overflow: "auto",
				height: "100vh",
				position: "fixed",
				left: 0,
				top: 0,
				bottom: 0,
				borderRight: '1px solid #eee'
			}}
		>
			<Header className="flex-center bg-white">
				<Link to={routes.dashboard.root} style={{ textDecoration: "none" }}>
					<Title
						level={4}
						style={{ color: "#666", marginTop: '0.5rem' }}
						onClick={() => navigate(routes.dashboard.root)}
					>
						JAMA Decor
					</Title>
					{/* <Dashboard size={"40"} style={{ color: "#333", fontSize: 50 }} /> */}
				</Link>
			</Header>
			<Menu
				theme="light"
				mode="inline"
				style={{ border: "none" }}
				defaultSelectedKeys={[itemKeys.ACCOUNT]}
				items={items}
				selectedKeys={[getSelectedKey()]}
			/>
		</Sider>
	);
};

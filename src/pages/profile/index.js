import { Form, Input, Typography } from "antd";
import React, { useContext } from "react";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { useRole } from "../../hooks/role";
import { roles } from "../../constants/app";

const { Title } = Typography;

const ProfilePage = () => {
	const { user } = useContext(UserContext);
	const role = useRole();

	return (
		<div>
			<Title level={3}>Hồ sơ của bạn</Title>
			<Form
				layout="vertical"
				className="w-1/2"
				initialValues={{
					email: user?.email,
					fullName: user?.fullName,
					role: getRoleName(user?.role),
					mssv: user?.mssv,
				}}
			>
				{role === roles.WORKER && (
					<Form.Item name="mssv" label="Mã số sinh viên">
						<Input placeholder="MSSV..." disabled readOnly />
					</Form.Item>
				)}
				<Form.Item name="fullName" label="Họ tên">
					<Input placeholder="Họ và tên của bạn..." disabled readOnly />
				</Form.Item>
				<Form.Item name="email" label="Email">
					<Input placeholder="Email..." disabled readOnly />
				</Form.Item>
				<Form.Item name="role" label="Vai trò">
					<Input placeholder="Role..." disabled readOnly />
				</Form.Item>
			</Form>
		</div>
	);
};

export default ProfilePage;

import {
	Button,
	Card,
	Form,
	Input,
	Row,
	Select,
	Typography,
	message,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import routes from "../../constants/routes";
import AuthApi from "../../apis/auth";
import { getRoleName } from "../../utils";
import RoleApi from "../../apis/role";
import { roles } from "../../constants/app";

const { Text, Title } = Typography;

const Container = styled.div`
	position: fixed;
	width: 100%;
	height: 100vh;
	background-image: linear-gradient(to bottom right, #08203e, #557c93);
`;

const FormWrapper = styled.div`
	width: 40%;
	max-height: 1000px;

	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	overflow-y: scroll;
	&::-webkit-scrollbar {
		width: 0;
		display: none;
	}
	-ms-overflow-style: none;
	scrollbar-width: none;
`;

export const RegisterAccountPage = () => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState(false);
	const [allRoles, setAllRoles] = useState([]);

	const formRef = useRef();

	const handleNavigateLoginPage = () => {
		navigate(routes.login);
	};

	const handleRegister = async (values) => {
		const { email, fullName, password, roleId } = values;
		try {
			setLoading(true);
			await AuthApi.register(email, fullName, password, roleId);
			message.success(`Đăng ký thành công!`);
			navigate(routes.login);
		} catch (error) {
			console.log(error);
			const msg = error.response.data;
			message.error(msg);
		}

		setLoading(false);
	};

	const getAllRoles = async () => {
		const data = await RoleApi.getAllRoles();
		const filteredData = data.filter((e) => e.name !== roles.ADMIN);
		if (filteredData) {
			formRef.current.setFieldValue("roleId", filteredData[0].id);
		}
		setAllRoles(filteredData);
	};

	const roleOptions = allRoles?.map((e) => {
		return {
			value: e.id,
			label: getRoleName(e.name),
		};
	});

	useEffect(() => {
		getAllRoles();
	}, []);

	return (
		<Container>
			<FormWrapper>
				<Card bordered={false}>
					<Title level={2} className="text-center">
						Tạo tài khoản
					</Title>
					<Form ref={formRef} layout="vertical" onFinish={handleRegister}>
						<Form.Item
							name="email"
							label="Email"
							rules={[
								{
									required: "email",
									message: "Vui lòng nhập địa chỉ email",
								},
								{ type: "email", message: "Vui lòng nhập đúng email" },
							]}
							hasFeedback
						>
							<Input placeholder="Email của bạn..." size="large" />
						</Form.Item>

						<Form.Item
							name="fullName"
							label="Họ tên"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập họ và tên",
								},
							]}
							hasFeedback
						>
							<Input placeholder="Tên của bạn là gì?" size="large" />
						</Form.Item>

						<Form.Item
							name="password"
							label="Mật khẩu"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập mật khẩu",
								},
							]}
							hasFeedback
						>
							<Input.Password placeholder="Mật khẩu..." size="large" />
						</Form.Item>
						<Form.Item
							name="confirmPassword"
							label="Xác nhận mật khẩu"
							rules={[
								{
									required: true,
									message: "Vui lòng nhập lại mật khẩu",
								},
								({ getFieldValue }) => ({
									validator(rule, value) {
										if (!value || getFieldValue("password") === value) {
											return Promise.resolve();
										}
										return Promise.reject(
											"Mật khẩu xác thực phải giống với mật khẩu!"
										);
									},
								}),
							]}
							hasFeedback
						>
							<Input.Password placeholder="Xác nhận mật khẩu..." size="large" />
						</Form.Item>
						<Form.Item
							name="roleId"
							label="Bạn là:"
							rules={[
								{
									required: true,
									message: "Vui lòng chọn vai trò",
								},
							]}
						>
							<Select options={roleOptions} />
						</Form.Item>

						<Button
							className="w-full mb-2"
							type="primary"
							size="large"
							htmlType="submit"
							loading={loading}
						>
							Đăng ký
						</Button>

						<Row justify="end">
							<Row align="middle">
								<Text className="mr-1">Đã có tài khoản?</Text>
								<Button
									className="p-0 font-bold"
									type="link"
									onClick={handleNavigateLoginPage}
								>
									Đăng nhập ngay
								</Button>
							</Row>
						</Row>
					</Form>
				</Card>
			</FormWrapper>
		</Container>
	);
};

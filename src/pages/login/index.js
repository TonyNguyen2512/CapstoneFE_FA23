import { Button, Card, Form, Input, Row, Typography, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import AuthApi from "../../apis/auth";
import routes from "../../constants/routes";

const { Text, Title } = Typography;

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100vh;
  // background-image: linear-gradient(to bottom right, #08203e, #557c93);
  background-color: #eee;
`;

const LoginFormWrapper = styled.div`
  width: clamp(20rem, min(30%, 30vw), 36rem);
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export const LoginPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNavigateRegisterPage = () => {
    navigate(routes.register);
  };

  const handleLogin = async (email, password) => {
    setLoading(true);
    const success = await AuthApi.login(email, password);
    setLoading(false);
    if (success) {
      message.success(`Đăng nhập thành công!`);
      navigate(routes.dashboard.root);
    } else {
      message.error("Sai tài khoản hoặc mật khẩu. Vui lòng nhập lại.");
    }
  };

  return (
    <Container>
      <Title
        level={1}
        className="text-center"
        style={{
          marginTop: 50,
          color: "#333",
          letterSpacing: 2.5,
        }}
      >
        JAMA Decor
      </Title>
      <LoginFormWrapper>
        <Card bordered={true}>
          <Title level={2} className="text-center text-[#333]">
            Đăng nhập
          </Title>
          <Form
            layout="vertical"
            onFinish={async (values) => {
              console.log("data: ", values);
              const { email, password } = values;
              await handleLogin(email, password);
            }}
          >
            <Form.Item
              name="email"
              label="Email"
              labelAlign="right"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ email",
                },
              ]}
            >
              <Input placeholder="Email của bạn..." size="large" />
            </Form.Item>

            <Form.Item
              className="mb-2"
              name="password"
              label="Mật khẩu"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập mật khẩu",
                },
              ]}
            >
              <Input.Password placeholder="Mật khẩu..." size="large" />
            </Form.Item>
            <Row justify="end" className="mb-2">
              <Button type="link">Quên mật khẩu?</Button>
            </Row>
            <Button
              className="w-full mb-2"
              type="primary"
              size="large"
              htmlType="submit"
              loading={loading}
            >
              Đăng nhập
            </Button>
            <Row justify="end">
              <Row align="middle">
                <Text className="mr-1">Chưa có tài khoản?</Text>
                <Button
                  className="p-0 font-bold"
                  type="link"
                  onClick={handleNavigateRegisterPage}
                >
                  Đăng ký ngay
                </Button>
              </Row>
            </Row>
          </Form>
        </Card>
      </LoginFormWrapper>
    </Container>
  );
};

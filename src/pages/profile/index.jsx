import { Avatar, Col, Form, Input, Row, Space, Typography } from "antd";
import React, { useContext } from "react";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { Container } from "react-bootstrap";
import { UserOutlined } from "@ant-design/icons";

const { Title } = Typography;

const ProfilePage = () => {
  const { user } = useContext(UserContext);

  return (
    <Container className="w-full ">
      <Title level={3} className="text-center">
        Hồ sơ người dùng
      </Title>
      <Row gutter={12} className="mt-10">
        <Col span={8} className="w-full flex flex-col justify-start items-center gap-2">
          <Avatar size={128}>
            <UserOutlined className="text-5xl relative bottom-[-0.5rem]" />
          </Avatar>
          {/* <span className="cursor-pointer select-none hover:text-gray-600">Thay đổi</span> */}
        </Col>
        <Col span={16} className="w-full ">
          <Space direction="vertical" className="w-[80%] flex content-center">
            <Form
              layout="horizontal"
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 16 }}
              initialValues={user}
            >
              <Form.Item name="id" label="ID" hidden>
                <Input disabled readOnly />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Email..." value={user?.email} readOnly />
              </Form.Item>
              {/* <Form.Item name="password" label="Mật khẩu">
                <Input.Password placeholder="Mật khẩu..." value={user?.password} />
              </Form.Item> */}
              <Form.Item name="fullName" label="Họ và tên">
                <Input placeholder="Họ và tên..." defaultValue={user?.fullName} />
              </Form.Item>
              <Form.Item name="dob" label="Sinh nhật">
                <Input placeholder="Sinh nhật..." defaultValue={user?.dob} />
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Địa chỉ..." defaultValue={user?.address} />
              </Form.Item>
              <Form.Item name="role" label="Vai trò">
                <Input
                  placeholder="Vai trò..."
                  defaultValue={getRoleName(user?.role)}
                  disabled
                  readOnly
                />
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

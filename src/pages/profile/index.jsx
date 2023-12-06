import { Avatar, Col, DatePicker, Form, Input, Row, Space, Typography } from "antd";
import React, { useContext } from "react";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { Container } from "react-bootstrap";
import { UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title } = Typography;

const ProfilePage = () => {
  const { user } = useContext(UserContext);
  console.log(user);

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
              initialValues={{ ...user, dob: user.dob ? dayjs(user.dob) : null }}
            >
              <Form.Item name="id" label="ID" hidden>
                <Input disabled readOnly />
              </Form.Item>
              <Form.Item name="userName" label="Số điện thoại">
                <Input placeholder="Số điện thoại..." readOnly />
              </Form.Item>
              <Form.Item name="email" label="Email">
                <Input placeholder="Email..." readOnly />
              </Form.Item>
              {/* <Form.Item name="password" label="Mật khẩu">
                <Input.Password placeholder="Mật khẩu..." value={user?.password} />
              </Form.Item> */}
              <Form.Item name="fullName" label="Họ và tên">
                <Input placeholder="Họ và tên..." readOnly />
              </Form.Item>
              <Form.Item name="dob" label="Sinh nhật">
                {user?.dob && (
                  <DatePicker
                    className="w-full"
                    placeholder="Chọn ngày sinh..."
                    format="DD/MM/YYYY"
                    showTime={false}
                  />
                )}
              </Form.Item>
              <Form.Item name="address" label="Địa chỉ">
                <Input placeholder="Địa chỉ..." readOnly />
              </Form.Item>
              <Form.Item name="roleId" label="Vai trò">
                <b>{getRoleName(user.role?.name)}</b>
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
    </Container>
  );
};

export default ProfilePage;

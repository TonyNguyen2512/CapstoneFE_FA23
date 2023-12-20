import {
  Avatar,
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Progress,
  Row,
  Select,
  Space,
  Spin,
  Typography,
  Upload,
  message,
} from "antd";
import React, { useContext, useRef, useState } from "react";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { Container } from "react-bootstrap";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { genderLabels } from "../../constants/enum";
import UserApi from "../../apis/user";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { profileUserRef } from "../../middleware/firebase";
import { Edit } from "@icon-park/react";
import { ChangePasswordModal } from "./components/ChangePasswordModal";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();
  const typeMessage = "Cập nhật thông tin";
  const { user, setUser } = useContext(UserContext);

  const formRef = useRef(user);
  const [progress, setProgress] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [changePasswordModal, setChangePasswordModal] = useState(false);
  const [profileImage, setProfileImage] = useState(user?.image ?? "");

  const handleUploadImage = (event) => {
    setLoading(true);
    const file = event.file;
    const fileName = event.file?.name;
    const uploadTask = uploadBytesResumable(ref(profileUserRef, fileName), file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // update progress
        setProgress(percent);
      },
      (err) => {
        console.log(err);
        setLoading(false);
      },
      () => {
        setProgress(-1);
        // download url
        getDownloadURL(uploadTask.snapshot.ref).then((url) => {
          formRef.current.setFieldValue("image", url);
          setProfileImage(url);
        });
      }
    );
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    const response = await UserApi.updateUserInfo({ ...values, image: profileImage });
    if (response.id) {
      message.success(`${typeMessage} thành công`);
      setUser({
        ...user,
        fullName: response.fullName,
        address: response.address,
        image: response.image,
        dob: response.dob,
      });
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
  };

  return (
    <Spin spinning={loading}>
      <Container className="w-full ">
        <Title level={3} className="text-center">
          Hồ sơ người dùng
        </Title>

        <Form
          ref={formRef}
          layout="horizontal"
          labelCol={{ span: 6 }}
          wrapperCol={{ span: 16 }}
          initialValues={{
            ...user,
            dob: user?.dob ? dayjs(user.dob) : null,
            genderLabel: genderLabels[user?.gender],
          }}
          onFinish={handleSubmit}
        >
          <Row gutter={12} className="mt-10">
            <Col span={8} className="w-full flex flex-col justify-start items-center gap-2">
              {/* <Avatar size={128}>
                <UserOutlined className="text-5xl relative bottom-[-0.5rem]" />
              </Avatar> */}
              <div style={{ borderRadius: "50%", border: "2px #eee solid", overflow: "hidden" }}>
                <Image src={profileImage} height={128} width={128} />
              </div>
              {progress > 0 && <Progress percent={progress} />}
              <Form.Item name="image" label="">
                <Upload
                  showUploadList={false}
                  beforeUpload={() => false}
                  accept=".jpg,.jepg,.png,.svg,.bmp"
                  onChange={handleUploadImage}
                  maxCount={1}
                >
                  <Button icon={<UploadOutlined />}>Tải ảnh lên</Button>
                </Upload>
              </Form.Item>
            </Col>
            <Col span={16} className="w-full ">
              <Space direction="vertical" className="w-[80%] flex content-center">
                <Form.Item name="userName" label="Số điện thoại">
                  {user?.userName}
                </Form.Item>
                <Form.Item name="email" label="Email">
                  {user?.email}
                </Form.Item>
                {/* <Form.Item name="password" label="Mật khẩu">
                  <Space gutter={12}>
                    <Input.Password value={user?.password} placeholder="Mật khẩu..." disabled />
                    <Edit size={24} />
                  </Space>
                </Form.Item> */}
                <Form.Item name="fullName" label="Họ và tên">
                  <Input placeholder="Họ và tên..." />
                </Form.Item>
                <Form.Item name="address" label="Địa chỉ">
                  <Input placeholder="Địa chỉ..." />
                </Form.Item>
                <Form.Item name="dob" label="Sinh nhật">
                  {user?.dob && (
                    <DatePicker
                      className="w-full"
                      format="DD/MM/YYYY"
                      showTime={false}
                      allowClear={false}
                    />
                  )}
                </Form.Item>
                <Form.Item name="gender" label="Giới tính">
                  <Select
                    value={user?.gender}
                    placeholder="Giới tính..."
                    options={genderLabels.map((e, i) => {
                      return {
                        label: e,
                        value: i,
                      };
                    })}
                  />
                </Form.Item>
                <Form.Item name="roleId" label="Vai trò">
                  <b>{getRoleName(user?.role?.name)}</b>
                </Form.Item>

                <Space style={{ float: "right", marginRight: "3em" }}>
                  <Button onClick={() => setChangePasswordModal(true)}>Đổi mật khẩu</Button>
                  <Button onClick={() => formRef.current?.submit()} icon={null}>
                    Cập nhật
                  </Button>
                </Space>

                <Form.Item name="id" label="ID" hidden>
                  <Input disabled readOnly />
                </Form.Item>
                <Form.Item name="group" label="Nhóm" hidden>
                  <Input disabled readOnly />
                </Form.Item>
                <Form.Item name="groupId" label="Nhóm" hidden>
                  <Input disabled readOnly />
                </Form.Item>
                <Form.Item name="role" label="Vai trò" hidden>
                  <Input disabled />
                </Form.Item>
              </Space>
            </Col>
          </Row>
        </Form>
        <ChangePasswordModal
          userId={user?.id}
          open={changePasswordModal}
          onCancel={() => {
            setChangePasswordModal(false);
          }}
          onSuccess={() => {
            alert("Bạn phải đăng nhập lại để hoàn thành cập nhật thông tin!");
            navigate("/login");
          }}
        />
      </Container>
    </Spin>
  );
};

export default ProfilePage;

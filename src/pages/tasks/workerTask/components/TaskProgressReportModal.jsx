import React, { useContext, useRef } from "react";
import { Card, Col, DatePicker, Form, Input, InputNumber, Select, Typography } from "antd";
import BaseModal from "../../../../components/BaseModal";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import { taskProgressReportsRef } from "../../../../middleware/firebase";
import { UploadFile } from "../../../../components/UploadFile";

const { Text } = Typography;

export const TaskProgressReportModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  title,
}) => {
  const formProgressRef = useRef();
  const { info } = useContext(TaskContext);

  const onFinish = async (values) => {
    const resource = formProgressRef.current?.getFieldValue('resource');
    values.resource = [resource];
    await onSubmit({ ...values });
  }

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={title}
      confirmLoading={confirmLoading}
      onOk={() => formProgressRef.current?.submit()}
    >
      <Form
        ref={formProgressRef}
        initialValues={{
          leaderTaskId: info?.leaderId,
          itemFailed: 0,
          resource: "",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Col span={24}>
          <Card
            bodyStyle={{
              padding: 0,
              paddingLeft: 8,
              paddingTop: 12,
              paddingRight: 8,
              paddingBottom: 16,
            }}
          >
            <Form.Item name="leaderTaskId" hidden>
              <Input />
            </Form.Item>
            <Form.Item
              name="title"
              label={<Text strong>Tên báo cáo</Text>}
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập tên báo cáo",
                },
              ]}
            >
              <Input
                showCount
                maxLength={255}
                placeholder="Tên báo cáo"
              />
            </Form.Item>
            <Form.Item
              label={<Text strong>Mô tả báo cáo</Text>}
              name="content"
              rules={[
                {
                  required: true,
                  message: "Vui lòng thêm mô tả báo cáo",
                },
              ]}
            >
              <RichTextEditor
                placeholder="Mô tả báo cáo..."
              />
            </Form.Item>
            <Form.Item
              label={<Text strong>Số lượng sản phẩm thất bại</Text>}
              name="itemFailed"
            >
              <InputNumber
											min={0}
											placeholder="Thêm số lượng"
										/>
            </Form.Item>
            <UploadFile
              formRef={formProgressRef}
              imageRef={taskProgressReportsRef}
              itemName="resource"
              // onChange={handleChangeUploadImage}
              fileAccept=".jpg,.jepg,.png,.svg,.bmp"
              // errorMessage={resourceErrorMsg}
            />
          </Card>
        </Col>
      </Form>
    </BaseModal>
  );
};

import React, { useContext, useRef } from "react";
import { DatePicker, Form, Input, Select, Typography } from "antd";
import BaseModal from "../../../../components/BaseModal";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../../components/RichTextEditor";

const { Text } = Typography;

export const TaskAcceptanceModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  title,
}) => {
  const formAcceptanceRef = useRef();
  const { info } = useContext(TaskContext);

  const onFinish = async (values) => {
    const datas = {
      leaderId: values.leaderId,
      orderId: values.orderId,
      description: values.description,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
    }
    await onSubmit({ ...datas });
  }

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={title}
      confirmLoading={confirmLoading}
      onOk={() => formAcceptanceRef.current?.submit()}
    >
      <Form
        ref={formAcceptanceRef}
        initialValues={{
          leaderId: info?.leaderId,
          orderId: info?.orderId,
          startTime: info?.startTime,
          endTime: info?.endTime,
          description: "",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item name="leaderId" hidden>
          <Input />
        </Form.Item>
        <Form.Item name="orderId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="dates"
          label={<Text strong>Thời hạn công việc</Text>}
					rules={[
						{
							required: true,
							message: "Vui lòng chọn ngày bắt đầu & kết thúc",
						},
					]}
        >
          <DatePicker.RangePicker
            showNow
            showTime
            placeholder={["Bắt đầu", "Kết thúc"]}
            className="w-full"
            format="HH:mm DD/MM/YYYY"
            rang
            disabledDate={(date) => {
              return (
                date.isBefore(info.startTime, "day")
              );
            }}
          />
        </Form.Item>
        <Form.Item
          name="description"
          label={<Text strong>Mô tả báo cáo</Text>}
					rules={[
						{
							required: true,
							message: "Vui lòng thêm mô tả báo cáo",
						},
					]}
        >
          <RichTextEditor
            // onChange={(value) => (descRef.current = value)}
            placeholder="Nhập mô tả báo cáo..."
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

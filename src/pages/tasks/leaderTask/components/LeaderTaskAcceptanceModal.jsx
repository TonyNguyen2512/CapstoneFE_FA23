import React, { useContext, useEffect, useRef, useState } from "react";
import { DatePicker, Form, Input, Select, Typography } from "antd";
import BaseModal from "../../../../components/BaseModal";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import UserApi from "../../../../apis/user";

const { Text } = Typography;

export const LeaderTaskAcceptanceModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  title,
}) => {
  const formAcceptanceRef = useRef();
  const { info } = useContext(TaskContext);
	const [leadersData, setLeadersData] = useState([]);

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

	const initLeaderInfo = async () => {
		UserApi.getByLeaderRole().then((resp) => {
			setLeadersData(resp?.data);
		});
	}

	useEffect(() => {
		const initialData = () => {
			initLeaderInfo();
		}
		initialData();
	}, []);

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
          orderDetailId: info?.id,
          startTime: info?.startTime,
          endTime: info?.endTime,
          description: "",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item name="orderDetailId" hidden>
          <Input />
        </Form.Item>
        <Form.Item
          name="leaderId"
          label={<Text strong>Tổ trưởng</Text>}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn Tổ trưởng",
            },
          ]}
        >
          <Select
            className="w-full"
            placeholder="Chọn Tổ trưởng"
            options={leadersData?.map((e) => {
              return {
                label: e.fullName,
                value: e.id,
              };
            })}
          />
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

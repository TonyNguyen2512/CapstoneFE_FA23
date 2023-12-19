import React, { useContext, useEffect, useRef, useState } from "react";
import { Card, DatePicker, Form, Input, Select, Typography } from "antd";
import BaseModal from "../../../../components/BaseModal";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import UserApi from "../../../../apis/user";
import { disabledDateTime } from "../../../../utils";
import dayjs from "dayjs";

const { Text } = Typography;

export const LeaderTaskAcceptanceModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  title,
  leadersData,
}) => {
  const formAcceptanceRef = useRef();
  const { info } = useContext(TaskContext);

  console.log("info acceptance", info)

  const onFinish = async (values) => {
    const datas = {
      leaderId: values.leaderId,
      itemId: values?.itemId,
      orderId: values.orderId,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values.description,
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
          itemId: info?.itemId,
          description: "",
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        <Card
          bodyStyle={{
            padding: 0,
            paddingLeft: 8,
            paddingTop: 12,
            paddingRight: 8,
            paddingBottom: 16,
          }}
        >
          <Form.Item name="orderId" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="itemId" hidden>
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
              showSearch
              filterOption={(input, option) => (option?.label ?? '').includes(input)}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
              }
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
              showTime={{
                hideDisabledOptions: true,
              }}
              placeholder={["Bắt đầu", "Kết thúc"]}
              className="w-full"
              format="HH:mm DD/MM/YYYY"
              rang
              disabledDate={(date) => {
                return (
                  date.isBefore(dayjs(), "day")
                );
              }}
              disabledTime={disabledDateTime}
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
        </Card>
      </Form>
    </BaseModal>
  );
};

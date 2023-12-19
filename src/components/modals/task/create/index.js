import { Col, DatePicker, Form, Input, InputNumber, Row, Select, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { ETaskStatus } from "../../../../constants/enum";
import { UserContext } from "../../../../providers/user";
import BaseModal from "../../../BaseModal";
import { RichTextEditor } from "../../../RichTextEditor";
import locale from "antd/es/date-picker/locale/vi_VN";
import { WTaskStatusOptions } from "../../../../constants/app";
import { TaskContext } from "../../../../providers/task";
import GroupApi from "../../../../apis/group";
import { disabledDateTime } from "../../../../utils";
import dayjs from "dayjs";

export const TaskCreateModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  team,
}) => {
  const { user } = useContext(UserContext);
  const { info } = useContext(TaskContext);

  const formRef = useRef();
  const descRef = useRef();

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title="Thêm công việc"
      onOk={() => formRef.current.submit()}
      confirmLoading={confirmLoading}
      width="50%"
    >
      <Form
        ref={formRef}
        layout="vertical"
        onFinish={async (values) => {
          const dates = values.dates;
          const startTime = dates?.[0];
          const endTime = dates?.[1];
          await onSubmit({
            ...values,
            taskDescription: descRef.current,
            startTime: new Date(startTime),
            endTime: new Date(endTime),
          });
        }}
        initialValues={{
          taskName: "",
          status: ETaskStatus.New,
          dates: [dayjs(), dayjs()],
          assignees: [],
          priority: "",
        }}
      >
        <Form.Item
          name="taskName"
          label="Tên công việc"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên công việc",
            },
          ]}
        >
          <Input showCount maxLength={255} placeholder="Nhập tên công việc..." />
        </Form.Item>
        <Form.Item label="Mô tả công việc">
          <RichTextEditor
            onChange={(value) => (descRef.current = value)}
            placeholder="Nhập mô tả công việc..."
          />
        </Form.Item>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="dates"
              label="Thời hạn công việc"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời hạn công việc",
                },
              ]}
            >
              <DatePicker.RangePicker
                className="w-full"
                placeholder={["Bắt đầu", "Kết thúc"]}
                format="HH:mm DD/MM/YYYY"
                showTime={{
                  hideDisabledOptions: true,
                }}
                locale={locale}
                disabledDate={(date) => {
                  return date.isBefore(info.startTime, "day");
                }}
                disabledTime={disabledDateTime}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập trạng thái",
                },
              ]} >
              <Select
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={WTaskStatusOptions} 
                placeholder="Chọn trạng thái" />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="assignees"
              label="Thành viên được phân công"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn ít nhất 1 thành viên để phân công",
                },
              ]}
            >
              <Select
                showSearch
                filterOption={(input, option) => (option?.label ?? '').includes(input)}
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
                }
                options={team?.map((e) => {
                  const isLeader = user?.id === e.id;
                  return {
                    label: `${e.fullName}${isLeader ? " (Tổ trưởng)" : ""}`,
                    value: e.id,
                  };
                })}
                mode="multiple"
                placeholder="Chọn thành viên"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="priority"
              label="Độ ưu tiên"
              rules={[
                {
                  required: true,
                  message: "Vui lòng thêm độ ưu tiên",
                },
              ]}
            >
              <InputNumber
                min={0}
                max={10}
                placeholder="Độ ưu tiên"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </BaseModal >
  );
};
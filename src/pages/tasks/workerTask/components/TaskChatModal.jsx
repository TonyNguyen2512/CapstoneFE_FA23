import React, { useContext, useRef } from "react";
import { Form, Input, Typography } from "antd";
import BaseModal from "../../../../components/BaseModal";
import { TaskContext } from "../../../../providers/task";
import { RichTextEditor } from "../../../../components/RichTextEditor";

const { Text } = Typography;

export const TaskChatModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  title,
  dataSource,
}) => {
  const formChatRef = useRef();

  const { members } = dataSource || [];

  console.log("members", members)

  const onFinish = async (values) => {
    const datas = {
    }
    await onSubmit({ ...datas });
  }

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={title}
      confirmLoading={confirmLoading}
      onOk={() => formChatRef.current?.submit()}
    >
      <Form
        ref={formChatRef}
        initialValues={{
          members: members || []
        }}
        onFinish={onFinish}
        layout="vertical"
      >
        {
          members?.map((mem) => (
            <Form.Item
            key={mem.memberId}
            label={<Text strong>Mô tả</Text>}
          >
            <Input value={mem.memberId}></Input>
            <Input value={mem.memberFullName}></Input>
          </Form.Item>
          ))
        }
        
      </Form>
    </BaseModal>
  );
};

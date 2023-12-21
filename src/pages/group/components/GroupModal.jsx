import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, message } from "antd";
import BaseModal from "../../../components/BaseModal";
import { LeaderSelect } from "./LeaderSelect";
import { useSearchParams } from "react-router-dom";
import GroupApi from "../../../apis/group";

export const GroupModal = ({ data, open, onCancel, onSuccess }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";

  const formRef = useRef();
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async (values) => {
    setLoading(true);
    const success = isCreate
      ? await GroupApi.createGroup(values)
      : await GroupApi.updateGroup(values);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    onCancel();
  };

  const handleChangeLeader = (id) => {
    setSearchParams({
      leaderId: id,
    });
  };

  const onLeadersLoaded = (data) => {
    if (data && data.length > 0) {
      searchParams.set("group", data[0].id);
      setSearchParams(searchParams);
    }
  };

  useEffect(() => {
    console.log(isCreate, data);
  }, []);

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} tổ`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{
          id: data?.id,
          name: data?.name,
          leaderId: data?.leaderName,
          isDeleted: data?.isDeleted,
        }}
        onFinish={handleUpdateRole}
      >
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên nhóm"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên nhóm",
            },
          ]}
        >
          <Input showCount maxLength={255} placeholder="Tên nhóm..." />
        </Form.Item>
        <Form.Item
          name="leaderId"
          label="Tổ trưởng"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn tổ trưởng",
            },
          ]}
        >
          <LeaderSelect
            value={searchParams.get("group")}
            onChange={handleChangeLeader}
            onLoaded={onLeadersLoaded}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

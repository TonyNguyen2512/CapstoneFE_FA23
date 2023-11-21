import React, { useRef, useState } from "react";
import BaseModal from "../../../components/BaseModal";
import { Form, Input, Select, message } from "antd";
import ItemCategoryApi from "../../../apis/item-category";

export const ProcedureModal = ({ data, options, open, onCancel, onSuccess }) => {
  const isCreate = !data;
  const typeMessage = isCreate ? "Thêm" : "Cập nhật";
  const formRef = useRef();

  const [listStep, setListStep] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (value) => {
    console.log(`selected ${value}`);
    setListStep(
      value?.map((e, i) => {
        return {
          stepId: e,
          priority: i,
        };
      })
    );
  };

  const handleUpdate = async (values) => {
    setLoading(true);
    values = { ...values, listStep };
    const success = isCreate
      ? await ItemCategoryApi.createItem(values)
      : await ItemCategoryApi.updateItem(values);
    if (success) {
      message.success(`${typeMessage} thành công`);
      onSuccess();
    } else {
      message.error(`${typeMessage} thất bại`);
    }
    setLoading(false);
    onCancel();
  };

  return (
    <BaseModal
      open={open}
      onCancel={onCancel}
      title={`${typeMessage} thủ tục`}
      confirmLoading={loading}
      onOk={() => formRef.current?.submit()}
    >
      <Form layout="vertical" ref={formRef} initialValues={{ ...data }} onFinish={handleUpdate}>
        {!isCreate && (
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>
        )}
        <Form.Item
          name="name"
          label="Tên thủ tục"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên thủ tục",
            },
          ]}
        >
          <Input placeholder="Nhập tên thủ tục..." />
        </Form.Item>
        <Form.Item
          name="listStep"
          label="Tên thủ tục"
          rules={[
            {
              required: true,
              message: "Vui lòng nhập tên thủ tục",
            },
          ]}
        >
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder="select one country"
            defaultValue={data?.listStep}
            onChange={handleChange}
            optionLabelProp="label"
            options={options}
            // optionRender={({option}) => (
            //   <Space>
            //     <span role="img" aria-label={option.name}>
            //       {option.emoji}
            //     </span>
            //     {option.desc}
            //   </Space>
            // )}
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

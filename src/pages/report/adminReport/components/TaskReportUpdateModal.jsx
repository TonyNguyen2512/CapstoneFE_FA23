import React, { useEffect, useRef, useState } from "react";
import { Form, Input, Select, Spin, message } from "antd";
import TextArea from "antd/lib/input/TextArea";
import OrderReportApi from "../../../../apis/order-report";
import { EReport, ReportMap, TaskReportMap, WReport, orderReportMap } from "../../../../constants/enum";
import BaseModal from "../../../../components/BaseModal";
import { imagesReportRef } from "../../../../middleware/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import ReportApi from "../../../../apis/task-report";

const TaskReportUpdateModal = ({ data, idOrderReport, open, onCancel, getReports }) => {
  const formRef = useRef();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [report, setReport] = useState();
  const [reportImage, setReportImage] = useState(data?.image ?? "");

  useEffect(() => {
    if (open) {
      getOrderReportDetailById(idOrderReport);
    } else {
      setLoading(false);
      setReport();
    }
  }, [open]);

  const getOrderReportDetailById = async (id) => {
    setLoading(true);
    const data = await ReportApi.getById(id);
    setReport(data);
    formRef.current.setFieldsValue(data);
    setLoading(false);
  };

  const handleSubmit = async (values) => {
    console.log("Values:", values.status );
    setLoading(true);
    const res = await ReportApi.updateStatusReport(idOrderReport, values.status);
    if (res) {
      message.success("Cập nhật báo cáo thành công");
      onCancel();
    } else {
      message.error("Cập nhật báo cáo thất bại");
    }
    console.log("Res: ", res)
    getReports();
    setLoading(false);
  };

  return (
    <BaseModal
      open={open}
      width={"50%"}
      onCancel={onCancel}
      confirmLoading={loading}
      title="Đánh giá trạng thái báo cáo"
      onOk={() => formRef.current?.submit()}
    >
      <Form
        ref={formRef}
        layout="vertical"
        initialValues={{ ...(report || {}) }}
        onFinish={handleSubmit}
      >
        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn trạng thái",
            },
          ]}
        >
          <Select
            options={Object.keys(TaskReportMap).map((x) => {
                return {
                  value: x - 0,
                  label: TaskReportMap[x].label,
                };
              })}
            placeholder="Trạng thái..."
          />
        </Form.Item>
      </Form>
    </BaseModal>
  );
};

export default TaskReportUpdateModal;

import { Row, Col, Form, Input, Typography, Card, Select } from "antd";
import { useContext, useRef, useState } from "react";
import { RichTextEditor } from "../../../../components/RichTextEditor";
import BaseModal from "../../../../components/BaseModal";
import {
  EReport,
  ReportMap,
  WReport,
  modalModes,
  orderReportMap,
} from "../../../../constants/enum";
import { TaskContext } from "../../../../providers/task";
import { leaderTaskOrderReportsRef, taskOrderReportsRef } from "../../../../middleware/firebase";
import { UploadFile } from "../../../../components/UploadFile";
import { OrderReportStatusOptions } from "../../../../constants/app";

const { Text } = Typography;

export const LeaderTaskOrderReportModal = ({
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  mode,
  title,
}) => {
  // const { user } = useContext(UserContext);
  const { info } = useContext(TaskContext);

  // const [resourceImage, setResourceImage] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [resourceErrorMsg, setResourceErrorMsg] = useState("");

  const leadOrderReportFormRef = useRef();

  const onFinish = async (values) => {
    const resource = leadOrderReportFormRef.current?.getFieldValue("resource");
    if (handleValidateUpload()) {
      setResourceErrorMsg("");
      values.resource = [resource];
      await onSubmit({ ...values });
    }
  };

  const handleChangeUploadImage = (info) => {
    // setFileList(newFileList);
    // console.log('handleChange', info);
    // if (info.file.status === 'uploading') {
    // 	console.log('setting loading to true');
    // 	// this.setState({ loading: true });
    // 	setLoading(true);
    // 	// return;
    // }
    // if (info.file.status === 'done') {
    // 	console.log('setting loading to false');
    // 	setLoading(false);
    // }
    setResourceErrorMsg("");
  };

  const handleValidateUpload = () => {
    // if (!leadReportFormRef.current?.getFieldValue('resource')) {
    // 	setResourceErrorMsg("Vui lòng thêm ảnh báo cáo");
    // 	return false;
    // } else {
    setResourceErrorMsg("");
    return true;
    // }
  };

  return (
    <BaseModal
      open={open}
      onCancel={() => {
        setResourceErrorMsg("");
        onCancel();
      }}
      title={title}
      onOk={() => {
        handleValidateUpload();
        leadOrderReportFormRef.current?.submit();
      }}
      confirmLoading={confirmLoading}
      width="40%"
      okText="Lưu"
    >
      <Form
        ref={leadOrderReportFormRef}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          orderId: info?.id,
          resource: "",
        }}
      >
        <Row gutter={16}>
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
              <Form.Item name="orderId" hidden>
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
                <Input showCount maxLength={255} placeholder="Tên báo cáo" />
              </Form.Item>

              <Form.Item
                name="status"
                label={<Text strong>Trạng thái</Text>}
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn trạng thái",
                  },
                ]}
              >
                <Select
                  className="w-full"
                  placeholder="Chọn sản phẩm"
                  options={Object.keys(orderReportMap)
                    ?.filter((x) => x != WReport.NotAchieved)
                    ?.map((x) => {
                      return {
                        value: x - 0,
                        label: ReportMap[x].label,
                      };
                    })}
                />
              </Form.Item>
              <UploadFile
                formRef={leadOrderReportFormRef}
                imageRef={taskOrderReportsRef}
                itemName="resource"
                onChange={handleChangeUploadImage}
                fileAccept=".jpg,.jepg,.png,.svg,.bmp"
                errorMessage={resourceErrorMsg}
              />
              <Form.Item
                label={<Text strong>Mô tả báo cáo</Text>}
                name="content"
              >
                <RichTextEditor placeholder="Mô tả báo cáo..." />
              </Form.Item>
            </Card>
          </Col>
        </Row>
      </Form>
    </BaseModal>
  );
};

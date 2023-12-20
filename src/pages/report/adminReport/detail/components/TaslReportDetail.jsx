import React from "react";
import { Card, Col, Image, Row, Space } from "antd";
import { ErrorImage, ReportMap, orderReportMap } from "../../../../../constants/enum";
import { formatDate } from "../../../../../utils";

const TaskReportDetail = ({ data }) => {
  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={12}>
                Tên báo cáo: <strong>{data?.title}</strong>
              </Col>
              <Col className="gutter-row" span={12}>
                Tên đơn hàng: <strong>{data?.order.name}</strong>
              </Col>
              <Col className="gutter-row" span={12}>
                Tên người báo cáo: <strong>{data?.reporter.fullName}</strong>
              </Col>

              <Col className="gutter-row" span={12}>
                Ngày tạo báo cáo: <strong>{formatDate(data?.createdDate, "DD/MM/YYYY")}</strong>
              </Col>
              <Col className="gutter-row" span={12}>
                Tên khách hàng: <strong>{data?.order.customerName}</strong>
              </Col>

              <Col className="gutter-row" span={12}>
                <span>
                  Trạng thái:{" "}
                  <strong className={orderReportMap[data?.status]?.color}>
                    {orderReportMap[data?.status]?.label}
                  </strong>
                </span>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="flex-col" style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Nội dung:</strong>
              </Col>
              <Col span={24}>
                <span>{data?.content}</span>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col span={24}>
          <Card className="flex-col" style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <strong>Tệp đính kèm:</strong>
              </Col>
              <Col span={24}>
                <Row gutter={[16, 16]}>
                  {data?.resource?.map((x) => (
                    <Col span={3}>
                      <Image src={x} fallback={ErrorImage} width="100%" />
                    </Col>
                  ))}
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

export default TaskReportDetail;

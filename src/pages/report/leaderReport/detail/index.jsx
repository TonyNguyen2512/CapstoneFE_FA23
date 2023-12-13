import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import OrderReportApi from "../../../../apis/order-report";
import Typography from "antd/lib/typography";
import { Button, Space, Spin } from "antd";
import { Bill, Edit } from "@icon-park/react";
import routes from "../../../../constants/routes";
import LeaderReportDetail from "./components/LeaderReportDetail";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
const { Title } = Typography;

const LeaderReportDetailPage = () => {
  const urlParam = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlParam?.id) {
      getOrderReportDetailById(urlParam?.id);
    }
  }, [urlParam?.id]);

  const getOrderReportDetailById = async (id) => {
    setLoading(true);
    const data = await OrderReportApi.getOrderReportById(id);
    setReport(data);
    setLoading(false);
  };

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.orderReports}`)}
    >
      <Spin spinning={loading}>
        <Space align="start" className="mt-3">
          <Title level={4}>Chi tiết báo cáo</Title>
        </Space>
        <LeaderReportDetail data={report} />
      </Spin>
    </BasePageContent>
  );
};
export default LeaderReportDetailPage;

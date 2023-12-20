import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import Typography from "antd/lib/typography";
import { Button, Space, Spin } from "antd";
import routes from "../../../../constants/routes";
import LeaderReportDetail from "./components/LeaderReportDetail";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import ReportApi from "../../../../apis/task-report";
const { Title } = Typography;

const LeaderReportDetailPage = () => {
  const urlParam = useParams();
  const navigate = useNavigate();

  const [supplies, setSupplies] = useState([]);
  const [report, setReport] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlParam?.id) {
      getOrderReportDetailById(urlParam?.id);
    }
  }, [urlParam?.id]);

  const getOrderReportDetailById = async (id) => {
    setLoading(true);
    const data = await ReportApi.getById(id);
    setSupplies(data.listSupply);
    setReport(data);
    setLoading(false);
  };

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.leaderReports}`)}
    >
      <Spin spinning={loading}>
        <Space align="start" className="mt-3">
          <Title level={4}>Chi tiết báo cáo</Title>
        </Space>
        <LeaderReportDetail data={report}  supplies={supplies} />
      </Spin>
    </BasePageContent>
  );
};
export default LeaderReportDetailPage;

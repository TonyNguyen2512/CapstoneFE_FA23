import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams, Navigate } from "react-router-dom";
import OrderReportApi from "../../../../apis/order-report";
import Typography from "antd/lib/typography";
import { Button, Space, Spin, Table, Tooltip } from "antd";
import { Bill, Edit } from "@icon-park/react";
import routes from "../../../../constants/routes";
import TaskReportDetail from "./components/TaslReportDetail";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import ReportApi from "../../../../apis/task-report";
import { BaseTable } from "../../../../components/BaseTable";
import { Tab } from "react-bootstrap";
import { formatMoney, formatNum } from "../../../../utils";
import { ReportType, ReportTypeMap } from "../../../../constants/enum";
const { Title } = Typography;

const TaskReportDetailPage = () => {
  const urlParam = useParams();
  const navigate = useNavigate();

  const [report, setReport] = useState();
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (urlParam?.id) {
      getOrderReportDetailById(urlParam?.id);
    }
  }, [urlParam?.id]);

  const getOrderReportDetailById = async (id) => {
    setLoading(true);
    const data = await ReportApi.getById(id);
    setReport(data);
    setSupplies(data.listSupply);
    console.log("DATA", data.listSupply);
    setLoading(false);
  };

  

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.taskReports}`)}
    >
      <Spin spinning={loading}>
        <Space align="start" className="mt-3">
          <Title level={4}>Chi tiết báo cáo</Title>
        </Space>
        <TaskReportDetail data={report} supplies={supplies} />
      </Spin>
      
    </BasePageContent>
  );
};
export default TaskReportDetailPage;

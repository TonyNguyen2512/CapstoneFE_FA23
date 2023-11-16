import { Typography, Space } from "antd";
import { Col, Descriptions, Row } from "antd/lib";
import { useNavigate } from "react-router-dom";
import { ProgressIndicator } from "../../../../../components/ProgressIndicator";
import moment, { now } from "moment";

const { Title } = Typography;

const ProcedureStatus = {
  notCompleted: 2,
  completed: 1,
	new: 0,
};

export const WorkerTaskProcedureOverview = ({
  title,
  dataSource
}) => {
  // const isLeader = user?.userId === team?.leader?.id;
  const allTasks = dataSource?.tasks;
  const completedTasks = allTasks?.filter(
    (e) => e.status === ProcedureStatus.completed
  );

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row justify="middle">
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }} ellipsis>
            {title} ({completedTasks?.length ?? 0}/{allTasks?.length ?? 0})
					</Title>
        </Col>
      </Row>
      <ProgressIndicator
        total={allTasks?.length ?? 0}
        completed={completedTasks?.length}
      />
      <Descriptions
        items={[
          {
            label: "Tổng số công việc",
            children: allTasks?.length,
          },
          {
            label: "Công việc đạt",
            children: allTasks?.filter(
              (e) => e.status === ProcedureStatus.completed
            )?.length,
          },
          {
            label: "Công việc không đạt",
            children: allTasks?.filter(
              (e) => e.status === ProcedureStatus.notCompleted
            )?.length,
          },
          {
            label: "Công việc trong tiến độ",
            children: allTasks?.filter(
              (e) => e.status === ProcedureStatus.new
            )?.length,
          },
          {
            label: "Công việc đã quá hạn",
            children: allTasks?.filter((e) =>
              moment(e.timeReport).isBefore(now()) && e.status !== ProcedureStatus.completed
            )?.length,
          },
        ]}
      />
    </Space>
  );
};

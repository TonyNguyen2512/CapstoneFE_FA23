import { Typography, Space } from "antd";
import { Col, Descriptions, Row } from "antd/lib";
import { useNavigate } from "react-router-dom";
import { ProgressIndicator } from "../../../../../components/ProgressIndicator";
import moment, { now } from "moment";
import { TaskStatus } from "../../../../../constants/enum";
import { useContext } from "react";
import { TaskContext } from "../../../../../providers/task";

const { Title } = Typography;

const ProcedureStatus = {
  notCompleted: 2,
  completed: 1,
  new: 0,
};

export const WorkerTaskOverview = ({
  title,
}) => {
  // const isLeader = user?.userId === team?.leader?.id;
  const { tasks } = useContext(TaskContext);
  const allTasks = tasks;
  const completedTasks = allTasks?.filter(
    (e) => e.status === TaskStatus.completed
  );

  const inProgressTasks = allTasks?.filter(
    (e) => moment(now()).isSameOrBefore(e.endTime) && e.status === TaskStatus.inProgress
  )

  const expireTasks = allTasks?.filter(
    (e) => moment(now()).isAfter(e.endTime) && e.status !== TaskStatus.completed
  )

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
            children: completedTasks?.length,
          },
          {
            label: "Công việc không đạt",
            children: allTasks?.filter(
              (e) => e.status === TaskStatus.inProgress
            )?.length,
          },
          {
            label: "Công việc trong tiến độ",
            children: inProgressTasks?.length,
          },
          {
            label: "Công việc đã quá hạn",
            children: expireTasks?.length,
          },
        ]}
      />
    </Space>
  );
};
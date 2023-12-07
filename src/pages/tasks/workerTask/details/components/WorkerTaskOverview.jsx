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
  const { allTasks } = useContext(TaskContext);
  const allWTasks = allTasks;
  const completedTasks = allWTasks?.filter(
    (e) => e.status === TaskStatus.Completed
  );

  const inProgressTasks = allWTasks?.filter(
    (e) => moment(now()).isSameOrBefore(e.endTime) && e.status === TaskStatus.InProgress
  )

  const expireTasks = allWTasks?.filter(
    (e) => moment(now()).isAfter(e.endTime) && e.status !== TaskStatus.Completed
  )

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row justify="middle">
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }} ellipsis>
            {title} ({completedTasks?.length ?? 0}/{allWTasks?.length ?? 0})
          </Title>
        </Col>
      </Row>
      <ProgressIndicator
        total={allWTasks?.length ?? 0}
        completed={completedTasks?.length}
      />
      <Descriptions
        items={[
          {
            label: "Tổng số công việc",
            children: allWTasks?.length,
          },
          {
            label: "Công việc đạt",
            children: completedTasks?.length,
          },
          // {
          //   label: "Công việc không đạt",
          //   children: allWTasks?.filter(
          //     (e) => e.status === TaskStatus.inProgress
          //   )?.length,
          // },
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

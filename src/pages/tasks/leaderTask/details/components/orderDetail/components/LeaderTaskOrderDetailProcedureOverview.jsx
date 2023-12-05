import { Typography, Space } from "antd";
import { Col, Descriptions, Row } from "antd/lib";
import { ProgressIndicator } from "../../../../../../../components/ProgressIndicator";
import moment, { now } from "moment";
import { TaskStatus } from "../../../../../../../constants/enum";
import { useContext } from "react";
import { TaskContext } from "../../../../../../../providers/task";

const { Title } = Typography;

export const LeaderTaskOrderDetailProcedureOverview = ({
  title,
}) => {
  // const isLeader = user?.userId === team?.leader?.id;
  const { allTasks } = useContext(TaskContext);
  console.log("allTasks", allTasks)
  const allETasks = allTasks?.data;

  const completedTasks = allETasks?.filter(
    (e) => e.status === TaskStatus.Completed
  );

  const notAchivedTasks = allETasks?.filter(
    (e) => e.status === TaskStatus.NotAchived
  );

  const newTasks = allETasks?.filter(
    (e) => e.status === TaskStatus.New
  );

  const pendingTasks = allETasks?.filter(
    (e) => e.status === TaskStatus.Pending
  );

  const inprocessTasks = allETasks?.filter(
    (e) => e.status === TaskStatus.InProgress
  );

  const expireTasks = allETasks?.filter((e) =>
    moment(e.timeReport).isBefore(now()) && e.status !== TaskStatus.Completed
  );

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row justify="middle">
        <Col span={12}>
          <Title level={4} style={{ margin: 0 }} ellipsis>
            {title} ({completedTasks?.length ?? 0}/{allETasks?.length ?? 0})
          </Title>
        </Col>
      </Row>
      <ProgressIndicator
        total={allETasks?.length ?? 0}
        completed={completedTasks?.length}
      />
      <Descriptions
        items={[
          {
            label: "Tổng số quy trình",
            children: allETasks?.length,
          },
          {
            label: "Quy trình mới tạo",
            children: newTasks?.length,
          },
          {
            label: "Quy trình đã hoàn thành",
            children: completedTasks?.length,
          },
          {
            label: "Quy trình không hoàn thành",
            children: notAchivedTasks?.length,
          },
          {
            label: "Quy trình đang tiến hành",
            children: inprocessTasks?.length,
          },
          {
            label: "Quy trình đang chờ duyệt hành",
            children: pendingTasks?.length,
          },
          {
            label: "Quy trình đã quá hạn",
            children: expireTasks?.length,
          },
        ]}
      />
    </Space>
  );
};
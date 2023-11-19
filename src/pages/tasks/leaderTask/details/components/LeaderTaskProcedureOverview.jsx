import { Typography, Space } from "antd";
import { Col, Descriptions, Row } from "antd/lib";
import { ProgressIndicator } from "../../../../../components/ProgressIndicator";
import moment, { now } from "moment";
import { eTaskStatus } from "../../../../../constants/enum";

const { Title } = Typography;

export const LeaderTaskProcedureOverview = ({
  title,
  dataSource
}) => {
  // const isLeader = user?.userId === team?.leader?.id;
  const allTasks = dataSource.data;
  const completedTasks = allTasks?.filter(
    (e) => e.status === eTaskStatus.Completed
  );

  const notAchivedTasks = allTasks?.filter(
    (e) => e.status === eTaskStatus.NotAchived
  );

  const newTasks = allTasks?.filter(
    (e) => e.status === eTaskStatus.New
  );

  const pendingTasks = allTasks?.filter(
    (e) => e.status === eTaskStatus.Pending
  );

  const inprocessTasks = allTasks?.filter(
    (e) => e.status === eTaskStatus.Inprocessing
  );

  const expireTasks = allTasks?.filter((e) =>
    moment(e.timeReport).isBefore(now()) && e.status !== eTaskStatus.Completed
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
            label: "Tổng số quy trình",
            children: allTasks?.length,
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

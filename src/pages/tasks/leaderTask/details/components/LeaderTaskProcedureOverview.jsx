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

export const LeaderTaskProcedureOverview = ({
  title,
  dataSource
}) => {
  // const isLeader = user?.userId === team?.leader?.id;
  const allTasks = dataSource;
  const completedTasks = allTasks?.filter(
    (e) => e.status === ProcedureStatus.completed
  );

  const notCompletedTasks = allTasks?.filter(
    (e) => e.status === ProcedureStatus.notCompleted
  );

  const inprocess = allTasks?.filter(
    (e) => e.status !== ProcedureStatus.inprocessing
  );

  const expireDate = allTasks?.filter((e) =>
    moment(e.timeReport).isBefore(now()) && e.status !== ProcedureStatus.completed
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
        notCompleted={notCompletedTasks?.length}
        inprocess={inprocess?.length}
        expireDate={expireDate?.length}
      />
      <Descriptions
        items={[
          {
            label: "Tổng số quy trình",
            children: allTasks?.length,
            labelStyle: {
              color: "black"
            }
          },
          {
            label: "Quy trình đạt",
            children: allTasks?.filter(
              (e) => e.status === ProcedureStatus.completed
            )?.length,
            labelStyle: {
              color: "#29CB00"
            }
          },
          {
            label: "Quy trình không đạt",
            children: notCompletedTasks?.length,
            labelStyle: {
              color: "#FF0000"
            }
          },
          {
            label: "Quy trình đang tiến hành",
            children: inprocess?.length,
            labelStyle: {
              color: "#CB7A00"
            }
          },
          {
            label: "Quy trình đã quá hạn",
            children: expireDate?.length,
            labelStyle: {
              color: "#FF0000"
            }
          },
        ]}
      />
    </Space>
  );
};

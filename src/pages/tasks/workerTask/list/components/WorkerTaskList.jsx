
import { Button, Card, Col, Dropdown, Empty, Input, Row, Space, Spin, Typography } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { message } from "antd/lib";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";
import LeaderTasksApi from "../../../../../apis/leader-task";
import WorkerTaskItem from "./WorkerTaskItem";
import { UserContext } from "../../../../../providers/user";
import routes from "../../../../../constants/routes";

const { Search } = Input;
const { Text } = Typography;

const WorkerTaskList = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [leaderTasksInfo, setLeaderTasksInfo] = useState([]);
  const [searchName, setSearchName] = useState([]);

  const navigate = useNavigate();

  const getData = async (handleLoading, taskName) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve leader task data by id
    // const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByLeaderId(user.id, searchName);
    const dataLeaderTasks = await LeaderTasksApi.getAll();
    if (dataLeaderTasks.code === 0) {
      setLeaderTasksInfo(dataLeaderTasks);

      if (taskName) {
        navigate({
          search: createSearchParams({
            taskName
          }).toString()
        });
      }
    } else {
      message.error(dataLeaderTasks.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(true);
  }, []);

  const onView = (task) => {
    navigate(task?.id);
  }

  const handleSearch = (value) => {
    getData(true, value);
  };

  return (
    <Spin spinning={loading}>
      <Space className="w-full flex justify-between mb-6">
        <Text strong style={{ fontSize: 20, color: "#ddb850" }}>
          {user?.group?.name}
        </Text>
      </Space>
      <Space className="w-full flex justify-between mb-6">
        <Search placeholder="Tìm kiếm công việc..." onSearch={handleSearch} style={{ width: 400 }} value={searchName} onChange={(event) => setSearchName(event.target.value)} />
      </Space>
      <Space className="w-full flex justify-between mb-6">
        <Row gutter={[16, 16]}>
          {leaderTasksInfo?.data?.map((task, index) => (
            <Col className="gutter-row" span={12} key={task.id}>
              <WorkerTaskItem
                task={task}
                index={index}
                onView={onView}
              ></WorkerTaskItem>
            </Col>
          ))}
          <Col className="gutter-row" span={16}>
            {leaderTasksInfo?.data?.length <= 0 && (
              <Empty description={<Text disabled>Chưa có công việc</Text>} />
            )}
          </Col>
        </Row>
      </Space>
    </Spin>
  );
};

export default WorkerTaskList;

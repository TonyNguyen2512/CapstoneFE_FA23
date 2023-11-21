
import { Col, Empty, Input, Row, Space, Spin, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { message } from "antd/lib";
import { useNavigate } from "react-router-dom";
import LeaderTasksApi from "../../../../../apis/leader-task";
import WorkerTaskItem from "./WorkerTaskItem";
import { UserContext } from "../../../../../providers/user";
import { useSearchParams } from 'react-router-dom';

const { Search } = Input;
const { Text } = Typography;

const WorkerTaskList = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [leaderTasksInfo, setLeaderTasksInfo] = useState([]);
  const [searchName, setSearchName] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

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
        setSearchParams({["taskName"]: taskName});
      }
    } else {
      message.error(dataLeaderTasks.message);
    }
    setSearchName(taskName)
    setLoading(false);
  };

  useEffect(() => {
    getData(true, searchParams.get("taskName"));
  }, []);

  const onView = (task) => {
    navigate(task.id, {
      state: {
        taskName: searchName
      }
    }, {replace: true});
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

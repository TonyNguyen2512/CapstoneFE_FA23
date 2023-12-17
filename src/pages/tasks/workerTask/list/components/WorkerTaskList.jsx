
import { Col, Empty, Input, Pagination, Row, Space, Spin, Typography } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { message } from "antd/lib";
import { useNavigate } from "react-router-dom";
import LeaderTasksApi from "../../../../../apis/leader-task";
import WorkerTaskItem from "./WorkerTaskItem";
import { UserContext } from "../../../../../providers/user";
import { useSearchParams } from 'react-router-dom';
import WorkerTasksApi from "../../../../../apis/worker-task";
import { roles } from "../../../../../constants/app";

const { Search } = Input;
const { Text } = Typography;

const WorkerTaskList = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const [leaderTasksInfo, setLeaderTasksInfo] = useState([]);
  const [searchName, setSearchName] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);

  const isWorker = user?.role?.name === roles.WORKER;

  const navigate = useNavigate();

  const getData = async (handleLoading, taskName, current) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve leader task data by id
    let dataLeaderTasks = [];
    if (isWorker) {
      dataLeaderTasks = await WorkerTasksApi.getWorkerTaskByUserId(user.id, searchName, current, 6);
    } else {
      dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByLeaderId(user.id, searchName, current, 6);
    }
    // const dataLeaderTasks = await LeaderTasksApi.getAll();
    if (dataLeaderTasks.code === 0) {
      setLeaderTasksInfo(dataLeaderTasks?.data);
      if (taskName) {
        setSearchParams({ ["taskName"]: taskName });
      }
    } else {
      message.error(dataLeaderTasks.message);
    }
    setSearchName(taskName)
    setLoading(false);
  };

  useEffect(() => {
    getData(true, searchParams.get("taskName"));
  }, [searchParams]);

  const onView = (task) => {
    const leaderTaskId = isWorker ? task?.leaderTaskId : task?.id
    navigate(leaderTaskId, {
      state: {
        taskName: searchName
      }
    }, { replace: true });
  }

  const handleSearch = (value) => {
    setCurrentPage(1);
    getData(true, value, 1);
  };

  const handleOnChange = (current) => {
    setCurrentPage(current);
    getData(true, searchName, current);
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
            {leaderTasksInfo?.total <= 0 && (
              <Empty description={<Text disabled>Chưa có công việc</Text>} />
            )}
          </Col>
        </Row>
      </Space>
      <Space className="w-full flex justify-end md6">
        <Pagination
          current={currentPage}
          defaultCurrent={1}
          total={leaderTasksInfo?.total}
          onChange={handleOnChange}
        />
      </Space>
    </Spin>
  );
};

export default WorkerTaskList;

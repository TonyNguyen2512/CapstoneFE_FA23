import { Space, message, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { createSearchParams, useLocation, useNavigate, useParams } from "react-router-dom";

import { WorkerTaskInfo } from "./components/WorkerTaskInfo";
import { WorkerTaskOverview } from "./components/WorkerTaskOverview";
import { WorkerTaskManagement } from "./components/WorkerTaskManagement";
import LeaderTasksApi from "../../../../apis/leader-task";
import UserApi from "../../../../apis/user";
import WorkerTasksApi from "../../../../apis/worker-task";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { UserContext } from "../../../../providers/user";
import { roles } from "../../../../constants/app";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";


export const WorkerTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const isLeader = user?.role?.name === roles.LEADER;
  const isForman = user?.role?.name === roles.FOREMAN;

  const [loading, setLoading] = useState(false);
  const { leaderTaskId } = useParams();

  const [leaderTaskInfo, setLeaderTaskInfo] = useState([]);
  const [leaderUserInfo, setLeaderUserInfo] = useState([]);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [workderTaskList, setWorkerTaskList] = useState([]);
  const [state, setState] = useState([]);

  const allTasks = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const getData = async (leaderTaskId, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!leaderTaskId) return;

    // retrieve leader task data by id
    const dataLeaderTask = await LeaderTasksApi.getLeaderTaskById(leaderTaskId);
    if (dataLeaderTask.code !== 0) {
      message.error = dataLeaderTask.message;
      return;
    }

    // retrieve order detail by order id
    const dataLeaderUser = await UserApi.getUserById(dataLeaderTask?.data?.leaderId);
    // if (dataLeaderUser.code !== 0) {
    //   message.error = dataLeaderUser.message;
    //   return;
    // }

    // const dataGroupMembers = await GroupApi.getAllUserByGroupId(dataLeaderUser?.groupId);
    const dataGroupMembers = await UserApi.getAll();
    // if (dataGroupMembers.code !== 0) {
    //   message.error = dataGroupMembers.message;
    //   return;
    // }
    setLeaderTaskInfo(dataLeaderTask?.data);
    setLeaderUserInfo(dataLeaderUser);
    setGroupMemberList(dataGroupMembers);

    getWorkerTaskList(leaderTaskId);

    setLoading(false);
  };

  const getWorkerTaskList = async (leaderTaskId, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }

    const dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByLeaderTaskId(leaderTaskId);
    if (dataWorkerTasks.code !== 0) {
      message.error = dataWorkerTasks.message;
      return;
    }

    allTasks.current = dataWorkerTasks?.data;
    setWorkerTaskList(dataWorkerTasks?.data);
    setLoading(false);
  }

  useEffect(() => {
    getData(leaderTaskId, true);
    if (location?.state) {
      setState(location?.state);
    }
  }, [leaderTaskId]);

  const handleSearch = (value) => {
    getData(value);
  };

  const handleBack = () => {
    let path = `${routes.dashboard.root}/${routes.dashboard.workersTasks}`
    if (state?.taskName) {
      path += `?taskName=${state?.taskName}`;
    }
    if (isForman) {
      path = `${routes.dashboard.root}/${routes.dashboard.managersTasks}`
      if (state?.orderId) {
        path += `/${state?.orderId}`;
      }
    }
    console.log("path", path)
    navigate(path, {
      state: state
    }, {replace: true});
  }

  return (
    <BasePageContent onBack={() => handleBack()}>
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            task={workderTaskList}
            onReload={(handleLoading) => {
              getWorkerTaskList(leaderTaskId, handleLoading);
            }}
            onFilterTask={(memberId) => {
              if (memberId) {
                const newTasks = allTasks.current.filter(
                  (e) => e?.members?.find((x) => x.memberId === memberId) !== undefined
                );
                setWorkerTaskList(newTasks);
              } else {
                setWorkerTaskList(allTasks.current);
              }
            }}
          >
            <div className="mt-4">
              <WorkerTaskInfo
                dataLeaderTasks={leaderTaskInfo}
                dataGroupMembers={groupMemberList}
                loading={loading}
              />
            </div>
            {isLeader && (
              <div className="mt-4">
                <WorkerTaskOverview
                  title="Tiến độ công việc"
                  dataSource={workderTaskList}
                />
              </div>
            )}
            <div className="mt-4">
              <WorkerTaskManagement
                dataLeaderTasks={leaderTaskInfo}
                dataWorkerTasks={workderTaskList}
                dataGroupMembers={groupMemberList}
              />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
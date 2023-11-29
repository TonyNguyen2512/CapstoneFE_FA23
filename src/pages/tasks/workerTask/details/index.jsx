import { Space, message, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UNSAFE_DataRouterStateContext, useLocation, useNavigate, useParams } from "react-router-dom";
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
import GroupApi from "../../../../apis/group";
import OrderApi from "../../../../apis/order";
import { eTaskStatus } from "../../../../constants/enum";


export const WorkerTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const isLeader = user?.role?.name === roles.LEADER;
  const isForeman = user?.role?.name === roles.FOREMAN;

  const [loading, setLoading] = useState(false);
  const [acceptance, setAcceptance] = useState(false);
  const { leaderTaskId } = useParams();

  const [leaderTaskInfo, setLeaderTaskInfo] = useState([]);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [workderTaskList, setWorkerTaskList] = useState([]);
  const [state, setState] = useState([]);

  const allTasks = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const handleRetrieveWorkerTaskList = async (leaderTaskId, memberId, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    let dataWorkerTasks = [];
    if (memberId) {
      dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByUserId(memberId, leaderTaskId)
    } else {
      dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByLeaderTaskId(leaderTaskId);
    }
    if (dataWorkerTasks.code !== 0) {
      message.error = dataWorkerTasks.message;
      return;
    }

    allTasks.current = dataWorkerTasks?.data;
    setWorkerTaskList(dataWorkerTasks?.data);
    setLoading(false);
  }

  useEffect(() => {
    const getData = async (leaderTaskId, handleLoading) => {
      if (handleLoading) {
        setLoading(true);
      }

      if (!leaderTaskId) return;

      // retrieve leader task data by id
      const dataLeaderTask = await LeaderTasksApi.getLeaderTaskById(leaderTaskId);
      if (dataLeaderTask.code !== 0) {
        message.error(dataLeaderTask?.message);
        return;
      } else {
        setLeaderTaskInfo(dataLeaderTask?.data);
      }

      let dataLeaderUser = [];
      if (dataLeaderTask?.data?.leaderId) {
        dataLeaderUser = await UserApi.getUserById(dataLeaderTask?.data?.leaderId);
      }

      if (!dataLeaderUser) {
        message.error("Không tìm thấy thông tin quản lý");
      }

      let dataGroupMembers = [];
      if (dataLeaderUser?.groupId) {
        dataGroupMembers = await GroupApi.getAllUserByGroupId(dataLeaderUser?.groupId);
        if (!dataGroupMembers) {
          message.error("Không tìm thấy thông tin các thành viên trong tổ");
        }
      } else {
        message.error("Quản lý không có tổ phụ trách");
      }
      setGroupMemberList(dataGroupMembers?.data);

      handleRetrieveWorkerTaskList(leaderTaskId, null, true);

      setLoading(false);
    }

    getData(leaderTaskId, true);
  }, [leaderTaskId]);

  useEffect(() => {
    if (location?.state) {
      setState(location?.state);
    }
  }, [location]);

  useEffect(() => {
    if (leaderTaskInfo?.status === eTaskStatus.Completed) {
      setAcceptance(true);
    }
  }, [leaderTaskInfo])

  const handleBack = () => {
    if (state?.taskName || state?.orderId) {
      let path = "";
      if (isLeader) {
        path = `${routes.dashboard.root}/${routes.dashboard.workersTasks}`;
        if (state?.taskName) {
          path += `?taskName=${state?.taskName}`;
        }
      }
      if (isForeman) {
        path = `${routes.dashboard.root}/${routes.dashboard.managersTasks}`;
        if (state?.orderId) {
          path += `/${state?.orderId}`;
        }
      }
      navigate(path, {
        state: state
      }, { replace: true });
    } else {
      navigate(-1);
    }
  }

  return (
    <BasePageContent onBack={() => handleBack()}>
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={workderTaskList}
            info={leaderTaskInfo}
            team={groupMemberList}
            acceptance={acceptance}
            onReload={(handleLoading) => {
              handleRetrieveWorkerTaskList(leaderTaskId, null, handleLoading);
            }}
            onFilterTask={(memberId) => {
              handleRetrieveWorkerTaskList(leaderTaskId, memberId, false);
            }}
            onAcceptanceTask={() => {
              setAcceptance(true);
            }}
          >
            <div className="mt-4">
              <WorkerTaskInfo
                loading={loading}
              />
            </div>
            <div className="mt-4">
              <WorkerTaskOverview
                title="Tiến độ công việc"
              />
            </div>
            <div className="mt-4">
              <WorkerTaskManagement />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
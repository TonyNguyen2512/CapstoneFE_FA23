import { Space, message, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { WorkerTaskInfo } from "./components/WorkerTaskInfo";
import { WorkerTaskOverview } from "./components/WorkerTaskOverview";
import { WorkerTaskManagement } from "./components/WorkerTaskManagement";
import LeaderTasksApi from "../../../../apis/leader-task";
import UserApi from "../../../../apis/user";
import WorkerTasksApi from "../../../../apis/worker-task";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { UserContext } from "../../../../providers/user";
import { ALL_PERMISSIONS, roles } from "../../../../constants/app";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import GroupApi from "../../../../apis/group";
import { ETaskStatus } from "../../../../constants/enum";
import { usePermissions } from "../../../../hooks/permission";


export const WorkerTaskDetailsPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.workersTasks.view)
                || permissions?.includes(ALL_PERMISSIONS.leadersTasks.view)
                || permissions?.includes(ALL_PERMISSIONS.orders.view);

  const { user } = useContext(UserContext);
  const isLeader = user?.role?.name === roles.LEADER;
  const isForeman = user?.role?.name === roles.FOREMAN;
  const isAdmin = user?.role?.name === roles.ADMIN;
  const isWorker = user?.role?.name === roles.WORKER;

  const [loading, setLoading] = useState(false);
  const [acceptance, setAcceptance] = useState(false);
  const { leaderTaskId } = useParams();

  const [leaderTaskInfo, setLeaderTaskInfo] = useState([]);
  const [leaderInfo, setLeaderInfo] = useState([]);
  const [groupMemberList, setGroupMemberList] = useState([]);
  const [workderTaskList, setWorkerTaskList] = useState([]);
  const [state, setState] = useState([]);

  const allTasks = useRef();

  const navigate = useNavigate();
  const location = useLocation();

  const handleRetrieveWorkerTaskList = async (handleLoading, leaderTaskId, memberId) => {
    if (handleLoading) {
      setLoading(true);
    }
    let dataWorkerTasks = [];
    if (memberId) {
      dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByLeaderTaskIdAndUserId(memberId, leaderTaskId)
    } else {
      dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByLeaderTaskId(leaderTaskId);
    }
    if (dataWorkerTasks.code !== 0) {
      message.error(dataWorkerTasks.message);
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
      }

      let dataLeaderUser = [];
      if (dataLeaderTask?.data?.leaderId) {
        dataLeaderUser = await UserApi.getUserById(dataLeaderTask?.data?.leaderId);
      }

      if (!dataLeaderUser) {
        message.error("Không tìm thấy thông tin tổ trưởng");
        return;
      }

      let dataGroupMembers = [];
      if (dataLeaderUser?.groupId) {
        dataGroupMembers = await GroupApi.getWorkersByGroupId(dataLeaderUser?.groupId);
        if (!dataGroupMembers) {
          message.error("Không tìm thấy thông tin các thành viên trong tổ");
          return;
        }
      } else {
        message.error("Tổ trưởng chưa có tổ phụ trách");
        return;
      }

      const isGroupMember = dataGroupMembers?.data?.filter((mem) => mem.id === user?.id);
      console.log("isWorker", isWorker)
      if (isWorker && isGroupMember) {
        handleRetrieveWorkerTaskList(true, leaderTaskId, user?.id);
      } else if ((isWorker && !isGroupMember)) {
        message.error("Công việc không thuộc tổ của nhân viên");
        return;
      }

      if (!isWorker) {
        handleRetrieveWorkerTaskList(true, leaderTaskId, null);
      }

      setLeaderTaskInfo(dataLeaderTask?.data);
      setGroupMemberList(dataGroupMembers?.data);
      setLeaderInfo(dataLeaderUser);
      setLoading(false);
    }

    getData(leaderTaskId, true);
  }, [isWorker, leaderTaskId, user]);

  useEffect(() => {
    if (location?.state) {
      setState(location.state);
    }
  }, [location]);

  useEffect(() => {
    if (leaderTaskInfo?.status === ETaskStatus.Completed) {
      setAcceptance(true);
    }
  }, [leaderTaskInfo])

  const handleBack = () => {
    if (state) {
      let path = `${routes.dashboard.root}`;
      if (isLeader || isWorker) {
        path += `/${routes.dashboard.workersTasks}`;
        if (state?.taskName) {
          path += `?taskName=${state?.taskName}`;
        }
      }
      if (isForeman) {
        path += `/${routes.dashboard.managersTasks}`;
        if (state?.orderId) {
          path += `/${state?.orderId}`;

          if (state?.orderDetailId) {
            path += `/${routes.dashboard.taskOrderDetails}/${state?.orderDetailId}`
          }
        }
      }
      if (isAdmin) {
        path += `/${routes.dashboard.orders}`;
        if (state?.orderId) {
          path += `/${state?.orderId}`;

          if (state?.orderDetailId) {
            path += `/${routes.dashboard.taskOrderDetails}/${state?.orderDetailId}`
          }
        }
      }
      navigate(path, {
        state: state
      }, { replace: true });
    } else {
      navigate(-1);
    }
  }

  return canView && (
    <BasePageContent onBack={() => handleBack()}>
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={workderTaskList}
            allTasks={workderTaskList}
            info={leaderTaskInfo}
            team={groupMemberList}
            leader={leaderInfo}
            acceptance={acceptance}
            onReload={(handleLoading) => {
              handleRetrieveWorkerTaskList(handleLoading, leaderTaskId);
            }}
            onFilterTask={(memberId) => {
              handleRetrieveWorkerTaskList(false, leaderTaskId, memberId);
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
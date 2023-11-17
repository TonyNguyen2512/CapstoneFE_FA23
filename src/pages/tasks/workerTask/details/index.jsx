import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Typography, Modal, Row, Space, message } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mockTasks } from "../../../../__mocks__/jama/tasks";
import { mockMaterials } from "../../../../__mocks__/jama/materials";
import { mockWorkerProcedure } from "../../../../__mocks__/jama/procedures";

import { WorkerTaskInfo } from "./components/WorkerTaskInfo";
import { WorkerTaskMaterial } from "./components/WorkerTaskMaterial";
import { WorkerTaskProcedure } from "./components/WorkerTaskProcedure";
import { WorkerTaskProcedureOverview } from "./components/WorkerTaskProcedureOverview";
import { WorkerTaskProcedureManagement } from "./components/WorkerTaskProcedureManagement";
import OrderApi from "../../../../apis/order";
import LeaderTasksApi from "../../../../apis/leader-task";
import GroupApi from "../../../../apis/group";
import UserApi from "../../../../apis/user";
import WorkerTasksApi from "../../../../apis/worker-task";
import routes from "../../../../constants/routes";


export const WorkerTaskDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const { leaderTaskId } = useParams();

  const [leaderTaskInfo, setLeaderTaskInfo] = useState([]);
  const [leaderUserInfo, setLeaderUserInfo] = useState([]);
  const [groupMembersInfo, setGroupMembersInfo] = useState([]);
  const [workderTasksInfo, setWorkerTasksInfo] = useState([]);

  const navigate = useNavigate();

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

    const dataGroupMembers = await GroupApi.getAllUserByGroupId(dataLeaderUser?.groupId);
    // if (dataGroupMembers.code !== 0) {
    //   message.error = dataGroupMembers.message;
    //   return;
    // }

    const dataWorkerTasks = await WorkerTasksApi.getWorkerTaskByLeaderTaskId(dataLeaderTask?.data?.id);
    if (dataWorkerTasks.code !== 0) {
      message.error = dataWorkerTasks.message;
      return;
    }


    setLeaderTaskInfo(dataLeaderTask?.data);
    setLeaderUserInfo(dataLeaderUser);
    setGroupMembersInfo(dataGroupMembers?.data);
    setWorkerTasksInfo(dataWorkerTasks);

  console.log(dataGroupMembers?.data)

    setLoading(false);
  };
  
  useEffect(() => {
    getData(leaderTaskId, true);
  }, [leaderTaskId]);

  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          // userRef.current = record; 
          navigate(routes.dashboard.workersTasks + "/" + id);
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          // userRef.current = record;
          // setShowUpdateModal(true);
        },
      },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Khóa",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => { },
      },
    ];
  };

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <Space direction="vertical" className="w-full gap-6">
      <WorkerTaskInfo
        dataLeaderTasks={leaderTaskInfo}
        dataGroupMembers={groupMembersInfo}
        loading={loading}
      />
      {/* <WorkerTaskMaterial
        title="Danh sách vật liệu"
        dataSource={materialInfo}
      /> */}
      <WorkerTaskProcedureOverview
        title="Tiến độ công việc"
        dataSource={workderTasksInfo}
      />
      <WorkerTaskProcedureManagement
        dataWorkerTasks={workderTasksInfo}
        dataGroupMembers={groupMembersInfo}
      />
    </Space>
  );
};
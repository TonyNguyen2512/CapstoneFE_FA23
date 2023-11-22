import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskMaterials } from "./components/LeaderTaskMaterials";
import { LeaderTaskProcedure } from "./components/LeaderTaskProcedure";
import { LeaderTaskProcedureOverview } from "./components/LeaderTaskProcedureOverview";
import { UserContext } from "../../../../providers/user";
import LeaderTasksApi from "../../../../apis/leader-task";
import OrderApi from "../../../../apis/order";
import { Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";


export const LeaderTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();

  const navigate = useNavigate();

  const getData = async (id, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve order data by id
    const dataOrder = await OrderApi.getOrderById(id);
    // retrieve order detail by order id
    const dataMaterials = await OrderApi.getQuoteMaterialByOrderId(dataOrder?.id);

    getLeaderTaskData(id);

    setOrderInfo(dataOrder);

    setMaterialInfo(dataMaterials);

    setLoading(false);
  };

  const getLeaderTaskData = async () => {
    setLoading(true);
    // // retrieve leader task by order id
    const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(id);
    if (dataLeaderTasks.code === 0) {
      setTaskInfo(dataLeaderTasks.data);
    } else {
      message.error = dataLeaderTasks.message;
    }

    setLoading(false);
  }

  useEffect(() => {
    if (id) {
      getData(id, true);
    }
  }, [id]);

  return (
    <BasePageContent onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.managersTasks}`)}>
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={taskInfo}
            info={orderInfo}
            material={materialInfo}
          // onReload={(handleLoading) => {
          //   getWorkerTaskList(leaderTaskId, handleLoading);
          // }}
          // onFilterTask={(memberId) => {
          //   if (memberId) {
          //     const newTasks = allTasks.current.filter(
          //       (e) => e?.members?.find((x) => x.memberId === memberId) !== undefined
          //     );
          //     setWorkerTaskList(newTasks);
          //   } else {
          //     setWorkerTaskList(allTasks.current);
          //   }
          // }}
          >
            <div className="mt-4">
              <LeaderTaskInfo
                loading={loading}
              /></div>
            <div className="mt-4">
              <LeaderTaskMaterials
                title="Danh sách vật liệu"
              />
            </div>
            <div className="mt-4">
              <LeaderTaskProcedureOverview
                title="Tiến độ quy trình"
              />
            </div>
            <div className="mt-4">
              <LeaderTaskProcedure
                title="Danh sách quy trình"
                reloadData={getLeaderTaskData}
              />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
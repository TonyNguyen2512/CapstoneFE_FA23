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
import { PageSize } from "../../../../constants/enum";


export const LeaderTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();
  const allMaterials = useRef();

  const navigate = useNavigate();

  const getLeaderTaskData = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // // retrieve leader task by order id
    try {
      const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(id, search, pageIndex, PageSize.LEADER_TASK_PROCEDURE_LIST);
      if (dataLeaderTasks.code === 0) {
        setTaskInfo(dataLeaderTasks?.data);
      } else {
        message.error = dataLeaderTasks.message;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const getData = (id, handleLoading) => {
      if (handleLoading) {
        setLoading(true);
      }

      if (!id) return;

      // retrieve order data by id
      OrderApi.getOrderById(id).then((dataOrder) => {
        setOrderInfo(dataOrder);
        OrderApi.getQuoteMaterialByOrderId(dataOrder?.id).then((dataMaterials) => {
          setMaterialInfo(dataMaterials?.listFromOrder);
          allMaterials.current = dataMaterials?.listFromOrder;
        });
      });      
      setLoading(false);
    };

    getData(id, true);
  }, [id]);

  useEffect(() => {
    getLeaderTaskData(null, 1, true);
  }, []);

  return (
    <BasePageContent onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.managersTasks}`)}>
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={taskInfo}
            info={orderInfo}
            material={materialInfo}
            onReload={(handleLoading) => {
              getLeaderTaskData(handleLoading);
            }}
            onFilterTask={(search, pageIndex) => {
              getLeaderTaskData(search, pageIndex, true);
            }}
            onFilterMaterial={(search) => {
              let dataMaterialFilter = {};
              if (search) {
                dataMaterialFilter = allMaterials.current.filter(x => x.name.indexOf(search) !== -1);
              } else {
                dataMaterialFilter = allMaterials.current;
              }
              setMaterialInfo(dataMaterialFilter);
            }}
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
              />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
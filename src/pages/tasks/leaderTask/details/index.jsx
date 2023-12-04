import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskMaterials } from "./components/LeaderTaskMaterials";
import { LeaderTaskProcedure } from "./components/LeaderTaskProcedure";
import { LeaderTaskProcedureOverview } from "./components/LeaderTaskProcedureOverview";
import LeaderTasksApi from "../../../../apis/leader-task";
import OrderApi from "../../../../apis/order";
import { Button, Row, Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { PageSize } from "../../../../constants/enum";

export const LeaderTaskDetailsPage = () => {
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();
  const allMaterials = useRef();

  const navigate = useNavigate();

  const syncMaterials = async () => {
    setLoading(true);
    const syncMaterial = await OrderApi.updateQuote(id);
    if (syncMaterial) {
      message.success(`Cập nhật nguyên vât liệu thành công`);
      getData(id, true);
    } else {
      message.error(`Cập nhật thất bại`);
    }
    setLoading(false);
    // setMaterial(syncMaterial);
  };

  const getOrderStatus = async () => {
    setLoading(true);
    const getOrderStatus = await OrderApi.updateOrderStatus(1, id);
    if (getOrderStatus) {
      message.success(`Báo giá thành công`);
      getData(id, true);
    } else {
      message.error(`Báo giá thất bại`);
    }
    setLoading(false);

    // setOrderStatus(getOrderStatus);
  };

  const getLeaderTaskData = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    // // retrieve leader task by order id
    try {
      const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(
        id,
        search,
        pageIndex,
        PageSize.LEADER_TASK_PROCEDURE_LIST
      );
      if (dataLeaderTasks.code === 0) {
        setTaskInfo(dataLeaderTasks?.data);
      } else {
        message.error(dataLeaderTasks.message);
      }
      dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(id);
      if (dataLeaderTasks.code === 0) {
        setAllTasks(dataLeaderTasks?.data);
      } else {
        message.error(dataLeaderTasks.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    getData(id, true);
  }, [id]);

  useEffect(() => {
    getLeaderTaskData(null, 1, true);
  }, []);

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.managersTasks}`)}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Space>
              <Button
                type="primary"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => syncMaterials()}
              >
                Cập nhật nguyên vật liệu
              </Button>
              <Button
                type="primary"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => getOrderStatus()}
              >
                Báo giá đơn hàng
              </Button>
            </Space>
          </div>
          <TaskProvider
            tasks={taskInfo}
            allTasks={allTasks}
            info={orderInfo}
            material={materialInfo}
            onReload={(handleLoading) => {
              getLeaderTaskData(null, 1, handleLoading);
            }}
            onFilterTask={(search, pageIndex) => {
              getLeaderTaskData(search, pageIndex, true);
            }}
            onFilterMaterial={(search) => {
              let dataMaterialFilter = {};
              if (search) {
                dataMaterialFilter = allMaterials.current.filter(
                  (x) => x.name.indexOf(search) !== -1
                );
              } else {
                dataMaterialFilter = allMaterials.current;
              }
              setMaterialInfo(dataMaterialFilter);
            }}
          >
            <div className="mt-4">
              <LeaderTaskInfo loading={loading} />
            </div>
            <div className="mt-4">
              <LeaderTaskMaterials title="Danh sách vật liệu" />
            </div>
            <div className="mt-4">
              <LeaderTaskProcedureOverview title="Tiến độ quy trình" />
            </div>
            <div className="mt-4">
              <LeaderTaskProcedure title="Danh sách quy trình" />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};

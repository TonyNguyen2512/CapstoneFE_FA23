import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LeaderTaskOrderDetailInfo } from "./components/LeaderTaskOrderDetailInfo";
import { Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../../../layouts/containers/BasePageContent";
import { TaskProvider } from "../../../../../../providers/task";
import LeaderTasksApi from "../../../../../../apis/leader-task";
import { ETaskStatus, PageSize } from "../../../../../../constants/enum";
import routes from "../../../../../../constants/routes";
import OrderDetailApi from "../../../../../../apis/order-detail";
import OrderDetailMaterialApi from "../../../../../../apis/order-details-material";
import OrderApi from "../../../../../../apis/order";
import { LeaderTaskOrderDetailProcedureOverview } from "./components/LeaderTaskOrderDetailProcedureOverview";
import { LeaderTaskOrderDetailProcedure } from "./components/LeaderTaskOrderDetailProcedure";
import { ALL_PERMISSIONS, roles } from "../../../../../../constants/app";
import { UserContext } from "../../../../../../providers/user";
import { usePermissions } from "../../../../../../hooks/permission";

export const LeaderTaskOrderDetailsPage = () => {
  const permissions = usePermissions();
  const canView = permissions?.includes(ALL_PERMISSIONS.leadersTasks.view)
    || permissions?.includes(ALL_PERMISSIONS.orders.view);
  // const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const { orderDetailId, id } = useParams();

  const [orderDetailInfo, setOrderDetailInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();
  const [state, setState] = useState([]);
  const [accepted, setAccepted] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const { user } = useContext(UserContext);
  const isForeman = user?.role?.name === roles.FOREMAN;
  const isAdmin = user?.role?.name === roles.ADMIN;

  const getOrderDetailData = async (handleLoading, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve order detail by id
    try {
      let dataLeaderTasks = [];
      for (let index = pageIndex; index >= 1; index--) {
        dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderDetailId(
          orderDetailId,
          search,
          index,
          PageSize.LEADER_TASK_PROCEDURE_LIST
        );
        if (dataLeaderTasks.code === 0) {
          if (index === 1 || dataLeaderTasks?.data?.data?.length > 0) {
            setTaskInfo(dataLeaderTasks?.data);
            break;
          }
        } else {
          message.error(dataLeaderTasks.message);
        }
      }
      dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderDetailId(orderDetailId);
      if (dataLeaderTasks.code === 0) {
        setAllTasks(dataLeaderTasks?.data);

        const acceptanceTasks = dataLeaderTasks?.data?.data?.filter(
          (e) => e.status === ETaskStatus.Acceptance
        );
        if (acceptanceTasks.length === 1) {
          setAccepted(true);
        }
      } else {
        message.error(dataLeaderTasks.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const getData = async (handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!orderDetailId || !id) return;

    const orderData = await OrderApi.getOrderById(id);
    // retrieve order detail data by id
    const orderDetailData = await OrderDetailApi.getAllTaskByOrderDetailId(orderDetailId);
    if (orderDetailData) {
      setOrderDetailInfo({ ...orderDetailData, status: orderData?.status, orderId: orderData?.id });
    }

    const materialData = await OrderDetailMaterialApi.getByOrderDetailId(orderDetailId);
    if (materialData.code === 0) {
      setMaterialInfo(materialData?.data);
    } else {
      message.error(materialData.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    getData(true);
  }, []);

  useEffect(() => {
    if (location?.state) {
      setState(location?.state);
    }
  }, [location]);

  useEffect(() => {
    getOrderDetailData(true, 1);
  }, []);

  const handleBack = () => {
    if (state?.orderId) {
      let path = `${routes.dashboard.root}`;
      if (isForeman) {
        path += `/${routes.dashboard.managersTasks}`;
      }
      if (isAdmin) {
        path += `/${routes.dashboard.orders}`;
      }
      if (state?.orderId) {
        path += `/${state?.orderId}`;
      }
      navigate(path, {
        state: state
      }, { replace: true });
    } else {
      navigate(-1);
    }
  }

  return canView && (
    <BasePageContent onBack={handleBack} >
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={taskInfo}
            allTasks={allTasks}
            info={orderDetailInfo}
            materials={materialInfo}
            accepted={accepted}
            onReload={(handleLoading) => {
              getOrderDetailData(handleLoading, 1);
            }}
            onFilterTask={(pageIndex, search) => {
              getOrderDetailData(true, pageIndex, search);
            }}
          >
            <div className="mt-4">
              <LeaderTaskOrderDetailInfo loading={loading} />
            </div>
            <div className="mt-4">
              <LeaderTaskOrderDetailProcedureOverview title="Tiến độ quy trình" />
            </div>
            <div className="mt-4">
              <LeaderTaskOrderDetailProcedure title="Danh sách quy trình" />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};
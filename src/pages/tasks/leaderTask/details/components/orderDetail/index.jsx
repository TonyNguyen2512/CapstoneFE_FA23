import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { LeaderTaskOrderDetailInfo } from "./components/LeaderTaskOrderDetailInfo";
import { LeaderTaskOrderDetailProcedure } from "./components/LeaderTaskOrderDetailProcedure";
import { LeaderTaskOrderDetailProcedureOverview } from "./components/LeaderTaskOrderDetailProcedureOverview";
import { Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../../../layouts/containers/BasePageContent";
import { TaskProvider } from "../../../../../../providers/task";
import LeaderTasksApi from "../../../../../../apis/leader-task";
import { PageSize } from "../../../../../../constants/enum";
import routes from "../../../../../../constants/routes";
import OrderDetailApi from "../../../../../../apis/order-detail";
import OrderDetailMaterialApi from "../../../../../../apis/order-details-material";

export const LeaderTaskOrderDetailsPage = () => {
  // const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);

  const { orderDetailId, id } = useParams();

  const [orderDetailInfo, setOrderDetailInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();
  const [state, setState] = useState([]);

  const navigate = useNavigate();
  const location = useLocation();

  const getOrderDetailData = async (handleLoading, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }
    // retrieve order detail by id
    try {
      let dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderDetailId(
        orderDetailId,
        search,
        pageIndex,
        PageSize.LEADER_TASK_PROCEDURE_LIST
      );
      if (dataLeaderTasks.code === 0) {
        setTaskInfo(dataLeaderTasks?.data);
      } else {
        message.error(dataLeaderTasks.message);
      }
      dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderDetailId(orderDetailId);
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

  const getData = async (handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!orderDetailId) return;

    // retrieve order detail data by id
    const orderDetailData = await OrderDetailApi.getAllTaskByOrderDetailId(orderDetailId);
    if (orderDetailData) {
      setOrderDetailInfo(orderDetailData);
      // setAllTasks(orderDetailData?.leaderTasks);
      // setTaskInfo(orderDetailData?.leaderTasks);
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
      let path = "";
      path = `${routes.dashboard.root}/${routes.dashboard.managersTasks}`;
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

  return (
    <BasePageContent onBack={handleBack} >
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          <TaskProvider
            tasks={taskInfo}
            allTasks={allTasks}
            info={orderDetailInfo}
            materials={materialInfo}
            onReload={(handleLoading) => {
              getOrderDetailData(handleLoading, 1);
            }}
            onFilterTask={(search, pageIndex) => {
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
              <LeaderTaskOrderDetailProcedure title="Danh sách quy trình" orderId={id} />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};

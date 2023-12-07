import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskOrderDetails } from "./components/LeaderTaskOrderDetails";
import { UserContext } from "../../../../providers/user";
import LeaderTasksApi from "../../../../apis/leader-task";
import OrderApi from "../../../../apis/order";
import { Button, Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { OrderStatus, PageSize, TaskStatus } from "../../../../constants/enum";
import OrderDetailApi from "../../../../apis/order-details";

export const LeaderTaskDetailsPage = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [orderDetailInfo, setOrderDetailInfo] = useState();

  const { getMaterial, setMaterial } = useState([]);
  const { getQuote, setQuote } = useState([]);

  const [assignTo, setAssignTo] = useState([]);

  const navigate = useNavigate();

  const getMaterials = async () => {
    const assignTo = await OrderApi.updateQuote(id);
    if (assignTo) {
      message.success(`Cập nhật thành công`);
      getData(true);
    } else {
      message.error(`Cập nhật thất bại`);
    }
    setAssignTo(assignTo);
  };

  const getOrderStatus = async () => {
    const assignTo = await OrderApi.updateOrderStatus(1, id);
    if (assignTo) {
      message.success(`Cập nhật thành công`);
      getData(true);
    } else {
      message.error(`Cập nhật thất bại`);
    }
    setAssignTo(assignTo);
  };

  // const getLeaderTaskData = async (handleLoading, pageIndex, search) => {
  //   if (handleLoading) {
  //     setLoading(true);
  //   }
  //   // retrieve leader task by order id
  //   try {
  //     let dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(
  //       id,
  //       search,
  //       pageIndex,
  //       PageSize.LEADER_TASK_PROCEDURE_LIST
  //     );
  //     if (dataLeaderTasks.code === 0) {
  //       setTaskInfo(dataLeaderTasks?.data);
  //     } else {
  //       message.error(dataLeaderTasks.message);
  //     }
  //     dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(id);
  //     if (dataLeaderTasks.code === 0) {
  //       setAllTasks(dataLeaderTasks?.data);
  //     } else {
  //       message.error(dataLeaderTasks.message);
  //     }
  //   } catch (e) {
  //     console.log(e);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const getData = (handleLoading, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!id) return;

    // retrieve order data by id
    OrderApi.getOrderById(id).then((dataOrder) => {
      setOrderInfo(dataOrder);
      getDataOrderDetail(handleLoading, dataOrder?.id, 1);
    });
    setLoading(false);
  };

  const getDataOrderDetail = (handleLoading, orderId, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!orderId) return;

    OrderDetailApi.getListByOrderId(orderId, search, pageIndex, PageSize.LEADER_TASK_ORDER_DETAIL_LIST).then((dataOrderDetails) => {
      setOrderDetailInfo(dataOrderDetails);
    });

    setLoading(false);
  }

  useEffect(() => {
    getData(true);
  }, [id]);

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.managersTasks}`)}
    >
      <Spin spinning={loading}>
        <Space direction="vertical" className="w-full gap-6">
          {(orderInfo.status === OrderStatus.Pending || orderInfo.status === OrderStatus.Reject || orderInfo.status === OrderStatus.Request) &&
            <>
              <Button
                type="primay"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => getMaterials()}
              >
                Cập nhật nguyên vật liệu
              </Button>
              <Button
                type="primay"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => getOrderStatus()}
              >
                Báo giá đơn hàng
              </Button>
            </>
          }
          <TaskProvider
            tasks={taskInfo}
            allTasks={allTasks}
            info={orderInfo}
            orderDetails={orderDetailInfo}
            onReload={(handleLoading) => {
              getDataOrderDetail(handleLoading, orderInfo?.id, 1);
            }}
            onFilterTask={(pageIndex, search) => {
              getDataOrderDetail(true, orderInfo?.id, pageIndex, search);
            }}
          >
            <div className="mt-4">
              <LeaderTaskInfo loading={loading} />
            </div>
            <div className="mt-4">
              <LeaderTaskOrderDetails title="Danh sách vật liệu" />
            </div>
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};

import React, { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskOrderDetails } from "./components/LeaderTaskOrderDetails";
import { UserContext } from "../../../../providers/user";
import OrderApi from "../../../../apis/order";
import { Button, Space, Spin, message } from "antd";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import routes from "../../../../constants/routes";
import { TaskProvider } from "../../../../providers/task";
import { OrderStatus, PageSize } from "../../../../constants/enum";
import OrderDetailApi from "../../../../apis/order-details";
import { roles } from "../../../../constants/app";
import OrderReportApi from "../../../../apis/order-report";
import ApiCodes from "../../../../constants/apiCode";
import { LeaderTaskOrderReportModal } from "../components/LeaderTaskOrderReportModal";

export const LeaderTaskDetailsPage = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [allTasks, setAllTasks] = useState([]);
  const [orderDetailInfo, setOrderDetailInfo] = useState();
  const [managerOrder, setManagerOrder] = useState([]);
  const [showOrderReportModal, setShowOrderReportModal] = useState(false);
  const [orderReportLoading, setOrderReportLoading] = useState(false);

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

      setManagerOrder(user?.role?.name === roles.FOREMAN && user?.id === dataOrder?.assignToId);
    });
    setLoading(false);
  };

  const getDataOrderDetail = (handleLoading, orderId, pageIndex, search) => {
    if (handleLoading) {
      setLoading(true);
    }

    if (!orderId) return;

    OrderDetailApi.getListByOrderId(
      orderId,
      search,
      pageIndex,
      PageSize.LEADER_TASK_ORDER_DETAIL_LIST
    ).then((dataOrderDetails) => {
      setOrderDetailInfo(dataOrderDetails);
    });

    setLoading(false);
  }
  
  const handleSubmitOrderReport = async (values) => {
    setOrderReportLoading(true);
    console.log("send order report", values);
    const resp = await OrderReportApi.createOrderReport(values);
    if (resp) {
      message.info("Tạo báo cáo thành công");
    } else {
      message.error("Tạo báo cáo thất bại");
    }
    setOrderReportLoading(false);
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
          {(orderInfo.status === OrderStatus.Pending ||
            orderInfo.status === OrderStatus.Reject ||
            orderInfo.status === OrderStatus.Request) && (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <Button
                type="primary"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => setShowOrderReportModal(true)}
              >
                Báo cáo tiến độ
              </Button>
              <Button
                style={{ marginLeft: "10px" }}
                type="primay"
                className="btn-primary app-bg-primary font-semibold text-white"
                onClick={() => getOrderStatus()}
              >
                Báo giá đơn hàng
              </Button>
            </div>
          )}
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
            <LeaderTaskOrderReportModal
              open={showOrderReportModal}
              onCancel={() => {
                setShowOrderReportModal(false);
              }}
              onSubmit={handleSubmitOrderReport}
              confirmLoading={orderReportLoading}
              message={message}
              title="Báo cáo công việc"
            />
          </TaskProvider>
        </Space>
      </Spin>
    </BasePageContent>
  );
};

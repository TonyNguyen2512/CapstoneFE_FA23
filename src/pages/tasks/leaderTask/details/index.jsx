import React, { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LeaderTaskInfo } from "./components/LeaderTaskInfo";
import { LeaderTaskMaterials } from "./components/LeaderTaskMaterials";
import { LeaderTaskProcedure } from "./components/LeaderTaskProcedure";
import { LeaderTaskProcedureOverview } from "./components/LeaderTaskProcedureOverview";
import { UserContext } from "../../../../providers/user";
import LeaderTasksApi from "../../../../apis/leader-task";
import OrderApi from "../../../../apis/order";
import OrderDetailApi from "../../../../apis/order-detail";
import { Space } from "antd";


export const LeaderTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [orderDetail, setOrderDetail] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [orderDetailInfo, setOrderDetailInfo] = useState();

  const userRef = useRef();
  const rolesRef = useRef();

  const getData = async (id, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    console.log("test detail")
    // retrieve order data by id
    const dataOrder = await OrderApi.getOrderById(id);
    
    console.log(dataOrder)
      // retrieve order detail by order id
    const dataOrderDetails = await OrderDetailApi.getOrderDetailById(dataOrder?.id);
    // // retrieve leader task by order id
    const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(dataOrder?.id);

    setOrderInfo(dataOrder);

    setOrderDetailInfo(dataOrderDetails)

    setTaskInfo(dataLeaderTasks);

    setLoading(false);
  };

  useEffect(() => {
    if (id) {
      getData(id, true);
    }
  }, [id]);

  return (
    <Space direction="vertical" className="w-full gap-6">
      <LeaderTaskInfo
        dataSource={orderInfo}
        loading={loading}
      />
      <LeaderTaskMaterials
        title="Danh sách vật liệu"
        dataSource={orderDetailInfo}
      />
      <LeaderTaskProcedureOverview
        title="Tiến độ quy trình"
        dataSource={taskInfo}
      />
      <LeaderTaskProcedure
        title="Danh sách quy trình"
        dataSource={taskInfo}
      />
    </Space>
  );
};
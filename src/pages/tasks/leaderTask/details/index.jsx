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
import MaterialApi from "../../../../apis/material";


export const LeaderTaskDetailsPage = () => {

  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [orderInfo, setOrderInfo] = useState([]);
  const [taskInfo, setTaskInfo] = useState([]);
  const [materialInfo, setMaterialInfo] = useState();

  const userRef = useRef();
  const rolesRef = useRef();

  const getData = async (id, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    console.log("test detail")
    // retrieve order data by id
    const dataOrder = await OrderApi.getOrderById(id);
    
    console.log("dataOrder", dataOrder)
      // retrieve order detail by order id
    const dataMaterials = await OrderApi.getQuoteMaterialByOrderId(dataOrder?.id);

    getLeaderData(id);

    setOrderInfo(dataOrder);

    setMaterialInfo(dataMaterials)

    setLoading(false);
  };

  const getLeaderData = async() => {
    setLoading(true);
    // // retrieve leader task by order id
    const dataLeaderTasks = await LeaderTasksApi.getLeaderTaskByOrderId(id);
    setTaskInfo(dataLeaderTasks);

    setLoading(false);
  }

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
        dataSource={materialInfo}
      />
      <LeaderTaskProcedureOverview
        title="Tiến độ quy trình"
        dataSource={taskInfo}
      />
      <LeaderTaskProcedure
        title="Danh sách quy trình"
        dataSource={taskInfo}
        orderId={id}
        reloadData={getLeaderData}
      />
    </Space>
  );
};
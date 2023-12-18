import { Card, Col, Row, Typography, Space, Spin } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import {
  getRoleName,
  getStatusName,
  getTaskStatusName,
  getWTaskStatusName,
  reduceNumber,
} from "../../../utils";
import ReactECharts from "echarts-for-react";
import DashboardApi from "../../../apis/dashboard";
import { UserContext } from "../../../providers/user";
import { roles } from "../../../constants/app";

const { Title } = Typography;

const Home = () => {
  const { user } = useContext(UserContext);

  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState();
  const [orderData, setOrderData] = useState();
  const [orderByMonthData, setOrderByMonthData] = useState();
  const [leaderTaskData, setLeaderTaskData] = useState();
  const [workerTaskData, setWorkerTaskData] = useState();

  const getHomeData = async () => {
    setLoading(true);
    let data = await DashboardApi.UserDashboard();
    setUserData(data);
    data = await DashboardApi.OrderByMonthDashboard();
    setOrderByMonthData(data);
    data = await DashboardApi.LeaderTaskDashboard();
    setLeaderTaskData(data);

    if (user?.role?.name === roles.FOREMAN) {
      data = await DashboardApi.OrderAssignDashboardByForemanId(user.id);
      setOrderData(data);
    } else if (user?.role?.name === roles.ADMIN) {
      data = await DashboardApi.OrderDashboard();
      setOrderData(data);
    }

    if (user?.role?.name === roles.LEADER) {
      data = await DashboardApi.WorkerTaskDashboardByLeaderId(user.id);
      setWorkerTaskData(data);
    } else {
      data = await DashboardApi.WorkerTaskDashboard();
      setWorkerTaskData(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getHomeData();
  }, []);

  const getUsersStatistics = () => {
    return (
      userData?.map((e) => {
        return { name: getRoleName(e.roleName), value: e.totalUser };
      }) || []
    );
  };

  const getOrdersStatistics = () => {
    return (
      orderData?.map((e) => {
        return { name: getStatusName(e.orderStatus), value: e.total };
      }) || []
    );
  };

  const getLTasksStatistics = () => {
    return (
      leaderTaskData?.map((e) => {
        return { name: getTaskStatusName(e.taskStatus), value: e.total };
      }) || []
    );
  };

  const getWTasksStatistics = () => {
    return (
      workerTaskData?.map((e) => {
        return { name: getWTaskStatusName(e.taskStatus), value: e.total };
      }) || []
    );
  };

  const userOptions = {
    textStyle: {
      fontFamily: "Roboto",
    },
    height: "420px",
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0",
      left: "center",
    },
    series: [
      {
        name: "User's statistic",
        type: "pie",
        radius: ["54%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: getUsersStatistics(),
      },
    ],
  };

  const orderOptions = {
    textStyle: {
      fontFamily: "Roboto",
    },
    height: "420px",
    tooltip: {
      trigger: "item",
    },
    legend: {
      left: "5%",
      left: "center",
    },
    series: [
      {
        name: "Order's statistic",
        type: "pie",
        radius: ["0%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: getOrdersStatistics(),
      },
    ],
  };

  const leaderTaskOptions = {
    textStyle: {
      fontFamily: "Roboto",
    },
    height: "420px",
    tooltip: {
      trigger: "item",
    },
    legend: {
      left: "5%",
      left: "center",
    },
    series: [
      {
        name: "Order's statistic",
        type: "pie",
        radius: ["0%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: getLTasksStatistics(),
      },
    ],
  };

  const workerTaskOptions = {
    textStyle: {
      fontFamily: "Roboto",
    },
    height: "420px",
    tooltip: {
      trigger: "item",
    },
    legend: {
      top: "0",
      left: "center",
    },
    series: [
      {
        name: "User's statistic",
        type: "pie",
        radius: ["54%", "80%"],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 10,
          borderColor: "#fff",
          borderWidth: 2,
        },
        label: {
          show: false,
          position: "center",
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 36,
            fontWeight: "bold",
          },
        },
        labelLine: {
          show: false,
        },
        data: getWTasksStatistics(),
      },
    ],
  };

  return (
    <Spin spinning={loading}>
      <Title level={4}>Tổng quan</Title>
      <Space direction="vertical" className="w-full gap-6">
        <Row gutter={32}>
          {[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) && (
            <Col span={6}>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#E3F5FF" }} loading={loading}>
                <Row>
                  <Space className="w-full" direction="vertical">
                    <Row>
                      <Title level={5}>Tổng số người dùng</Title>
                    </Row>
                    <Row>
                      <Col span={16} className="flex items-center">
                        <Title level={1} className="!mb-0">
                          {reduceNumber(userData?.reduce((p, c) => p + c.totalUser, 0) || 0)}
                        </Title>
                      </Col>
                    </Row>
                  </Space>
                </Row>
              </Card>
            </Col>
          )}
          {[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) && (
            <Col span={6}>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#E5ECF6" }} loading={loading}>
                <Row>
                  <Space className="w-full" direction="vertical">
                    <Row>
                      <Title level={5}>Tổng số đơn hàng</Title>
                    </Row>
                    <Row>
                      <Col span={16} className="flex items-center">
                        <Title level={1} className="!mb-0">
                          {reduceNumber(orderData?.reduce((p, c) => p + c.total, 0) || 0)}
                        </Title>
                      </Col>
                    </Row>
                  </Space>
                </Row>
              </Card>
            </Col>
          )}
          {[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) && (
            <Col span={6}>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#E3F5FF" }} loading={loading}>
                <Row>
                  <Space className="w-full" direction="vertical">
                    <Row>
                      <Title level={5}>Tổng công việc (tổ trưởng)</Title>
                    </Row>
                    <Row>
                      <Col span={16} className="flex items-center">
                        <Title level={1} className="!mb-0">
                          {reduceNumber(leaderTaskData?.reduce((p, c) => p + c.total, 0) || 0)}
                        </Title>
                      </Col>
                    </Row>
                  </Space>
                </Row>
              </Card>
            </Col>
          )}
          <Col span={6}>
            <Card style={{ borderRadius: "1rem", backgroundColor: "#E5ECF6" }} loading={loading}>
              <Row>
                <Space className="w-full" direction="vertical">
                  <Row>
                    <Title level={5}>Tổng công việc (công nhân)</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={1} className="!mb-0">
                        {reduceNumber(workerTaskData?.reduce((p, c) => p + c.total, 0) || 0)}
                      </Title>
                    </Col>
                  </Row>
                </Space>
              </Row>
            </Card>
          </Col>
        </Row>
        {[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) && (
          <Row gutter={32}>
            <Col span={12}>
              <Title level={4}>Thống kê người dùng</Title>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#fff" }} loading={loading}>
                <ReactECharts className="!h-[420px]" option={userOptions} />
              </Card>
            </Col>
            <Col span={12}>
              <Title level={4}>Thống kê đơn đặt hàng</Title>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#fff" }} loading={loading}>
                <ReactECharts className="!h-[420px]" option={orderOptions} />
              </Card>
            </Col>
          </Row>
        )}
        <Row gutter={32}>
          {[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) && (
            <Col span={12}>
              <Title level={4}>Thống kê công việc (tổ trưởng)</Title>
              <Card style={{ borderRadius: "1rem", backgroundColor: "#fff" }} loading={loading}>
                <ReactECharts className="!h-[420px]" option={leaderTaskOptions} />
              </Card>
            </Col>
          )}
          <Col span={[roles.ADMIN, roles.FOREMAN].includes(user?.role?.name) ? 12 : 24}>
            <Title level={4}>Thống kê công việc (công nhân)</Title>
            <Card style={{ borderRadius: "1rem", backgroundColor: "#fff" }} loading={loading}>
              <ReactECharts className="!h-[420px]" option={workerTaskOptions} />
            </Card>
          </Col>
        </Row>
      </Space>
    </Spin>
  );
};

export default Home;

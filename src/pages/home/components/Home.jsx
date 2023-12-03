import { Card, Col, Row, Typography, Space, Spin } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../apis/role";
import { roles } from "../../../constants/app";
import { getRoleName, getStatusName, reduceNumber } from "../../../utils";
import { mockOverview } from "../../../__mocks__/jama/dashboard";
import { TrendingDown, TrendingUp } from "@icon-park/react";
import ReactECharts from "echarts-for-react";
import { mockAccounts } from "../../../__mocks__/accounts";
import DashboardApi from "../../../apis/dashboard";

const { Title } = Typography;

const Home = () => {
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
    data = await DashboardApi.OrderDashboard();
    setOrderData(data);
    data = await DashboardApi.OrderByMonthDashboard();
    setOrderByMonthData(data);
    data = await DashboardApi.LeaderTaskDashboard();
    setLeaderTaskData(data);
    data = await DashboardApi.WorkerTaskDashboard();
    setWorkerTaskData(data);
    setLoading(false);
  };

  useEffect(() => {
    getHomeData();
    console.log(userData, orderData, orderByMonthData, leaderTaskData, workerTaskData);
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
        return { name: getStatusName(e.orderStatus), value: e.total };
      }) || []
    );
  };

  const getWTasksStatistics = () => {
    return (
      workerTaskData?.map((e) => {
        return { name: getStatusName(e.orderStatus), value: e.total };
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
                    {/* <Col span={8} className="flex items-center">
                      <span>{mockOverview.views.percenatge > 0 ? "+" : ""}</span>
                      <span>{mockOverview.views.percenatge}</span>
                      {mockOverview.views.percenatge > 0 ? (
                        <TrendingUp
                          theme="outline"
                          size="20"
                          fill="#080"
                          className="relative top-1"
                        />
                      ) : (
                        <TrendingDown
                          theme="outline"
                          size="20"
                          fill="#f00"
                          className="relative top-1"
                        />
                      )}
                    </Col> */}
                  </Row>
                </Space>
              </Row>
            </Card>
          </Col>
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
                    {/* <Col span={8} className="flex items-center">
                      <span>{mockOverview.visits.percenatge > 0 ? "+" : ""}</span>
                      <span>{mockOverview.visits.percenatge}</span>
                      {mockOverview.visits.percenatge > 0 ? (
                        <TrendingUp
                          theme="outline"
                          size="20"
                          fill="#080"
                          className="relative top-1"
                        />
                      ) : (
                        <TrendingDown
                          theme="outline"
                          size="20"
                          fill="#f00"
                          className="relative top-1"
                        />
                      )}
                    </Col> */}
                  </Row>
                </Space>
              </Row>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ borderRadius: "1rem", backgroundColor: "#E3F5FF" }} loading={loading}>
              <Row>
                <Space className="w-full" direction="vertical">
                  <Row>
                    <Title level={5}>Tổng công việc (trưởng nhóm)</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={1} className="!mb-0">
                        {reduceNumber(leaderTaskData?.reduce((p, c) => p + c.total, 0) || 0)}
                      </Title>
                    </Col>
                    {/* <Col span={8} className="flex items-center">
                      <span>{mockOverview.newUsers.percenatge > 0 ? "+" : ""}</span>
                      <span>{mockOverview.newUsers.percenatge}</span>
                      {mockOverview.newUsers.percenatge > 0 ? (
                        <TrendingUp
                          theme="outline"
                          size="20"
                          fill="#080"
                          className="relative top-1"
                        />
                      ) : (
                        <TrendingDown
                          theme="outline"
                          size="20"
                          fill="#f00"
                          className="relative top-1"
                        />
                      )}
                    </Col> */}
                  </Row>
                </Space>
              </Row>
            </Card>
          </Col>
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
                    {/* <Col span={8} className="flex items-center">
                      <span>{mockOverview.activeUsers.percenatge > 0 ? "+" : ""}</span>
                      <span>{mockOverview.activeUsers.percenatge}</span>
                      {mockOverview.activeUsers.percenatge > 0 ? (
                        <TrendingUp
                          theme="outline"
                          size="20"
                          fill="#080"
                          className="relative top-1"
                        />
                      ) : (
                        <TrendingDown
                          theme="outline"
                          size="20"
                          fill="#f00"
                          className="relative top-1"
                        />
                      )}
                    </Col> */}
                  </Row>
                </Space>
              </Row>
            </Card>
          </Col>
        </Row>
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
        <Row gutter={32}>
          <Col span={12}>
            <Title level={4}>Thống kê công việc (trưởng nhóm)</Title>
            <Card style={{ borderRadius: "1rem", backgroundColor: "#fff" }} loading={loading}>
              <ReactECharts className="!h-[420px]" option={leaderTaskOptions} />
            </Card>
          </Col>
          <Col span={12}>
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

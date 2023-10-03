import { Card, Col, Row, Typography, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import RoleApi from "../../../apis/role";
import { roles } from "../../../constants/app";
import { reduceNumber } from "../../../utils";
import { mockOverview } from "../../../__mocks__/jama/dashboard";
import { TrendingDown, TrendingUp } from "@icon-park/react";
import ReactECharts from "echarts-for-react";
import { mockAccounts } from "../../../__mocks__/accounts";

const { Title } = Typography;

const Home = () => {
  const [loading, setLoading] = useState(false);
  const [showUpdateRoleModal, setShowUpdateRoleModal] = useState(false);
  const [data, setData] = useState({});

  const userRef = useRef();
  const rolesRef = useRef();

  const getUsersStatistics = () => {
    let data = [];
    mockAccounts.map((e) => {
      let index = data.findIndex((d) => d.name === e.role);
      index >= 0 ? (data[index].value += 1) : data.push({ name: e.role, value: 1 });
    });
    return data;
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
        data: [
          {
            name: "Đang tiến hành",
            value: 50,
          },
          {
            name: "Hoàn thành",
            value: 32,
          },
          {
            name: "Chưa tiến hành",
            value: 18,
          },
        ],
      },
    ],
  };

  const getHomeData = async (keyword) => {
    setLoading(true);
    // const data = await UserApi.searchUsers(keyword);
    // data.sort((a, b) => {
    //   if (a.role === roles.ADMIN) {
    //     return -1; // a comes before b
    //   }
    //   if (b.role === roles.ADMIN) {
    //     return 1; // b comes before a
    //   }
    //   return 0; // no change in order
    // });
    setData(data);
    setLoading(false);
  };

  const getAllRoles = async () => {
    const result = await RoleApi.getAllRoles();
    rolesRef.current = result.filter((e) => e.name !== roles.ADMIN);
  };

  useEffect(() => {
    getHomeData();
    getAllRoles();
  }, []);

  return (
    <>
      <Title level={4}>Tổng quan</Title>
      <Space direction="vertical" className="w-full gap-6">
        <Row gutter={32}>
          <Col span={6}>
            <Card style={{ borderRadius: "1rem", backgroundColor: "#E3F5FF" }} loading={loading}>
              <Row>
                <Space className="w-full" direction="vertical">
                  <Row>
                    <Title level={5}>Tổng đơn hàng tại xưởng</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={2} className="!mb-0">
                        {reduceNumber(mockOverview.views.total)}
                      </Title>
                    </Col>
                    <Col span={8} className="flex items-center">
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
                    </Col>
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
                    <Title level={5}>Tổng đơn hàng tại công trình</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={2} className="!mb-0">
                        {reduceNumber(mockOverview.visits.total)}
                      </Title>
                    </Col>
                    <Col span={8} className="flex items-center">
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
                    </Col>
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
                    <Title level={5}>Tổng hợp đồng</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={2} className="!mb-0">
                        {reduceNumber(mockOverview.newUsers.total)}
                      </Title>
                    </Col>
                    <Col span={8} className="flex items-center">
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
                    </Col>
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
                    <Title level={5}>Tổng doanh thu</Title>
                  </Row>
                  <Row>
                    <Col span={16} className="flex items-center">
                      <Title level={2} className="!mb-0">
                        {reduceNumber(mockOverview.activeUsers.total)}
                      </Title>
                    </Col>
                    <Col span={8} className="flex items-center">
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
                    </Col>
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
      </Space>
    </>
  );
};

export default Home;

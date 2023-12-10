import { Layout, Space, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { AppSider } from "./Sider";
import { AppHeader } from "./Header";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import routes from "../../constants/routes";
import Lottie from "react-lottie";
import animationData from "../../assets/lotties/home-animation";
import AuthApi from "../../apis/auth";
import { UserContext } from "../../providers/user";
import { getRoleName } from "../../utils";
import { logoUrlBig, roles } from "../../constants/app";
const { Content } = Layout;
const { Title } = Typography;

export const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    AuthApi.authorize()
      .then((user) => {
        if (!user) {
          localStorage.removeItem("jwt");
          localStorage.removeItem("user");
          localStorage.removeItem("userRole");
          navigate(routes.login);
          return;
        }
        document.title = `${getRoleName(user.role?.name)} | Dashboard`;
        setUser(user);
        var path = routes.dashboard.home;
        console.log(user.role);
        if (!location) {
          if (user.role?.name === roles.LEADER) {
            path = routes.dashboard.workersTasks;
          }
          else if (user.role?.name === roles.WORKER) {
            path = routes.dashboard.tasks;
          }
        } else {
          path = location;
        }
        navigate(path);
      })
      .catch((error) => {
        console.log(error);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <UserContext.Provider value={{ user: user, setUser: setUser }}>
      <Layout hasSider>
        <AppSider />
        <Layout>
          <AppHeader />
          <Layout>
            <Content
              style={{
                padding: 16,
                paddingRight: 32,
                overflow: "initial",
                backgroundColor: "white",
              }}
            >
              {location.pathname === routes.dashboard.root && (
                <div className="w-full h-[60vh] flex-center" style={{ flexDirection: "column" }}>
                  {/* <Title level={3}>JAMA Decor</Title> */}
                  {/* <Lottie
                    width="30%"
                    options={{
                      animationData: animationData,
                      autoplay: true,
                      loop: true,
                      rendererSettings: {
                        preserveAspectRatio: "xMidYMid slice",
                      },
                    }}
                  />
                  <Title level={4}>Coming Soon</Title> */}
                  <div className="bg-white flex-center p-10 circle">
                    <img src={logoUrlBig} width={360} />
                  </div>
                </div>
              )}
              <Outlet />
            </Content>
            {/* <ActivitySider /> */}
          </Layout>
        </Layout>
      </Layout>
    </UserContext.Provider>
  );
};

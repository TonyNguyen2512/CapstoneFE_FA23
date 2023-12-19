import React, { useEffect, useState } from "react";
import { Badge, Divider, Dropdown, Empty, List, Popover, Space, Spin, notification } from "antd";
import NotificationApi from "../../../apis/notification";
import moment from "moment";
import { BellFilled, BellOutlined, MoreOutlined } from "@ant-design/icons";
import { useRole } from "../../../hooks/role";
import { roles } from "../../../constants/app";
import { NotificationType } from "../../../constants/enum";
import { useNavigate } from "react-router";
import routes from "../../../constants/routes";
import useMicrosoftSignalR from "../../../hooks/microsoftSignalr";
import "moment/locale/vi"; // without this line it didn't work
moment.locale("vi");

const Notifications = ({}) => {
  const navigate = useNavigate();
  const { createMicrosoftSignalrConnection, ENotificationHub } = useMicrosoftSignalR();

  const role = useRole();
  const [listSeen, setListSeen] = useState([]);
  const [listUnseen, setListUnseen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [countNotiUnseen, setCountNotiUnseen] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    initNotificationSignalR();
    (async () => {
      setLoading(true);
      getListNoti();
      setLoading(false);
    })();
  }, []);

  const initNotificationSignalR = () => {
    // connect to hub
    const connection = createMicrosoftSignalrConnection(ENotificationHub.EndPoint);
    const method = ENotificationHub.Method;
    // listen to method name
    connection?.on(method.NewNotify, (res) => {
      // console.log("Received NewNotify from the server:", res);
      setCountNotiUnseen(res?.countUnseen || 0);

      if (res?.notification?.id) {
        const newNoti = res?.notification;
        notification.info({
          message: newNoti.title,
          description: newNoti.content,
          duration: 3,
        });
      }
    });
  };

  const getListNoti = async () => {
    const res = await NotificationApi.getByUserLogin();
    setListSeen(res?.listSeen || []);
    setListUnseen(res?.listUnseen || []);
    setCountNotiUnseen(res?.listUnseen?.length || 0);
  };

  const markAllSeen = async () => {
    setLoading(true);
    await NotificationApi.markAllSeen();
    await getListNoti();
    setLoading(false);
  };

  const markSeenById = async (id) => {
    setLoading(true);
    await NotificationApi.markSeenById(id);
    await getListNoti();
    setLoading(false);
  };

  const deleteById = async (id) => {
    setLoading(true);
    await NotificationApi.deleteById(id);
    await getListNoti();
    setLoading(false);
  };

  const goToDetail = (noti) => {
    if (!role?.name || !noti || noti?.type < 0) {
      return;
    }

    const dashboard = routes.dashboard;
    const root = dashboard.root;

    switch (noti?.type) {
      case NotificationType.Order:
        if (role.name == roles.ADMIN) {
          console.log("goToDetail - Order - ADMIN: ");
          navigate(`${root}/${dashboard.orders}/${noti?.orderId}`);
        }
        if (role.name == roles.FOREMAN) {
          console.log("goToDetail - Order - FOREMAN: ");
          navigate(`${root}/${dashboard.managersTasks}/${noti?.orderId}`);
        }
        break;
      case NotificationType.LeaderTask:
        console.log("goToDetail - LeaderTask: ");
        navigate(`${root}/${dashboard.workersTasks}/${noti?.leaderTaskId}`);
        break;
      case NotificationType.WorkerTask:
        console.log("goToDetail - WorkerTask: ");
        navigate(`${root}/${dashboard.workersTasks}/${noti?.leaderTaskId}`);
        break;
      case NotificationType.TaskReport:
        console.log("goToDetail - TaskReport: ");
        navigate(`${root}/${dashboard.taskReports}/${noti?.reportId}`);
        break;
      case NotificationType.OrderReport:
        console.log("goToDetail - OrderReport: ");
        navigate(`${root}/${dashboard.adminReports}/${noti?.reportId}`);
        break;
      default:
        console.log("goToDetail - default - home: ");
        navigate(`${root}/${dashboard.home}`);
        break;
    }
    setShowPopup(false);
  };

  const getActionNoties = (noti, seen = false) => {
    let listAct = [
      { key: "DELETE", label: "Xoá thông báo", danger: true, onClick: () => deleteById(noti?.id) },
    ];
    if (!seen) {
      listAct.unshift({
        key: "SEEN",
        label: "Đánh dấu đã đọc",
        onClick: () => markSeenById(noti?.id),
      });
    }
    return listAct;
  };
  return (
    <Popover
      trigger="click"
      open={showPopup}
      onOpenChange={(open) => setShowPopup(open)}
      content={
        <Space.Compact direction="vertical" className="w-[350px] max-h-[90vh]">
          <div className="px-2 flex justify-between items-center">
            <h4 className="text-[#ddb850]">Thông báo</h4>
            {loading && <Spin />}
          </div>
          {!listSeen?.length > 0 && !listUnseen?.length > 0 && (
            <Empty description="Không có thông báo" className="my-3" />
          )}
          <div className=" overflow-y-auto">
            {listUnseen?.length > 0 && (
              <>
                <ListNoti
                  listNoti={listUnseen}
                  markAllSeen={markAllSeen}
                  markSeenById={markSeenById}
                  goToDetail={goToDetail}
                  getActionNoties={getActionNoties}
                />
              </>
            )}

            {listSeen?.length > 0 && (
              <ListNoti
                seen={true}
                listNoti={listSeen}
                markAllSeen={markAllSeen}
                markSeenById={markSeenById}
                goToDetail={goToDetail}
                getActionNoties={getActionNoties}
              />
            )}
          </div>
        </Space.Compact>
      }
    >
      {countNotiUnseen > 0 ? (
        <Badge count={countNotiUnseen}>
          <BellFilled className="text-[#666] text-2xl relative top-1" />
        </Badge>
      ) : (
        <BellOutlined className="text-[#666] text-2xl relative top-1" />
      )}
    </Popover>
  );
};

export default Notifications;

const ListNoti = ({
  seen = false,
  listNoti,
  markAllSeen = () => {},
  markSeenById = () => {},
  goToDetail = () => {},
  getActionNoties = () => {},
}) => {
  return (
    <>
      <div className="flex justify-between items-end px-2">
        <h5 className="m-0">{seen ? "Trước đó" : "Mới"}</h5>
        {!seen && (
          <span className="text-primary cursor-pointer" onClick={markAllSeen}>
            Đánh dấu tất cả đã đọc
          </span>
        )}
      </div>
      <List
        className="mt-2"
        size="small"
        dataSource={listNoti}
        renderItem={(noti) => (
          <List.Item className=" p-0 border-0">
            <div className="relative w-full cursor-pointer mt-1 ">
              <div
                className={`flex-col p-2 rounded-[8px] hover:bg-[#ddb85025] ${
                  !seen ? "bg-[#ddb85015]" : ""
                }`}
                onClick={() => {
                  if (noti?.seen === false) {
                    markSeenById(noti.id);
                  }
                  goToDetail(noti);
                }}
              >
                <h6 className="mb-1">{noti?.title}</h6>
                <div>{noti?.content}</div>
                <div className="text-secondary mt-1">
                  <small>{moment(noti?.createdDate)?.fromNow()}</small>
                </div>
              </div>

              <Dropdown
                className="absolute top-2 right-1 text-[0.9rem] hover:bg-[#ddb85025] p-2 rounded-full"
                trigger="click"
                menu={{ items: getActionNoties(noti, seen) }}
                arrow
              >
                <MoreOutlined />
              </Dropdown>
            </div>
          </List.Item>
        )}
      />
      {!seen && <Divider />}
    </>
  );
};

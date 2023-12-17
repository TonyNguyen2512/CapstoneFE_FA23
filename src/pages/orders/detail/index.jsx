import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { OrderDetailsProvider } from "../../../providers/orderDetails";
import OrderDetailApi from "../../../apis/order-details";
import { OrderDetail } from "./components/OrderDetail";
import React, { useContext, useEffect, useRef, useState } from "react";
import OrderApi from "../../../apis/order";
import { useParams } from "react-router";
import { Button, Dropdown, Space, Spin, Table, Typography, message } from "antd";
import UserApi from "../../../apis/user";
import { BaseTable } from "../../../components/BaseTable";
import { Edit, Error, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import routes from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { ItemOrderModal } from "./components/ItemOrderModal";
import ItemApi from "../../../apis/item";
import { UpdateStatus } from "../components/UpdateStatus";
import { ETaskStatus, PageSize, modalModes } from "../../../constants/enum";
import OrderReportApi from "../../../apis/order-report";
import { LeaderTaskOrderReportModal } from "../../tasks/leaderTask/components/LeaderTaskOrderReportModal";
import LeaderTasksApi from "../../../apis/leader-task";
import {
  dateSort,
  formatDate,
  formatMoney,
  formatNum,
  getTaskStatusColor,
  getTaskStatusName,
  handleRetrieveWorkerOnTask,
} from "../../../utils";
import confirm from "antd/es/modal/confirm";
import { TaskContext } from "../../../providers/task";
import { LeaderTaskModal } from "../../tasks/leaderTask/components/LeaderTaskModal";
import TaskDetailModal from "../../../components/modals/task/detail";
import WorkerTasksApi from "../../../apis/worker-task";
import GroupApi from "../../../apis/group";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState();
  const [itemList, setItemList] = useState([]);
  const [listItemSelect, setListItemSelect] = useState();
  const [showItemModal, setShowItemModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState();
  const [showOrderReportModal, setShowOrderReportModal] = useState(false);
  const [showETaskCreateModal, setShowETaskCreateModal] = useState(false);
  const [showETaskUpdateModal, setShowETaskUpdateModal] = useState(false);
  const [showETaskProgressReportModal, setShowETaskProgressReportModal] = useState(false);
  const [eTaskCreateLoading, setETaskCreateLoading] = useState(false);
  const [eTaskUpdateLoading, setETaskUpdateLoading] = useState(false);
  const [eTaskProgressReportLoading, setETaskReportLoading] = useState(false);
  const [leadersData, setLeadersData] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [searchData, setSearchData] = useState("");

  const [showWTaskDetailModal, setShowWTaskDetailModal] = useState(false);
  const [wTaskDetailLoading, setWTaskDetaiLoading] = useState(false);

  const [orderReportLoading, setOrderReportLoading] = useState(false);
  const { info, orderDetails, reload, filterTask } = useContext(TaskContext);

  const itemRef = useRef();
  const orderRef = useRef();
  const orderDetailRef = useRef();
  const eTaskInfoRef = useRef();
  const wTaskInfoRef = useRef();

  const getDetails = async (search, pageIndex, handleLoading = true) => {
    if (!id) return;
    if (handleLoading) {
      setLoading(true);
    }
    let data = await OrderApi.getOrderById(id);
    setDetails(data);
    data = await OrderDetailApi.getListByOrderId(id, search, pageIndex, PageSize.ORDER_LIST);
    setItemList(data);
    console.log(itemList);
    data = await UserApi.getAll();
    setUsers(data);
    data = await ItemApi.getItemNotExistsInOrder(id);
    setListItemSelect(
      data?.data?.map((e) => {
        return {
          ...e,
          itemId: e?.id,
        };
      })
    );
    setLoading(false);
  };

  const handleRetrieveLeaderInfo = async () => {
    const resp = await UserApi.getByLeaderRole();
    setLeadersData(resp);
  };

  useEffect(() => {
    handleRetrieveLeaderInfo();
  }, []);

  const deleteETaskProcedure = async (value) => {
    if (window.confirm("Bạn chắc chắn muốn xoá?")) {
      setLoading(true);
      try {
        const success = await LeaderTasksApi.deleteLeaderTasks(value);
        if (success) {
          message.success(success.message);
          reload(false);
        } else {
          message.error(success.message);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };


  const getETaskActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
  console.log("info: ", info.id)

          eTaskInfoRef.current = record;
          navigate(
            routes.dashboard.workersTasks + "/" + id,
            {
              state: {
                
                orderDetailId: info.id,
              },
            },
            { replace: true }
          );
        },
      },
      {
        key: "UPDATE_ROLE",
        label: "Cập nhật thông tin",
        icon: <Edit />,
        onClick: () => {
          handleRetrieveLeaderInfo();
          handleShowETaskModal(record?.id);
        },
      },
      {
        key: "SET_STATUS",
        label: isActive ? "Mở khóa" : "Khóa",
        danger: !isActive,
        icon: !isActive ? <Forbid /> : <Unlock />,
        onClick: () => {
          confirm({
            title: "Xoá tiến độ",
            content: `Chắc chắn xoá "${record.name}"?`,
            type: "confirm",
            cancelText: "Hủy",
            onOk: () => deleteETaskProcedure(record.id),
            onCancel: () => {},
            closable: true,
          });
        },
      },
    ];
  };

  const handleSubmitWTaskUpdate = async (values) => {
    setWTaskDetaiLoading(true);
    let resp = null;
    if (values.status !== ETaskStatus.Pending) {
      console.log("update task: ", values);
      resp = await WorkerTasksApi.updateWorkerTask(values);
    } else {
      console.log("send feedback task: ", values);
      resp = await WorkerTasksApi.sendFeedback(values);
    }
    if (resp?.code === 0) {
      message.success(resp?.message);
      setShowWTaskDetailModal(false);
      handleReload();
    } else {
      message.error(resp?.message);
    }
    setWTaskDetaiLoading(false);
  };

  const handleReload = (value = searchData, current = currentPage) => {
    setLoading(true);
    setSearchData(value);
    filterTask(current, value);
    setLoading(false);
  };

  const handleShowETaskModal = async (foremanTaskId) => {
    if (!foremanTaskId) return;
    const data = await LeaderTasksApi.getLeaderTaskById(foremanTaskId);
    if (data.code === 0) {
      eTaskInfoRef.current = data.data;
      setShowETaskUpdateModal(true);
    } else {
      message.error(data.message);
    }
  };

  const handleSubmitETaskCreate = async (values) => {
    setETaskCreateLoading(true);
    const data = {
      name: values?.name,
      leaderId: values?.leaderId,
      itemId: orderDetailRef.current?.itemId,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      orderId: info.id,
    };
    console.log("orderDetailRef", orderDetailRef);
    console.log("create", data);
    try {
      const create = await LeaderTasksApi.createLeaderTasks(data);
      if (create.code === 0) {
        message.success(create.message);
        setShowETaskCreateModal(false);
        reload(false);
      } else {
        message.error(create.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskCreateLoading(false);
    }
  };

  const handleRetrieveWorkersUpdate = async (task) => {
    console.log("fetch workers update");
    const dataLeaderUser = await UserApi.getUserById(eTaskInfoRef?.current?.leaderId);
    if (dataLeaderUser?.groupId) {
      const dataWorkers = await GroupApi.getWorkersNotAtWorkByGroupId(dataLeaderUser.groupId);
      if (dataWorkers.code === 0) {
        const dataWorkerTask = handleRetrieveWorkerOnTask(task?.members);
        const dataTeam = [...dataWorkers.data, ...dataWorkerTask];
        setWorkers(dataTeam);
      } else {
        const dataWorkerTask = handleRetrieveWorkerOnTask(task?.members);
        setWorkers(dataWorkerTask);
      }
    } else {
      message.error("Tổ trưởng chưa có tổ phụ trách");
    }
  };

  /**************
   * LEADER TASK
   **************/
  const expandedForemanTaskRowRender = (row) => {
    const columns = [
      {
        title: "Tên công việc",
        dataIndex: "name",
        key: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Tổ trưởng",
        dataIndex: "leaderName",
        key: "leaderName",
        sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startTime",
        key: "startTime",
        align: "center",
        render: (_, record) => {
          const formattedDate = formatDate(record.startTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.startTime, b.startTime),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endTime",
        key: "endTime",
        align: "center",
        render: (_, record) => {
          const formattedDate = formatDate(record.endTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.endTime, b.endTime),
      },
      {
        title: "Độ ưu tiên",
        dataIndex: "priority",
        key: "priority",
        defaultSortOrder: "ascend",
        // align: "center",
        width: "10%",
        render: (_, record) => {
          return <span>{record.priority}</span>;
        },
        sorter: (a, b) => a.priority - b.priority,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        render: (_, record) => {
          return (
            <span style={{ color: getTaskStatusColor(record.status), fontWeight: "bold" }}>
              {getTaskStatusName(record.status)}
            </span>
          );
        },
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        align: "center",
        render: (_, record) => {
          return (
            <Dropdown menu={{ items: getETaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    return (
      <Table
        expandable={{
          expandedRowRender: handleWorkerTaskRowRender,
          onExpand: (expandable, record) => {
            if (expandable) eTaskInfoRef.current = record;
            else eTaskInfoRef.current = null;
          },
        }}
        columns={columns}
        dataSource={row.leaderTasks}
        rowKey={(record) => record.id}
        pagination={false}
      />
    );
  };

  /**************
   * WORKER TASK
   **************/
  const handleWorkerTaskRowRender = (row) => {
    const columns = [
      {
        title: "Tên công việc",
        dataIndex: "name",
        key: "name",
        width: "15.5%",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Nhóm trưởng",
        dataIndex: "leaderName",
        key: "naleaderNameme",
        width: "15.5%",
        sorter: (a, b) => a.leaderName.localeCompare(b.leaderName),
      },
      {
        title: "Ngày bắt đầu",
        dataIndex: "startTime",
        key: "startTime",
        align: "center",
        width: "15.5%",
        render: (_, record) => {
          const formattedDate = formatDate(record.startTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.startTime, b.startTime),
      },
      {
        title: "Ngày kết thúc",
        dataIndex: "endTime",
        key: "endTime",
        align: "center",
        width: "16%",
        render: (_, record) => {
          const formattedDate = formatDate(record.endTime, "DD/MM/YYYY");
          return <span>{formattedDate}</span>;
        },
        sorter: (a, b) => dateSort(a.endTime, b.endTime),
      },
      {
        title: "Độ ưu tiên",
        dataIndex: "priority",
        key: "priority",
        defaultSortOrder: "ascend",
        // align: "center",
        width: "10.3%",
        render: (_, record) => {
          return <span>{record.priority}</span>;
        },
        sorter: (a, b) => a.priority - b.priority,
      },
      {
        title: "Trạng thái",
        dataIndex: "status",
        key: "status",
        width: "15.3%",
        render: (_, record) => {
          return (
            <span style={{ color: getTaskStatusColor(record.status), fontWeight: "bold" }}>
              {getTaskStatusName(record.status)}
            </span>
          );
        },
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: "Hành động",
        dataIndex: "action",
        key: "action",
        align: "center",
        render: (_, record) => {
          return (
            <Dropdown menu={{ items: getWTaskActionItems(record) }} arrow>
              <Button className="mx-auto flex-center" icon={<More />} />
            </Dropdown>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={row.workerTask}
        rowKey={(record) => record.id}
        pagination={false}
        showHeader={false}
      />
    );
  };

  const getWTaskActionItems = (record) => {
    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          wTaskInfoRef.current = record;
          setShowWTaskDetailModal(true);
        },
      },
      // {
      //   key: "UPDATE_ROLE",
      //   label: "Cập nhật thông tin",
      //   icon: <Edit />,
      //   onClick: () => {
      //     handleShowETaskModal(record?.id);
      //   },
      // },
      // {
      //   key: "SET_STATUS",
      //   label: isActive ? "Mở khóa" : "Khóa",
      //   danger: !isActive,
      //   icon: !isActive ? <Forbid /> : <Unlock />,
      //   onClick: () => {
      //     confirm({
      //       title: "Xoá tiến độ",
      //       content: `Chắc chắn xoá "${record.name}"?`,
      //       type: "confirm",
      //       cancelText: "Hủy",
      //       onOk: () => deleteETaskProcedure(record.id),
      //       onCancel: () => { },
      //       closable: true,
      //     });
      //   },
      // },
    ];
  };

  const onExpand = (expanded, record) => {
    if (expanded) {
      orderDetailRef.current = record;
    } else {
      orderDetailRef.current = null;
    }
  };

  const syncPrice = async () => {
    setLoading(true);
    let success = await OrderApi.syncItems(details?.id);
    if (success) {
      success = await getDetails();
      message.success("Cập nhật giá thành công");
      setLoading(false);
    } else {
      message.success("Cập nhật giá thất bại");
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1 + (currentPage - 1) * PageSize.ORDER_LIST}</span>;
      },
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "itemName",
      key: "itemName",
      width: "18%",
      render: (_, record) => <span>{record?.itemName}</span>,
      sorter: (a, b) => a?.itemName.localeCompare(b?.itemName),
    },

    {
      title: "Dài",
      dataIndex: "itemLength",
      key: "itemLength",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemLength || "-"}</span>;
      },
      sorter: (a, b) => a?.itemLength.localeCompare(b?.itemLength),
    },

    {
      title: "Sâu",
      dataIndex: "itemDepth",
      key: "itemDepth",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemDepth || "-"}</span>;
      },
      sorter: (a, b) => a?.itemDepth.localeCompare(b?.itemDepth),
    },
    {
      title: "Cao",
      dataIndex: "itemHeight",
      key: "itemHeight",
      width: "5%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemHeight || "-"}</span>;
      },
      sorter: (a, b) => a?.itemHeight.localeCompare(b?.itemHeight),
    },
    {
      title: "Đơn vị",
      dataIndex: "itemUnit",
      key: "itemUnit",
      width: "7%",
      align: "center",
      render: (_, record) => {
        return <span>{record?.itemUnit || "-"}</span>;
      },
      sorter: (a, b) => a?.itemUnit.localeCompare(b?.itemUnit),
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
      sorter: (a, b) => a?.quantity.localeCompare(b?.quantity),
    },
    {
      title: "Đơn giá",
      dataIndex: "price",
      key: "price",
      align: "center",
      render: (price) => {
        const money = formatNum(price);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a?.price.localeCompare(b?.price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (totalPrice) => {
        const money = formatNum(totalPrice);
        return `${formatMoney(money)}`;
      },
      sorter: (a, b) => a?.totalPrice.localeCompare(b?.totalPrice),
    },
    {
      title: "Ghi chú",
      dataIndex: "description",
      key: "description",
      width: "30%",
      // sorter: (a, b) => a?.description.localeCompare(b?.description),
    },
    {
      title: "Hành động",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const getActionItems = (record) => {
    const { id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          eTaskInfoRef.current = record;
          navigate(
            routes.dashboard.taskOrderDetails + "/" + id,
            {
              state: {
                orderId: info?.id,
              },
            },
            { replace: true }
          );
        },
      },
      {
        key: "UPDATE_ORDER",
        label: "Cập nhật sản phẩm",
        icon: <Edit />,
        onClick: () => {
          console.log(record);
          itemRef.current = record;
          setShowItemModal(true);
        },
      },
      {
        key: "CANCEL_ORDER",
        label: "Hủy sản phẩm",
        danger: true,
        icon: <Error />,
        onClick: async () => {
          if (window.confirm("Bạn chắc chắn muốn xoá?")) {
            let success = await OrderDetailApi.deleteOrderDetail(record.id);
            if (success) {
              message.success(`Hủy sản phẩm thành công!`);
            } else {
              message.error(`Huỷ sản phẩm thất bại! Vui lòng thử lại sau.`);
            }
            handleSearch();
          }
        },
      },
    ];
  };

  const handleSearch = async (value) => {
    getDetails(value, 1, true);
  };

  const handleSubmitETaskUpdate = async (values) => {
    setETaskUpdateLoading(true);
    const data = {
      id: values?.id,
      name: values?.name,
      leaderId: values?.leaderId,
      priority: values?.priority,
      itemQuantity: values?.itemQuantity,
      startTime: values.dates?.[0],
      endTime: values.dates?.[1],
      description: values?.description,
      status: values?.status,
    };
    try {
      console.log("update task: ", data);
      const update = await LeaderTasksApi.updateLeaderTasks(data);
      if (update.code === 0) {
        message.success(update.message);
        setShowETaskUpdateModal(false);
        reload(false);
      } else {
        message.error(update.message);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setETaskUpdateLoading(false);
    }
  };

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
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getDetails(null, current, false);
  };

  useEffect(() => {
    getDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <BasePageContent onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.orders}`)}>
      <Spin spinning={loading}>
        <OrderDetailsProvider
          details={details}
          list={itemList?.data}
          users={users}
          reload={() => getDetails()}
        >
          <section className="mt-4">
            <OrderDetail />
          </section>
          <section className="mt-4">
            <Space className="w-full flex justify-between mb-6">
              <div></div>
              <div className="flex gap-3">
                {/* <Button
                  type="primary"
                  className="btn-primary app-bg-primary font-semibold text-white"
                  onClick={() => setShowOrderReportModal(true)}
                >
                  Báo cáo tiến độ đơn hàng
                </Button> */}
                <Button
                  type="primary"
                  className="btn-primary app-bg-primary font-semibold text-white"
                  onClick={() => {
                    orderRef.current = details;
                    setUpdateModal(true);
                  }}
                >
                  Cập nhật trạng thái đơn hàng
                </Button>
                <Button
                  type="primary"
                  className="btn-primary app-bg-primary font-semibold text-white"
                  onClick={syncPrice}
                >
                  Đồng bộ sản phẩm
                </Button>
                <Button
                  type="primary"
                  className="btn-primary app-bg-primary font-semibold text-white"
                  onClick={() => setShowItemModal(true)}
                >
                  Thêm sản phẩm
                </Button>
              </div>
            </Space>
            <BaseTable
              title="Danh sách sản phẩm"
              dataSource={itemList?.data}
              columns={columns}
              loading={loading}
              pagination={{
                onChange: onPageChange,
                pageSize: PageSize.ORDER_LIST,
                total: itemList?.total,
              }}
              rowKey={(record) => record.id}
              searchOptions={{
                visible: true,
                placeholder: "Tìm kiếm sản phẩm...",
                onSearch: handleSearch,
                width: 300,
              }}
              expandable={{
                expandedRowRender: expandedForemanTaskRowRender,
                onExpand: onExpand,
              }}
            />
            <LeaderTaskOrderReportModal
              open={showOrderReportModal}
              onCancel={() => {
                setShowOrderReportModal(false);
              }}
              onSubmit={handleSubmitOrderReport}
              confirmLoading={orderReportLoading}
              message={message}
              title="Báo cáo tiến độ"
            />
            <ItemOrderModal
              orderId={details?.id}
              data={itemRef.current}
              listItem={
                listItemSelect?.map((i) => {
                  return {
                    label: i.name,
                    value: i.id,
                  };
                }) || []
              }
              open={showItemModal}
              onCancel={() => setShowItemModal(false)}
              onSuccess={() => getDetails()}
            />
          </section>
          <LeaderTaskModal
            open={showETaskCreateModal}
            onCancel={() => {
              eTaskInfoRef.current = null;
              setShowETaskCreateModal(false);
            }}
            onSubmit={handleSubmitETaskCreate}
            confirmLoading={eTaskCreateLoading}
            dataSource={[]}
            mode={modalModes.CREATE}
            leadersData={leadersData}
          />
          <LeaderTaskModal
            open={showETaskUpdateModal}
            onCancel={() => {
              eTaskInfoRef.current = null;
              setShowETaskUpdateModal(false);
            }}
            onSubmit={handleSubmitETaskUpdate}
            confirmLoading={eTaskUpdateLoading}
            dataSource={eTaskInfoRef.current}
            mode={modalModes.UPDATE}
            message={message}
            leadersData={leadersData}
          />
          <TaskDetailModal
            open={showWTaskDetailModal}
            onCancel={() => setShowWTaskDetailModal(false)}
            onSubmit={handleSubmitWTaskUpdate}
            confirmLoading={wTaskDetailLoading}
            task={wTaskInfoRef.current}
            team={workers}
          />
          <UpdateStatus
            data={orderRef.current}
            open={updateModal}
            onCancel={() => {
              setUpdateModal(false);
              orderRef.current = null;
            }}
            onSuccess={() => window.location.reload()}
          />
        </OrderDetailsProvider>
      </Spin>
    </BasePageContent>
  );
};

export default OrderDetailPage;

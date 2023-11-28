import { Edit, Forbid, More, PreviewOpen, Unlock } from "@icon-park/react";
import { Button, Dropdown, Space } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { enumTaskStatuses, mockTasks } from "../../../../../__mocks__/jama/tasks";
import { message } from "antd/lib";
import dayjs from "dayjs";
import confirm from "antd/es/modal/confirm";
import ManagerTaskApi from "../../../../../apis/leader-task";
import { BaseTable } from "../../../../../components/BaseTable";
import { useNavigate, useParams } from "react-router-dom";
import { UserContext } from "../../../../../providers/user";
import OrderApi from "../../../../../apis/order";
import { orderColors, orderLabels } from "../../../../../constants/enum";
import { dateSort, formatMoney, formatNum } from "../../../../../utils";

const LeaderTaskList = () => {
  const { user } = useContext(UserContext);
  const [loading, setLoading] = useState(false);
  const [orderList, setOrderList] = useState([]);
  const navigate = useNavigate();
  const userRef = useRef();

  const getData = async (keyword) => {
    setLoading(true);
    const data = await OrderApi.getByForemanId(user?.id, keyword);
    console.log(data)
    setOrderList(data.data);
    setLoading(false);
  };

  const deleteTaskCategory = async (value) => {
    setLoading(true);
    const success = await ManagerTaskApi.deleteTaskCategory(value);
    if (success) {
      message.success("Xoá thành công");
    } else {
      message.error("Xoá thất bại");
    }
    getData();
    setLoading(false);
  };

  useEffect(() => {
    getData();
  }, []);


  const getActionItems = (record) => {
    const { isActive, id } = record;

    return [
      {
        key: "VIEW_DETAIL",
        label: "Xem thông tin chi tiết",
        icon: <PreviewOpen />,
        onClick: () => {
          userRef.current = record;
          navigate(record?.id)
        },
      },
    ];
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1}</span>;
      },
    },
    {
      title: "Tên đơn hàng",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Khách hàng",
      dataIndex: "customerName",
      key: "customerName",
      sorter: (a, b) => a.customerName.localeCompare(b.customerName),
    },
    {
      title: "Báo giá xưởng",
      dataIndex: "totalPrice",
      key: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
      render: (totalPrice) => {
        const price = formatNum(totalPrice);
        return `${formatMoney(price)}`;
      },
    },
    {
      title: "Ngày tạo đơn",
      dataIndex: "orderDate",
      key: "orderDate",
      render: (_, { orderDate }) => <span>{dayjs(orderDate).format("DD/MM/YYYY")}</span>,
      sorter: (a, b) => dateSort(a.orderDate, b.orderDate),
    },
    {
      title: "Ngày nghiệm thu",
      dataIndex: "acceptanceDate",
      key: "acceptanceDate",
      render: (_, { acceptanceDate }) =>
        acceptanceDate ? <span>{dayjs(acceptanceDate).format("DD/MM/YYYY")}</span> : <></>,
      sorter: (a, b) => dateSort(a?.acceptanceDate, b?.acceptanceDate),
    },
    {
      title: "Tình trạng",
      dataIndex: "status",
      key: "status",
      render: (_, { status }) => (
        <span style={{ color: orderColors[status], fontWeight: "bold" }}>
          {orderLabels[status]}
        </span>
      ),
      sorter: (a, b) => a.status - b.status,
    },
    {
      title: "Thao tác",
      dataIndex: "action",
      key: "action",
      align: "center",
      render: (_, record) => {
        return (
          <Dropdown menu={{ items: getActionItems(record) }}>
            <Button className="mx-auto flex-center" icon={<More />} />
          </Dropdown>
        );
      },
    },
  ];

  const handleSearch = (value) => {
    getData(value);
  };

  return (
    <>
      <BaseTable
        title="Danh sách công việc"
        dataSource={orderList}
        columns={columns}
        loading={loading}
        pagination={true}
        rowKey={(record) => record.id}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </>
  );
};

export default LeaderTaskList;

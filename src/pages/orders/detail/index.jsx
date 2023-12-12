import { BasePageContent } from "../../../layouts/containers/BasePageContent";
import { OrderDetailsProvider } from "../../../providers/orderDetails";
import OrderDetailApi from "../../../apis/order-details";
import { OrderDetail } from "./components/OrderDetail";
import React, { useEffect, useRef, useState } from "react";
import OrderApi from "../../../apis/order";
import { useParams } from "react-router";
import { Button, Dropdown, Space, Spin, Typography, message } from "antd";
import UserApi from "../../../apis/user";
import { BaseTable } from "../../../components/BaseTable";
import { Edit, Error, More } from "@icon-park/react";
import routes from "../../../constants/routes";
import { useNavigate } from "react-router-dom";
import { ItemOrderModal } from "./components/ItemOrderModal";
import ItemApi from "../../../apis/item";
import { UpdateStatus } from "../components/UpdateStatus";
import { PageSize } from "../../../constants/enum";

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

  const itemRef = useRef();
  const orderRef = useRef();

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
      width: "25%",
      render: (_, record) => <span>{record?.itemName}</span>,
      sorter: (a, b) => a?.itemName.localeCompare(b?.itemName),
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
      sorter: (a, b) => a?.price.localeCompare(b?.price),
    },
    {
      title: "Thành tiền",
      dataIndex: "totalPrice",
      key: "totalPrice",
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
    return [
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
          let success = await OrderDetailApi.deleteOrderDetail(record.id);
          if (success) {
            message.success(`Hủy sản phẩm thành công!`);
          } else {
            message.error(`Huỷ sản phẩm thất bại! Vui lòng thử lại sau.`);
          }
          handleSearch();
        },
      },
    ];
  };

  const handleSearch = async (value) => {
    getDetails(value, 1, true);
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
                  Cập nhật giá
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
              searchOptions={{
                visible: true,
                placeholder: "Tìm kiếm sản phẩm...",
                onSearch: handleSearch,
                width: 300,
              }}
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

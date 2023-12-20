import React, { useEffect, useRef, useState } from "react";
import {
  Card,
  Col,
  Row,
  Typography,
  message,
} from "antd";
import dayjs from "dayjs";
import { PageSize, orderColors, orderLabels } from "../../../../constants/enum";
import { dateSort, formatDate } from "../../../../utils";
import { useNavigate, useParams } from "react-router-dom";
import WorkerTasksApi from "../../../../apis/worker-task";
import UserApi from "../../../../apis/user";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";
import { BaseTable } from "../../../../components/BaseTable";
import routes from "../../../../constants/routes";

export const DetailListModal = ({}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [workerDetail, setWorkerDetail] = useState([]);
  const [workerInf, setWorkerInf] = useState([]);
  const navigate = useNavigate();
  const { Title } = Typography;
  const { id } = useParams();

  const getData = async (search, pageIndex, handleLoading) => {
    if (handleLoading) {
      setLoading(true);
    }
    const datas = await WorkerTasksApi.getByUserId(id, search, pageIndex, PageSize.WORKERS_LIST);
    console.log(datas.data);
    setWorkerDetail(datas.data);
    setLoading(false);
  };
  const getUser = async () => {
    setLoading(true);
    const datas = await UserApi.getUserById(id);
    console.log(datas);
    setWorkerInf(datas);
    setLoading(false);
  };
  console.log("DATA", workerInf);

  useEffect(() => {
    getData();
    getUser();
  }, []);

  const defaultValue = (value) => {
    return <Title style={{ color: "red" }}>{value}</Title>;
  };

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1 + (currentPage - 1) * PageSize.GROUP_LIST}</span>;
      },
    },
    {
      title: "Tên công việc",
      dataIndex: "name",
      key: "name",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.name}
          </span>
        );
      },
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Độ ưu tiên",
      dataIndex: "priority",
      key: "priority",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.priority}
          </span>
        );
      },
      sorter: (a, b) => a.priority - (b.priority),
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startTime",
      key: "startTime",
      render: (_, { startTime }) =>
        startTime ? <span>{dayjs(startTime).format("DD/MM/YYYY")}</span> : <span>-</span>,

      sorter: (a, b) => dateSort(a.startTime, b.startTime),
    },
    {
      title: "Thời gian kết thúc",
      dataIndex: "endTime",
      key: "endTime",
      render: (_, { endTime }) =>
        endTime ? <span>{dayjs(endTime).format("DD/MM/YYYY")}</span> : <span>-</span>,

      sorter: (a, b) => dateSort(a.endTime, b.endTime),
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
  ];

  const handleSearch = (value) => {
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
  };

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.groups}/${workerInf?.groupId}`)}
    >
      <Row justify="middle">
        <Col span={8}>
          <Title level={4} style={{ margin: 0 }} ellipsis>
            Thông tin công nhân
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ borderRadius: "1rem" }}>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={8}>
                Tên công nhân: <strong>{workerInf?.fullName}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Địa chỉ: <strong>{workerInf?.address}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Ngày sinh: <strong>
                  {formatDate(workerInf?.dob, "DD/MM/YYYY") || "Chưa thêm ngày"}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Số điện thoại: <strong>{workerInf?.userName}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Email: <strong>{workerInf?.email}</strong>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <BaseTable
        title={"Thông tin công việc"}
        loading={loading}
        dataSource={workerDetail?.data}
        columns={columns}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.WORKERS_LIST,
          total: workerDetail?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm công việc...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </BasePageContent>
  );
};

import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { PageSize } from "../../../../constants/enum";
import { dateSort, formatDate } from "../../../../utils";
import { BaseTable } from "../../../../components/BaseTable";
import MaterialApi from "../../../../apis/material";
import routes from "../../../../constants/routes";
import { BasePageContent } from "../../../../layouts/containers/BasePageContent";

const MaterialLogModal = () => {
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [logList, setLogList] = useState([]);
  const navigate = useNavigate();

  const getData = async (search, pageIndex, handleLoading = true) => {
    if (handleLoading) {
      setLoading(true);
    }
    const response = await MaterialApi.getAllLogOnMaterial(
      search,
      pageIndex,
      PageSize.LOG_MATERIAL_LIST
    );
    setLogList(response);
    console.log(response);
    setLoading(false);
  };

  const handleSearch = (value) => {
    getData(value, 1, true);
  };

  const onPageChange = (current) => {
    setCurrentPage(current);
    getData(null, current, false);
  };

  useEffect(() => {
    if ((null, 1, true)) {
      getData(null, 1, true);
    }
  }, []);

  const columns = [
    {
      title: "#",
      dataIndex: "index",
      key: "index",
      width: "5%",
      // align: "center",
      render: (_, record, index) => {
        return <span>{index + 1 + (currentPage - 1) * PageSize.LOG_MATERIAL_LIST}</span>;
      },
    },
    {
      title: "Tên nguyên vật liệu",
      dataIndex: "materialName",
      key: "materialName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              //   showModal(record)
            }}
          >
            {record.materialName}
          </span>
        );
      },
      sorter: (a, b) => a.materialName.localeCompare(b.materialName),
    },
    {
      title: "Người chỉnh sửa",
      dataIndex: "userName",
      key: "userName",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              //   showModal(record)
            }}
          >
            {record.userName}
          </span>
        );
      },
      sorter: (a, b) => a.userName.localeCompare(b.userName),
    },
    {
      title: "Ngày chỉnh sửa",
      dataIndex: "modifiedTime",
      key: "modifiedTime",
      width: "15%",
      render: (_, record) => {
        const formattedDate = formatDate(record.modifiedTime, "DD/MM/YYYY - HH:MM:SS");
        return <span>{formattedDate}</span>;
      },
      sorter: (a, b) => dateSort(a.modifiedTime, b.modifiedTime),
    },
    {
      title: "Nội dung",
      dataIndex: "action",
      key: "action",
      render: (_, record) => {
        return (
          <span
            onClick={() => {
              /*showModal(record) */
            }}
          >
            {record.action}
          </span>
        );
      },
      sorter: (a, b) => a.action - b.action,
    },
  ];

  return (
    <BasePageContent
      onBack={() => navigate(`${routes.dashboard.root}/${routes.dashboard.materials}`)}
    >
      <BaseTable
        title="Lịch sử chỉnh sửa"
        dataSource={logList?.data}
        columns={columns}
        loading={loading}
        pagination={{
          onChange: onPageChange,
          pageSize: PageSize.LOG_MATERIAL_LIST,
          total: logList?.total,
        }}
        searchOptions={{
          visible: true,
          placeholder: "Tìm kiếm nhóm...",
          onSearch: handleSearch,
          width: 300,
        }}
      />
    </BasePageContent>
  );
};

export default MaterialLogModal;

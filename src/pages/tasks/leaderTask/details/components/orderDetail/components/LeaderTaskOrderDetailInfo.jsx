import { Typography, Col, Row, Space, Card, Button, Image, Collapse } from "antd";
import React, { useContext, useRef } from "react";
import { formatMoney, handleDownloadFile } from "../../../../../../../utils";
import { ErrorImage } from "../../../../../../../constants/enum";
import { TaskContext } from "../../../../../../../providers/task";
import { DownloadOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const LeaderTaskOrderDetailInfo = ({ loading }) => {
  const { Title } = Typography;

  const { info, materials } = useContext(TaskContext);

  const { itemName, itemCode, itemImage, itemLength, itemDepth, itemHeight, itemUnit, itemDrawingsTechnical, itemDrawings2D, itemDrawings3D, quantity, price, totalPrice } = info || [];

  const defaultValue = (value) => {
    return <Text style={{ color: "red" }}>{value}</Text>;
  };

  return (
    <Space direction="vertical" className="w-full gap-6">
      <Row justify="middle">
        <Col span={8}>
          <Title level={4} style={{ margin: 0 }} ellipsis>
            Chi tiết đơn hàng {itemName}
          </Title>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card style={{ borderRadius: "1rem" }} loading={loading || !info}>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={8}>
                Tên sản phẩm: <strong>{itemName}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Mã sản phẩm:{" "}
                <strong>{itemCode || defaultValue("Không xác định được mã sản phẩm")}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Hình ảnh:{" "}
                <Image src={itemImage} fallback={ErrorImage} width="10%" />
              </Col>
              <Col className="gutter-row" span={8}>
                Chiều dài:{" "}
                <strong>{`${itemLength || 0} ${itemUnit || ""}`}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Chiều cao:{" "}
                <strong>{`${itemDepth || 0} ${itemUnit || ""}`}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Chiều rộng:{" "}
                <strong>{`${itemHeight || 0} ${itemUnit || ""}`}</strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Số lượng:{" "}
                <strong>
                  {formatMoney(quantity) || defaultValue("Chưa thêm số lượng")}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Đơn giá:{" "}
                <strong>
                  {formatMoney(price) || defaultValue("Chưa thêm đơn giá")}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Thành tiền:{" "}
                <strong>
                  {formatMoney(totalPrice) || defaultValue("Chưa thêm thành tiền")}
                </strong>
              </Col>
              <Col className="gutter-row" span={8}>
                Bản vẽ 2D:{" "}
                <Button
                  disabled={!itemDrawings2D}
                  icon={<DownloadOutlined />}
                  onClick={(e) => handleDownloadFile(itemDrawings2D, "drawings2D")
                  }>
                  Tải bản vẽ
                </Button>
              </Col>
              <Col className="gutter-row" span={8}>
                Bản vẽ 3D:{" "}
                <Button
                  disabled={!itemDrawings3D}
                  icon={<DownloadOutlined />}
                  onClick={(e) => handleDownloadFile(itemDrawings3D, "drawings3D")
                  }>
                  Tải bản vẽ
                </Button>
              </Col>
              <Col className="gutter-row" span={8}>
                Bản vẽ kĩ thuật:{" "}
                <Button
                  disabled={!itemDrawingsTechnical}
                  icon={<DownloadOutlined />}
                  onClick={(e) => handleDownloadFile(itemDrawingsTechnical, "drawingsTechnical")
                  }>
                  Tải bản vẽ
                </Button>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col className="gutter-row" span={24}>
                <Collapse
                  ghost
                  items={[
                    {
                      label: `Danh sách vật liệu (${materials?.total ?? 0})`,
                      children: (
                        <Row gutter={[16, 16]}>
                          {materials?.data?.map((item, index) => (
                            <Col className="gutter-row" span={24} key={item.materialId}>
                              {index + 1}. {item.materialName}
                            </Col>
                          ))}
                        </Row>
                      ),
                    },
                  ]}
                />
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Space>
  );
};

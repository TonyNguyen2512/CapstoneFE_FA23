import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { User } from "@icon-park/react";
import { Button, Col, Form, Row, Select, Typography, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import BaseModal from "../../../../components/BaseModal";
import { UserContext } from "../../../../providers/user";
import GroupApi from "../../../../apis/group";
import { DragDropContext } from "react-beautiful-dnd";

const { Text } = Typography;

export const AddStepToProcedureModal = ({
  title,
  open,
  onCancel,
  onSubmit,
  confirmLoading,
  group,
  workers,
}) => {
  const WORKERS_KEY = "listWorker";
  const { user } = useContext(UserContext);
  const [selectedWorkerIds, setSelectedWorkerIds] = useState([user?.id]);

  const formRef = useRef();

  const onFinish = async (values) => {
    await onSubmit({ ...values, groupId: group });
  };

  const getWorkerOptions = (workerId) => {
    const workerNotInGroupOptions = workers?.map((e) => {
      return {
        value: e.id,
        label: e.fullName,
      };
    });

    const filteredOptions = workerNotInGroupOptions.filter((e) => {
      const { value } = e;
      if (selectedWorkerIds.includes(value) && value !== workerId) {
        return false;
      }
      return true;
    });
    return filteredOptions;
  };

  const onDragEnd = (result) => {
    console.log("onDragEnd");
    console.log(result);

    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    var canDrop = true;
    const taskId = draggableId;
    const task = tasks?.find((e) => e.id === taskId);
    const ownedTask = task?.members.find((e) => e.id === user?.id) !== undefined;

    if (!isLeader && !ownedTask) {
      canDrop = false;
    }

    if (!canDrop) {
      message.info(
        "Chỉ trưởng nhóm hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
      );
      return;
    }

    const finish = columns.find((e) => e.id === destination.droppableId);

    if (!isLeader) {
      if (finish.id === TaskColumnId.IN_APPROVE || finish.id === TaskColumnId.COMPLETED) {
        message.info("Chỉ trưởng nhóm mới được chuyển trạng thái công việc này");
        return;
      }
    }
  };

  return (
    <BaseModal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={() => formRef.current.submit()}
      confirmLoading={confirmLoading}
    >
      <Form
        ref={formRef}
        layout="vertical"
        onFinish={onFinish}
        initialValues={
          {
            // listWorker: [user?.id],
          }
        }
        onValuesChange={(_, values) => {
          const selectedWorkers = values.listWorker.filter((e) => e);
          setSelectedWorkerIds(selectedWorkers);
        }}
      >
        <Text strong style={{ fontSize: 16 }}>
          Thêm công nhân
        </Text>
        <div className="mb-2"></div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Form.List name={WORKERS_KEY}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  const workerId =
                    index === -1 ? user?.id : formRef.current?.getFieldValue(WORKERS_KEY)[index];
                  return (
                    <Row key={field.key} align="middle" gutter={4}>
                      <Col span={22}>
                        <Form.Item
                          {...field}
                          label={
                            <div>
                              <span>Thành viên {index + 1}</span>
                            </div>
                          }
                          className="fullName"
                          key={`member-${index}`}
                          rules={[
                            {
                              required: true,
                              message: "Vui lòng chọn công nhân",
                            },
                          ]}
                        >
                          <Select
                            placeholder="Chọn công nhân"
                            options={getWorkerOptions(workerId)}
                            optionFilterProp="children"
                            allowClear
                            suffixIcon={<User />}
                          />
                        </Form.Item>
                      </Col>
                      <Col>
                        {fields.length >= 0 && index >= 0 && (
                          <Button
                            className="flex-center mt-1"
                            type="text"
                            danger
                            icon={<MinusCircleOutlined />}
                            onClick={() => remove(field.name)}
                          />
                        )}
                      </Col>
                    </Row>
                  );
                })}
                {
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => {
                        add();
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Thêm thành viên
                    </Button>
                  </Form.Item>
                }
              </>
            )}
          </Form.List>
        </DragDropContext>
      </Form>
    </BaseModal>
  );
};

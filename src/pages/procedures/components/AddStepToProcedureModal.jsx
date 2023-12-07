import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { User } from "@icon-park/react";
import { Button, Card, Col, Form, Row, Select, Typography, message } from "antd";
import React, { useContext, useEffect, useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { UserContext } from "../../../providers/user";
import BaseModal from "../../../components/BaseModal";

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
    // console.log("onDragEnd");
    // console.log(result);
    // const { destination, source, draggableId } = result;
    // if (!destination) {
    //   return;
    // }
    // if (destination.droppableId === source.droppableId && destination.index === source.index) {
    //   return;
    // }
    // var canDrop = true;
    // const taskId = draggableId;
    // // const task = tasks?.find((e) => e.id === taskId);
    // const ownedTask = task?.members.find((e) => e.id === user?.id) !== undefined;
    // if (!isLeader && !ownedTask) {
    //   canDrop = false;
    // }
    // if (!canDrop) {
    //   message.info(
    //     "Chỉ tổ trưởng hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
    //   );
    //   return;
    // }
    // const finish = columns.find((e) => e.id === destination.droppableId);
    // if (!isLeader) {
    //   if (finish.id === TaskColumnId.IN_APPROVE || finish.id === TaskColumnId.COMPLETED) {
    //     message.info("Chỉ tổ trưởng mới được chuyển trạng thái công việc này");
    //     return;
    //   }
    // }
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
          a
        </Text>
        <div className="mb-2"></div>
        <DragDropContext onDragEnd={onDragEnd}>
          {/* <Form.List name={"A"}> */}
          <Droppable droppableId={"a"}>
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps}>
                {[
                  { key: 1, a: "abc", b: "ABC" },
                  { key: 2, a: "809", b: "ABC" },
                ]?.map((task, index) => (
                  <Draggable key={`abc${task.key}`} draggableId={`ab${task.key}`} index={index}>
                    {(provided) => (
                      <Card
                        hoverable={true}
                        className="mb-2"
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        title={"ABC"}
                        headStyle={{ fontSize: "small" }}
                      >
                        <div>{task.a}</div>
                      </Card>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          {/* </Form.List> */}
        </DragDropContext>
      </Form>
    </BaseModal>
  );
};

{
  /* <Droppable droppableId={1}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, index) => {
                        const workerId =
                          index === -1
                            ? user?.id
                            : formRef.current?.getFieldValue(WORKERS_KEY)[index];
                        return (
                          <Row key={field.key} align="middle" gutter={4}>
                            <Draggable key={index} draggableId={index} index={index}>
                              {(provided1) => (
                                <Card
                                  // hoverable={isCompleted ? false : true}
                                  className="mb-2"
                                  {...provided1.draggableProps}
                                  {...provided1.dragHandleProps}
                                  ref={provided1.innerRef}
                                  title={"ABC"}
                                  headStyle={{ fontSize: "small" }}
                                >
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
                                </Card>
                              )}
                            </Draggable>
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

                  {provided.placeholder}
                </div>
              )}
            </Droppable> */
}

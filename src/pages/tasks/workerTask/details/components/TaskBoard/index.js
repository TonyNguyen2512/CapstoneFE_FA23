import React, { useContext, useEffect, useRef, useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { TaskColumn } from "./TaskColumn";
import { Col, Row, message } from "antd";
import { TaskColumnId, roles } from "../../../../../../constants/app";
import { ETaskStatus, TaskStatus } from "../../../../../../constants/enum";
import { UserContext } from "../../../../../../providers/user";
import WorkerTasksApi from "../../../../../../apis/worker-task";
import { TaskContext } from "../../../../../../providers/task";

export const TaskBoard = ({ onViewTask, onDeleteTask, onChatTask }) => {
  const { user } = useContext(UserContext);
  const { tasks, reload } = useContext(TaskContext);

  const isLeader = user?.role?.name === roles.LEADER || user?.role?.name === roles.FOREMAN;

  const [columns, setColumns] = useState([
    {
      id: TaskColumnId.TODO,
      title: "Cần làm",
      tasks: [],
    },
    {
      id: TaskColumnId.IN_PROGRESS,
      title: "Trong tiến độ",
      tasks: [],
    },
    {
      id: TaskColumnId.IN_APPROVE,
      title: "Chờ duyệt",
      tasks: [],
    },
    {
      id: TaskColumnId.COMPLETED,
      title: "Đã hoàn thành",
      tasks: [],
    },
  ]);

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
    const task = tasks?.data?.find((e) => e.id === taskId);
    const ownedTask = task?.members.find((e) => e.id === user?.id) !== undefined;

    if (!isLeader && !ownedTask) {
      canDrop = false;
    }

    if (!canDrop) {
      message.info(
        "Chỉ tổ trưởng hoặc những thành viên được phân công mới được chuyển trạng thái công việc này"
      );
      return;
    }

    const finish = columns.find((e) => e.id === destination.droppableId);

    if (!isLeader) {
      if (finish.id === TaskColumnId.IN_APPROVE || finish.id === TaskColumnId.COMPLETED) {
        message.info("Chỉ tổ trưởng mới được chuyển trạng thái công việc này");
        return;
      }
    }

    // TODO
    // const sourceTask = columns.find((e) => e.id === source.droppableId);
    // if (sourceTask.id === TaskColumnId.COMPLETED) {
    // 	message.error(
    // 		"Không thể chuyển trạng thái công việc đã hoàn thành"
    // 	);
    // 	return;
    // }

    let taskStatus;
    switch (finish.id) {
      case TaskColumnId.TODO:
        taskStatus = TaskStatus.New;
        break;
      case TaskColumnId.IN_PROGRESS:
        taskStatus = TaskStatus.InProgress;
        break;
      case TaskColumnId.IN_APPROVE:
        taskStatus = TaskStatus.Pending;
        break;
      case TaskColumnId.COMPLETED:
        taskStatus = TaskStatus.Completed;
        break;
      default:
        taskStatus = TaskStatus.New;
        break;
    }

    if (taskId !== undefined && taskStatus !== undefined) {
      console.log("drag drop", taskId, taskStatus);
      WorkerTasksApi.updateWorkerTasksStatus(taskId, taskStatus).then((success) => {
        if (success?.code === 0) {
          console.log("success");
          reload(false);
        } else {
          message?.error(success?.message);
        }
      });
    }
  };

  function loadColumn(allTasks) {
    const todoTasks = allTasks?.filter((e) => e.status === TaskStatus.New);
    const inProgressTasks = allTasks?.filter((e) => e.status === TaskStatus.InProgress);
    const inApproveTasks = allTasks?.filter((e) => e.status === TaskStatus.Pending);
    const completedTasks = allTasks?.filter((e) => e.status === TaskStatus.Completed);
    const newColumns = [...columns];
    for (let i = 0; i < newColumns.length; i++) {
      const column = newColumns[i];
      if (column.id === TaskColumnId.TODO) {
        column.tasks = todoTasks || [];
      }
      if (column.id === TaskColumnId.IN_PROGRESS) {
        column.tasks = inProgressTasks || [];
      }
      if (column.id === TaskColumnId.IN_APPROVE) {
        column.tasks = inApproveTasks || [];
      }
      if (column.id === TaskColumnId.COMPLETED) {
        column.tasks = completedTasks || [];
      }
    }
    setColumns(newColumns);
  }

  useEffect(() => {
    loadColumn(tasks?.data);
  }, [tasks]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Row gutter={16}>
        {columns.map((column) => (
          <Col key={column.id} span={6}>
            <TaskColumn column={column} onViewTask={onViewTask} onChatTask={onChatTask} onDeleteTask={onDeleteTask} />
          </Col>
        ))}
      </Row>
    </DragDropContext>
  );
};
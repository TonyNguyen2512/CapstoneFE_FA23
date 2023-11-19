import { Card, Empty, Typography } from "antd";
import React, { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { TaskItem } from "./TaskItem";

const { Text } = Typography;

export const TaskColumn = ({ column, onViewTask, onDeleteTask, avatar }) => {
	const { id, title, tasks } = column;
	return (
		<Card title={title}>
			<Droppable droppableId={id}>
				{(provided) => (
					<div ref={provided.innerRef} {...provided.droppableProps}>
						{tasks?.map((task, index) => (
							<TaskItem
								key={task.id}
								task={task}
								index={index}
								onDelete={onDeleteTask}
								onView={onViewTask}
								avatar={avatar}
							/>
						))}
						{tasks?.length <= 0 && (
							<Empty description={<Text disabled>Chưa có công việc</Text>} />
						)}
						{provided.placeholder} 
					</div>
				)}
			</Droppable>
		</Card>
	);
};

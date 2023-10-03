import React, { useState } from "react";
import { Row, Typography } from "antd";
import { TaskList } from "./TaskList";
import { Down, Up } from "@icon-park/react";

const { Title } = Typography;

export const TaskListSection = ({
	title,
	action,
	tasks,
	onTaskItemClick,
	onTaskItemDelete,
	onAssignMember,
	onUnAssignMember,
}) => {
	const [expanded, setExpanded] = useState(true);

	return (
		<div>
			<Row className="cursor-pointer" justify="space-between">
				<Row align="middle" onClick={() => setExpanded(!expanded)}>
					<Title style={{ margin: 0 }} level={5}>
						{title} ({tasks.length})
					</Title>

					<span className="ml-2">{!expanded ? <Down /> : <Up />}</span>
				</Row>
				{action}
			</Row>
			{expanded && (
				<TaskList
					tasks={tasks}
					onItemClick={onTaskItemClick}
					onItemDelete={onTaskItemDelete}
					onAssignMember={onAssignMember}
					onUnAssignMember={onUnAssignMember}
				/>
			)}
		</div>
	);
};

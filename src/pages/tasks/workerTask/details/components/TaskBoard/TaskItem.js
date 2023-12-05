import { Delete, More, PreviewOpen } from "@icon-park/react";
import {
	Avatar,
	Button,
	Card,
	Col,
	Dropdown,
	Row,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import React, { useContext } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TextTile } from "../../../../../../components/TextTile";
import { formatDate } from "../../../../../../utils";
import moment, { now } from "moment";
import { UserContext } from "../../../../../../providers/user";
import { TaskStatus, eTaskStatus } from "../../../../../../constants/enum";
import { attitudeTaskOptions, qualityTaskOptions } from "../../../../../../constants/app";
import { TaskContext } from "../../../../../../providers/task";
import { WechatOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const TaskItem = ({ task, index, onView, onDelete, onChat }) => {
	const { user } = useContext(UserContext);
	const { info } = useContext(TaskContext);
	// const isLeader = user?.userId === team?.leader?.id;
	const { id, name, members, startTime, endTime, status } = task;
	const isCompleted = status === TaskStatus.completed;

	const overdue = moment(task?.endTime).isBefore(now()) && status !== TaskStatus.completed;

	const handbleDropdown = () => {
		let items = [
			{
				label: "Xem",
				icon: <PreviewOpen className="mt-1" />,
				onClick: () => onView(task),
			},
		];
		if (!isCompleted) {
			items.push(
				{
					label: "Chat",
					icon: <WechatOutlined className="mt-1" />,
					onClick: () => onChat(task),
				},
				{
					label: "Xóa",
					icon: <Delete className="mt-1" />,
					danger: true,
					onClick: () => onDelete(task),
				},
			)
		}
		return items;
	}

	return (
		<Draggable key={id} draggableId={id} index={index} isDragDisabled={isCompleted}>
			{(provided) => (
				<Card
					hoverable={isCompleted ? false : true}
					className="mb-2"
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					title={name}
					headStyle={{ fontSize: "small" }}
					extra={
						<Dropdown
							menu={{
								items: handbleDropdown(),
							}}
						>
							<Button icon={<More />} className="flex-center" />
						</Dropdown>}
				>
					<Row justify="space-between" align="top" className="mb-2">
						<Col>
							{startTime && endTime && (
								<TextTile label="Hạn công việc" colon size={13}>
									{formatDate(endTime, "DD/MM/YYYY HH:mm")}
								</TextTile>
							)}
						</Col>
					</Row>
					<Row justify="space-between" align="bottom" className="mb-2">
						<Col>
							<Avatar.Group
								shape="circle"
								maxCount={4}
								maxPopoverTrigger="click"
								maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }}
							>
								{members?.map((item) => {
									const names = item.memberFullName.split(" ");
									const lastName = names[names.length - 1];
									const isCurrentUser = user?.id === item?.memberId;
									return (
										<Tooltip
											key={id}
											title={`${item.memberFullName}${isCurrentUser ? " (Bạn)" : ""}`}
										>
											<Avatar
												key={id}
												style={{
													cursor: "text",
													backgroundColor: isCurrentUser
														? "#f56a00"
														: undefined,
													border: isCurrentUser
														? "solid 2px lightblue"
														: undefined,
												}}
											>
												{lastName.substring(0, 1).toUpperCase()}
											</Avatar>
										</Tooltip>
									);
								})}
							</Avatar.Group>
						</Col>
					</Row>
					{overdue && (
						<div>
							<Tag color="red-inverse">
								Đã quá hạn
							</Tag>
						</div>
					)}
				</Card>
			)}
		</Draggable>
	);
};

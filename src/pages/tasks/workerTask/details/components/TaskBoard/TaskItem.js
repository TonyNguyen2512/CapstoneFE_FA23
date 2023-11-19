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
import React, { useContext, useEffect, useRef, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TextTile } from "../../../../../../components/TextTile";
// import { TeamContext } from "../../../../../providers/team";
import { formatDate } from "../../../../../../utils";
import moment, { now } from "moment";
import { UserContext } from "../../../../../../providers/user";
import { TaskStatus } from "../../../../../../constants/enum";

const { Text } = Typography;

export const TaskItem = ({ task, index, onView, onDelete, avatar }) => {
	const { user } = useContext(UserContext);
	// const isLeader = user?.userId === team?.leader?.id;
	const { id, name, members, startTime, endTime, status } = task;

	const overdue = moment(task?.endTime).isBefore(now()) && status !== TaskStatus.completed;

	return (
		<Draggable key={id} draggableId={id} index={index}>
			{(provided) => (
				<Card
					hoverable
					className="mb-2"
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
					title={name}
					headStyle={{fontSize: "small"}}
					extra={
						<Dropdown
							menu={{
								items: [
									{
										label: "Xem",
										icon: <PreviewOpen className="mt-1" />,
										onClick: () => onView(task),
									},
									// isLeader && 
									{
										label: "Xóa",
										icon: <Delete className="mt-1" />,
										danger: true,
										onClick: () => onDelete(task),
									},
								],
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
									const isCurrentUser = user?.userId === item?.memberId;
									const backgroundColor = avatar?.find((e) => e.id === item?.memberId);
									console.log("item?.memberId", item?.memberId)
									console.log("avatar", avatar)
									console.log("backgroundColor", backgroundColor);
									return (
										<Tooltip
											key={item.id}
											title={`${item.memberFullName}${isCurrentUser ? " (Bạn)" : ""}`}
										>
											<Avatar
												key={item.memberId}
												style={{
													cursor: "text",
													backgroundColor: backgroundColor?.color,
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
						<Tag className="mt-4" color="red-inverse">
							Đã quá hạn
						</Tag>
					)}
				</Card>
			)}
		</Draggable>
	);
};

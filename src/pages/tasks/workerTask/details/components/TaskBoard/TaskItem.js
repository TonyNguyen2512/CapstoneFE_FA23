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
import React, { useContext, useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import { TextTile } from "../../../../../../components/TextTile";
// import { TeamContext } from "../../../../../providers/team";
import { formatDate } from "../../../../../../utils";
import moment, { now } from "moment";
import { UserContext } from "../../../../../../providers/user";

const { Text } = Typography;

export const TaskItem = ({ task, index, onView, onDelete, dataSource }) => {
	const { user } = useContext(UserContext);
	// const isLeader = user?.userId === team?.leader?.id;
	const { id, name, members, startTime, endTime } = task;

	const overdue = moment(task?.endTime).isBefore(now());

	return (
		<Draggable key={id} draggableId={id} index={index}>
			{(provided) => (
				<Card
					hoverable
					className="mb-2"
					{...provided.draggableProps}
					{...provided.dragHandleProps}
					ref={provided.innerRef}
				>
					<Row justify="end">
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
						</Dropdown>
					</Row>
					<Text>{name}</Text>
					<Row justify="space-between" align="middle">
						<Col span={20}>
							{startTime && endTime && (
								<TextTile className="mt-3" label="Đến hạn công việc" colon>
									{formatDate(endTime, "HH\\h mm - DD/MM/YYYY")}
								</TextTile>
							)}
						</Col>
						<Col span={4}>
							<Avatar.Group shape="circle">
								{members?.map((item) => {
									const names = item.fullName.split(" ");
									const lastName = names[names.length - 1];
									const isCurrentUser = user?.userId === item.id;
									return (
										<Tooltip
											key={item.id}
											title={`${item.fullName}${isCurrentUser ? " (Bạn)" : ""}`}
										>
											<Avatar
												key={item.id}
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
						<Tag className="mt-4" color="red-inverse">
							Đã quá hạn
						</Tag>
					)}
				</Card>
			)}
		</Draggable>
	);
};

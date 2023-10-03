import { ArrowRight } from "@icon-park/react";
import {
	Button,
	Card,
	Collapse,
	Descriptions,
	List,
	Tag,
	Tooltip,
	Typography,
} from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { RawHtml } from "../../../../components/RawHtml";
import { UserContext } from "../../../../providers/user";

const { Text } = Typography;

export const ProjectTeamItem = ({ team, index }) => {
	const navigate = useNavigate();

	const { user } = useContext(UserContext);
	const isLeader = user?.userId === team?.leader?.id;

	return (
		<Card
			title={`Nhóm ${index + 1}`}
			extra={
				<Button
					type="primary"
					onClick={() => {
						navigate(team.id);
					}}
					icon={<ArrowRight size={20} />}
					className="flex-center"
					size="large"
				/>
			}
		>
			<Descriptions
				items={[
					{
						label: "Nhóm trưởng",
						children: (
							<Tooltip
								title={`MSSV: ${team.leader.code} - Email: ${team.leader.email}`}
							>
								<Text className="cursor-pointer" underline>
									{team.leader.fullName}
									{isLeader && (
										<Tag className="ml-2" color="blue">
											Tôi
										</Tag>
									)}
								</Text>
							</Tooltip>
						),
					},
					{
						label: "Hướng dẫn bởi GV",
						children: team.instructor?.fullName ?? "N/A",
					},
					{
						label: "Số thành viên",
						children: team.members?.length ?? "0",
					},
				]}
			/>

			<Collapse
				ghost
				items={[
					{
						label: <Text>Thành viên khác</Text>,
						children: (
							<List
								rowKey={(member) => member.id}
								split={false}
								dataSource={team.members.filter((e) => e.id !== team.leader.id)}
								renderItem={(item) => {
									return (
										<List.Item>
											<Tooltip
												title={`MSSV: ${item.code} - Email: ${item.email}`}
											>
												<Text className="cursor-pointer" underline>
													{item.fullName}
												</Text>
											</Tooltip>
										</List.Item>
									);
								}}
							/>
						),
					},
				]}
			/>
			<Collapse
				ghost
				items={[
					{
						label: <Text>Thông tin dự án nhóm đang làm</Text>,
						children: (
							<div>
								<div>
									<Text strong>Tên dự án:</Text>
								</div>
								<div>
									<Text>{team.project.name}</Text>
								</div>
								<div className="mt-3">
									<Text strong>Mô tả dự án:</Text>
								</div>
								<div>
									<RawHtml html={team.project.description} />
								</div>
								<div className="mt-3">
									<Text strong>Yêu cầu chức năng (Functional):</Text>
								</div>
								<div>
									<RawHtml html={team.project.functionalReq} />
								</div>
								<div className="mt-3">
									<Text strong>Yêu cầu phi chức năng (Non-functional):</Text>
								</div>
								<div>
									<RawHtml html={team.project.nonfunctionalReq} />
								</div>
							</div>
						),
					},
				]}
			/>
		</Card>
	);
};

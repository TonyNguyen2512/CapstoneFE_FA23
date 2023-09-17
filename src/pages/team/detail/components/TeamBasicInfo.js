import { Card, Collapse, Descriptions, List, Row, Tag } from "antd";
import React, { useContext } from "react";
import { TeamContext } from "../../../../providers/team";
import { UserContext } from "../../../../providers/user";

export const TeamBasicInfo = () => {
	const { user } = useContext(UserContext);
	const { team } = useContext(TeamContext);

	const isLeader = user?.userId === team?.leader?.id;

	return (
		<Card title="Thông tin nhóm">
			<Descriptions
				items={[
					{
						label: "Nhóm trưởng",
						children: (
							<Row>
								<span>{team?.leader.fullName}</span>
								{isLeader && (
									<Tag className="ml-2" color="blue">
										Tôi
									</Tag>
								)}
							</Row>
						),
					},
					{
						label: "Hướng dẫn bởi GV",
						children: team?.instructor?.fullName ?? "N/A",
					},
					{
						label: "Số thành viên",
						children: team?.members?.length ?? 0,
					},
				]}
			/>
			<Collapse
				ghost
				items={[
					{
						label: `Tất cả thành viên nhóm (${team?.members?.length ?? 0})`,
						children: (
							<List
								rowKey={(item) => item.id}
								dataSource={team?.members}
								renderItem={(item) => {
									return (
										<List.Item>
											<span>
												{item.code} - {item.fullName}
												{user?.userId === item.id && (
													<span className="ml-2" style={{ fontWeight: "bold" }}>
														(Tôi)
													</span>
												)}
											</span>
										</List.Item>
									);
								}}
							/>
						),
					},
				]}
			/>
		</Card>
	);
};

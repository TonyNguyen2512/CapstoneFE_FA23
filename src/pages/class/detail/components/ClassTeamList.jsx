import { TableReport } from "@icon-park/react";
import { Button, Collapse, Empty, List, Typography } from "antd";
import React, { useContext } from "react";
import { useNavigate } from "react-router";
import routes from "../../../../constants/routes";
import { ClassContext } from "../../../../providers/class";
import { ClassDetailArea } from "../../components/ClassDetailArea";

const { Text } = Typography;

export const ClassTeamList = () => {
	const navigate = useNavigate();
	const { data } = useContext(ClassContext);

	const items = data?.teams?.map((e, index) => {
		return {
			key: e.id,
			label: `Nhóm ${index + 1} - Đề tài ${e.project.name}`,
			children: (
				<>
					<List
						dataSource={e.members}
						renderItem={(item) => (
							<List.Item>
								<Typography.Text>
									{item.mssv} - {item.fullName}
								</Typography.Text>
							</List.Item>
						)}
					/>
					<Button
						type="primary"
						className="flex-center mt-4"
						icon={<TableReport />}
						onClick={() =>
							navigate(
								`${routes.dashboard.root}/${routes.dashboard.report}/${e?.id}`
							)
						}
					>
						Xem báo cáo
					</Button>
				</>
			),
		};
	});

	return (
		<ClassDetailArea
			title={`Danh sách nhóm làm dự án (${data?.teams?.length ?? 0})`}
			defaultOpen
		>
			{items?.length > 0 ? (
				<Collapse items={items} />
			) : (
				<Empty description={<Text disabled>Chưa có nhóm nào đăng ký</Text>} />
			)}
		</ClassDetailArea>
	);
};

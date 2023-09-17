import { Check, Plus } from "@icon-park/react";
import { Dropdown, Space, Tag, theme } from "antd";
import React, { useContext } from "react";
import { MemberTaskItem } from "./MemberTaskItem";
import { ProjectContext } from "../../../../providers/project";
import TaskApi from "../../../../apis/task";
import { useRole } from "../../../../hooks/role";
import { roles } from "../../../../constants/app";

export const MemberTaskList = ({
	taskId,
	assignedMembers,
	onAssign,
	onUnAssign,
}) => {
	const role = useRole();
	const { token } = theme.useToken();
	const project = useContext(ProjectContext);

	const tagPlusStyle = {
		height: 22,
		background: token.colorBgContainer,
		borderStyle: "dashed",
	};

	const memberItems = project?.members?.map((member) => {
		const selected =
			assignedMembers.find((e) => e.memberId === member.memberId) !== undefined;
		return {
			label: (
				<div
					style={{
						fontWeight: selected ? 600 : 400,
						color: selected ? "#1677FF" : "inherit",
					}}
				>
					{selected && <Check />} {member?.memberFullName}
				</div>
			),
			key: member?.memberId,
			onClick: () => {
				if (selected) {
					return;
				}
				TaskApi.assignTask(taskId, member?.memberId).then((success) => {
					if (success) {
						onAssign && onAssign();
					}
				});
			},
		};
	});

	return (
		<div>
			<Space wrap size={[0, 0]}>
				{assignedMembers?.map((e) => {
					return (
						<MemberTaskItem
							key={e?.memberId}
							member={e}
							onRemove={(member) => onUnAssign(taskId, member?.memberId)}
						/>
					);
				})}
				{role === roles.WORKER && (
					<Dropdown trigger={["click"]} menu={{ items: memberItems }}>
						<Tag style={tagPlusStyle}>
							<Plus /> <span>Thêm thành viên</span>
						</Tag>
					</Dropdown>
				)}
			</Space>
		</div>
	);
};

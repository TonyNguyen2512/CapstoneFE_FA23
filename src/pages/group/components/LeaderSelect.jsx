import { Select } from "antd";
import React, { useEffect, useState } from "react";
import UserApi from "../../../apis/user";

export const LeaderSelect = ({
  value,
  onChange,
  allowClear,
  leaderName,
  disabled,
  onLoaded,
}) => {
  const [leader, setLeader] = useState([]);
  const [loading, setLoading] = useState(false);

  const initLeaderInfo = async () => {
		// const data = await UserApi.getAllUser();
		const roleId = "dd733ddb-949c-4441-b69b-08dbdf6e1008";
		const leadersData = await UserApi.getUserByRoleId(roleId);
		setLeader(leadersData?.data);
    setLoading(false)
	}

  useEffect(() => {
    initLeaderInfo();
  }, []);

  const leaderOptions = leader?.map((e) => {
  	return {
  		value: e.id,
  		label: e.fullName,
  	};
  });

  return (
    <Select
      className={leaderName}
      showSearch
      value={value}
      options={leaderOptions}
      placeholder="Chọn nhóm trưởng..."
      optionFilterProp="children"
      loading={loading}
      onChange={onChange}
      allowClear={allowClear}
      disabled={disabled}
    />
  );
};

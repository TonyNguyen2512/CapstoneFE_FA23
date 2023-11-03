import { Select } from "antd";
import React, { useEffect, useState } from "react";
import MaterialCategoryApi from "../../../apis/material-category";

export const MaterialSelect = ({
  value,
  onChange,
  allowClear,
  meterialName,
  disabled,
  onLoaded,
}) => {
  const [material, setMaterial] = useState([]);
  const [loading, setLoading] = useState(false);

  const getMaterials = async () => {
    setLoading(true);
    const data = await MaterialCategoryApi.getAllMaterialCategory();
    console.log(data);
    setMaterial(data ? data.data : []);
    setLoading(false);
    onLoaded && onLoaded(data.data);
  };

  useEffect(() => {
    getMaterials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const meterialOptions = material.map((e) => {
  	return {
  		value: e.id,
  		label: e.name,
  	};
  });

  return (
    <Select
      className={meterialName}
      showSearch
      value={value}
      options={meterialOptions}
      placeholder="Chọn loại vật liệu..."
      optionFilterProp="children"
      loading={loading}
      onChange={onChange}
      allowClear={allowClear}
      disabled={disabled}
    />
  );
};

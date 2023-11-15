import { Col, Empty, Input, Row, Select, Table, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";

const { Title, Text } = Typography;

export const BaseTable = ({
	columns,
	title,
	dataSource,
	expandedRowRender,
	searchOptions = {
		visible: true,
		placeholder: "Tìm kiếm...",
		width: undefined,
		onSearch: () => { },
	},
	pagination,
	actions,
	loading,
	rowKey,
	reload,
}) => {
	const all = useRef();

	const [list, setList] = useState([]);
	const { visible, placeholder, onSearch, width } = searchOptions;
	const filters = columns
		.filter((col) => col.filter)
		.map((item) => ({ ...item.filter, dataIndex: item.dataIndex }));

	useEffect(() => {
		all.current = dataSource;
		setList(dataSource);
	}, [dataSource]);

	return (
		<div>
			{filters.length > 0 && (
				<Row className="mb-4" gutter={16}>
					{filters.map(
						({
							placeholder,
							dataIndex,
							label,
							multiple,
							width,
							filterOptions,
						}) => {
							var values;
							var options;
							if (filterOptions) {
								options = filterOptions;
							} else {
								const allValues = dataSource.map((item) => item[dataIndex]);
								values = [...new Set(allValues)];
							}

							return (
								<Col key={dataIndex}>
									{label && <span className="mr-2">{label}:</span>}
									<Select
										mode={multiple ? "multiple" : undefined}
										showSearch
										allowClear
										style={{ width: width }}
										onClear={() => {
											setList([...all.current]);
										}}
										placeholder={placeholder}
										options={
											options
												? options
												: values.map((v) => {
													return {
														label: v,
														value: v,
													};
												})
										}
										onChange={(value) => {
											if (!value) {
												setList(all.current);
												return;
											}

											const result = all.current.filter(
												(item) => item[dataIndex] === value
											);
											setList(result);
										}}
									/>
								</Col>
							);
						}
					)}
				</Row>
			)}
			<Row justify="space-between">
				<Col span={12}>
					{title && (
						<Title ellipsis level={4}>
							{title}
						</Title>
					)}
				</Col>
				<Col span={12}>
					<Row gutter={8} justify="end">
						<Col>
							{visible && (
								<Input.Search
									className="mb-4"
									placeholder={placeholder ?? "Tìm kiếm..."}
									onSearch={onSearch}
									style={{ width: width }}
								/>
							)}
						</Col>
						<Col>{actions}</Col>
					</Row>
				</Col>
			</Row>
			<Table
				rowKey={rowKey}
				pagination={pagination}
				dataSource={list}
				columns={columns}
				loading={loading}
				locale={{
					emptyText: (
						<Empty description={<Text disabled>Chưa có dữ liệu</Text>} />
					),
				}}
				expandable={{
					expandedRowRender: expandedRowRender,
				}}
			/>
		</div>
	);
};

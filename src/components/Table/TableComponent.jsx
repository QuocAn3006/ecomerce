import { Button, Table } from 'antd';
import Loading from '../Loading/LoadingComponent';
import { useMemo, useState } from 'react';
import { Excel } from 'antd-table-saveas-excel';
const TableComponent = props => {
	const {
		selectionType = 'checkbox',
		dataTable = [],
		isLoading = false,
		columns = [],
		handleDeleteManyItems
	} = props;

	const [rowSelectedKeys, setRowSelectedKey] = useState([]);
	const newColumnsExport = useMemo(() => {
		const arr = columns?.filter(column => column.dataIndex !== 'action');
		return arr;
	}, [columns]);
	const exportExcel = () => {
		const excel = new Excel();
		excel
			.addSheet('test')
			.addColumns(newColumnsExport)
			.addDataSource(dataTable, {
				str2Percent: true
			})
			.saveAs('Excel.xlsx');
	};
	const rowSelection = {
		onChange: selectedRowKeys => {
			setRowSelectedKey(selectedRowKeys);
		}
	};

	const handleDeleteMany = () => {
		handleDeleteManyItems(rowSelectedKeys);
	};
	return (
		<Loading isPending={isLoading}>
			{rowSelectedKeys.length > 0 && (
				<div
					className='deleteMany'
					onClick={handleDeleteMany}
				>
					Xóa những mục đã chọn
				</div>
			)}
			<Button
				className='flex items-center mb-4'
				onClick={exportExcel}
			>
				{'Export excel'}
			</Button>
			<Table
				rowSelection={{
					type: selectionType,
					...rowSelection
				}}
				columns={columns}
				dataSource={dataTable}
				{...props}
			/>
		</Loading>
	);
};

export default TableComponent;

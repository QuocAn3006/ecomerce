import { useRef } from 'react';
import * as OrderService from '../../services/orderService';
import { useQuery } from '@tanstack/react-query';
import InputComponent from '../Input/InputComponent';
import { Button, Space } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import TableComponent from '../Table/TableComponent';
import PieChart from './PieChart';

const OrderAdmin = () => {
	const searchInput = useRef(null);

	const user = useSelector(state => state?.user);

	const getAllOrder = async () => {
		const res = await OrderService.getAllOrder(user?.access_token);
		return res;
	};

	const queryOrders = useQuery({
		queryKey: ['orders'],
		queryFn: getAllOrder
	});

	const { data: orders, isPending: isLoadingOrders } = queryOrders;

	const handleSearch = confirm => {
		confirm();
	};

	const handleReset = clearFilters => {
		clearFilters();
	};
	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close
		}) => (
			<div
				style={{
					padding: 8
				}}
				onKeyDown={e => e.stopPropagation()}
			>
				<InputComponent
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{
						marginBottom: 8,
						display: 'block'
					}}
				/>
				<Space>
					<Button
						type='primary'
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size='small'
						style={{
							width: 90
						}}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size='small'
						style={{
							width: 90
						}}
					>
						Reset
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							confirm({
								closeDropdown: false
							});
						}}
					>
						Filter
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => (
			<SearchOutlined
				style={{
					color: filtered ? '#1677ff' : undefined
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownOpenChange: visible => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		}
	});

	const columns = [
		{
			title: 'Username',
			dataIndex: 'userName',
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps('userName')
		},

		{
			title: 'phone',
			dataIndex: 'phone',
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps('phone')
		},

		{
			title: 'Address',
			dataIndex: 'address',
			sorter: (a, b) => a.address.length - b.address.length,
			...getColumnSearchProps('address')
		},

		{
			title: 'city',
			dataIndex: 'city',
			...getColumnSearchProps('city')
		},

		{
			title: 'Item price',
			dataIndex: 'itemPrice',
			...getColumnSearchProps('itemPrice')
		},

		{
			title: 'totalPrice',
			dataIndex: 'totalPrice',
			...getColumnSearchProps('totalPrice')
		},

		{
			title: 'shippingPrice',
			dataIndex: 'shippingPrice',
			...getColumnSearchProps('shippingPrice')
		},

		{
			title: 'isPaid',
			dataIndex: 'isPaid',
			...getColumnSearchProps('isPaid')
		},

		{
			title: 'paymentMethod',
			dataIndex: 'paymentMethod',
			...getColumnSearchProps('paymentMethod')
		}
	];
	const dataTable =
		orders?.data?.length > 0 &&
		orders?.data?.map(order => {
			return {
				...order,
				key: order?._id,
				userName: order?.shippingAddress?.fullName,
				phone: order?.shippingAddress?.phone,
				address: order?.shippingAddress?.address,
				city: order?.shippingAddress?.city,

				totalPrice: order?.totalPrice,
				itemPrice: order?.itemPrice,
				isPaid: order?.isPaid ? 'PAID' : 'NOT PAID ',
				shippingPrice: order?.shippingPrice,
				paymentMethod: order?.paymentMethod
			};
		});
	return (
		<div>
			<h1>Quản lý đơn hàng</h1>
			<div className='w-[200px] h-[200px]'>
				<PieChart data={orders?.data} />
			</div>
			<div className='mt-5'>
				<TableComponent
					columns={columns}
					dataTable={dataTable}
					isLoading={isLoadingOrders}
				/>
			</div>
		</div>
	);
};

export default OrderAdmin;

import {
	AppstoreOutlined,
	ShoppingCartOutlined,
	UserOutlined
} from '@ant-design/icons';
import { getItem } from '../../utils';
import UserAdmin from '../../components/UserAdmin/UserAdmin';
import ProductAdmin from '../../components/ProductAdmin/ProductAdmin';
import { Menu } from 'antd';
import { useState } from 'react';
import OrderAdmin from '../../components/OrderAdmin/OrderAdmin';

const AdminPage = () => {
	const items = [
		getItem('Quản lý sản phẩm', 'product', <UserOutlined />),
		getItem('Quản lý người dùng', 'user', <AppstoreOutlined />),
		getItem('Quản lý đơn hàng', 'order', <ShoppingCartOutlined />)
	];

	const [keySelected, setKeySelected] = useState('product');

	const renderPage = key => {
		switch (key) {
			case 'product':
				return <ProductAdmin />;
			case 'user':
				return <UserAdmin />;
			case 'order':
				return <OrderAdmin />;
			default:
				return <></>;
		}
	};

	const handleOnClick = ({ key }) => {
		setKeySelected(key);
	};
	return (
		<div className='p-4 flex flex-nowrap  bg-bg-color max-h-full h-[100vh]'>
			<Menu
				mode='inline'
				onClick={handleOnClick}
				style={{
					width: 300,
					boxShadow: '1px 1px 2px #ccc',
					fontSize: '16px',
					height: 'fit-content',
					borderRadius: '8px',
					marginRight: '14px '
				}}
				items={items}
			/>
			<div className='py-4 pl-4 pr-6 bg-white rounded-lg h-fit flex-1'>
				{renderPage(keySelected)}
			</div>
		</div>
	);
};

export default AdminPage;

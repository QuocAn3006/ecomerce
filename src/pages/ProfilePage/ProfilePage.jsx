import { Menu } from 'antd';

import { getItem } from '../../utils';
import { AppstoreOutlined, UserOutlined } from '@ant-design/icons';
import MyOrder from '../../components/MyOrder/MyOder';
import AccountDetail from '../../components/AccountDetail/AccountDetail';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';

const ProfilePage = () => {
	const location = useLocation();
	const { state } = location;
	const items = [
		getItem('Thông tin tài khoản', 'user', <UserOutlined />),
		getItem('Đơn hàng của tôi', 'product', <AppstoreOutlined />)
	];

	const [keySelected, setKeySelected] = useState('user');

	const renderPage = key => {
		switch (key) {
			case 'user':
				return <AccountDetail />;
			case 'product':
				return (
					<MyOrder
						id={state?.id}
						token={state?.token}
					/>
				);
			default:
				return <></>;
		}
	};

	const handleOnClick = ({ key }) => {
		setKeySelected(key);
	};
	return (
		<div className='p-4 flex flex-col md:flex-row gap-2 justify-center bg-bg-color min-h-[100vh] h-full'>
			<Menu
				mode='inline'
				onClick={handleOnClick}
				className='w-full md:w-[300px]'
				style={{
					boxShadow: '1px 1px 2px #ccc',
					fontSize: '16px',
					height: 'fit-content',
					borderRadius: '8px',
					marginRight: '14px '
				}}
				items={items}
			/>
			<div className='py-4 pl-4 pr-6 bg-white rounded-lg h-full flex-1'>
				{renderPage(keySelected)}
			</div>
		</div>
	);
};

export default ProfilePage;

import logo from '../../assets/img/logo.png';
import { Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/userServices';
import { useEffect, useState } from 'react';
import { resetUser } from '../../redux/slide/userSlice';
import Loading from '../../components/Loading/LoadingComponent';
import { UserOutlined } from '@ant-design/icons';

const Header = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [userName, setUserName] = useState('');
	const [userAvatar, setUserAvatar] = useState('');
	const user = useSelector(state => state?.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const handleNavigate = type => {
		if (type === 'signin') {
			navigate('/signin');
		} else if (type === 'profile') {
			navigate('/profile');
		} else if (type === 'home') {
			navigate('/');
		}
	};
	const handleLogout = async () => {
		setIsLoading(true);
		await UserService.logout();
		dispatch(resetUser());
		setIsLoading(false);
	};

	useEffect(() => {
		setIsLoading(true);
		setUserName(user?.name);
		setUserAvatar(user?.avatar);
		setIsLoading(false);
	}, [user?.name, user?.avatar]);

	const content = (
		<div className='cursor-pointer'>
			<p
				className='hover:text-primary-color py-1'
				onClick={() => handleNavigate('profile')}
			>
				Thông tin tài khoản
			</p>
			{user?.isAdmin && (
				<p
					className='hover:text-primary-color py-1'
					onClick={() => handleNavigate('admin')}
				>
					Quản lý hệ thống
				</p>
			)}
			<p
				className='hover:text-primary-color py-1'
				onClick={() => handleLogout()}
			>
				Đăng xuất
			</p>
		</div>
	);
	return (
		<header className='flex flex-col md:flex-row md:items-center md:justify-between w-full cursor-pointer p-4 '>
			<div
				className='ml-12'
				onClick={() => handleNavigate('home')}
			>
				<img
					src={logo}
					alt=''
					className='w-[72px] h-[72px] md:w-[80px] md:h-[80px]'
				/>
			</div>

			<div className='mr-12'>
				<div className='ml-8 flex text-lg items-center'>
					<Loading isPending={isLoading}>
						{user?.access_token ? (
							<Popover
								className='hidden md:flex md:w-full md:items-center md:justify-start md:mr-4'
								content={content}
								trigger='click'
							>
								<img
									src={userAvatar}
									alt='avatar'
									style={{
										height: '30px',
										width: '30px',
										borderRadius: '50%',
										objectFit: 'cover',
										marginRight: '10px'
									}}
								/>
								<span>
									{userName?.length ? userName : user?.email}
								</span>
							</Popover>
						) : (
							<div
								className='hidden md:flex md:w-full md:items-center md:justify-start md:mr-3'
								onClick={() => handleNavigate('signin')}
							>
								<UserOutlined style={{ fontSize: '22px' }} />
								<span className='text-primary-color ml-3'>
									Tài khoản
								</span>
							</div>
						)}
					</Loading>
				</div>
			</div>
		</header>
	);
};

export default Header;

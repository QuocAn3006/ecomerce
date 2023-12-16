import logo from '../../assets/img/logo.png';
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import InputComponent from '../../components/Input/InputComponent';
import { Badge, Popover } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import * as UserService from '../../services/userServices';
import * as ProductService from '../../services/productService';
import { useEffect, useState } from 'react';
import { resetUser } from '../../redux/slide/userSlice';
import Loading from '../../components/Loading/LoadingComponent';
import { useDebounce } from '../../hook/useDebounce';
import { useQuery } from '@tanstack/react-query';
import { convertPrice } from '../../utils';

const Header = () => {
	const [isLoading, setIsLoading] = useState(false);
	const [userName, setUserName] = useState('');
	const [userAvatar, setUserAvatar] = useState('');
	const [searchValue, setSearchValue] = useState('');
	const user = useSelector(state => state?.user);
	const order = useSelector(state => state?.order);
	const searchDebounce = useDebounce(searchValue, 500);
	const limit = 4;

	const navigate = useNavigate();
	const handleNavigateProductDetail = id => {
		navigate(`/product-detail/${id}`);
		setSearchValue('');
	};
	const dispatch = useDispatch();
	const handleNavigate = type => {
		if (type === 'signin') {
			navigate('/signin');
		} else if (type === 'profile') {
			navigate('/profile', {
				state: {
					id: user?.id,
					token: user?.access_token
				}
			});
		} else if (type === 'home') {
			navigate('/');
		} else if (type === 'admin') {
			navigate('/system/admin');
		} else if (type === 'cart') {
			navigate('/cart');
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

	const onSearch = e => {
		setSearchValue(e.target.value);
	};

	const fetchProductSearch = async context => {
		const limit = context?.queryKey && context?.queryKey[1];
		const search = context?.queryKey && context?.queryKey[2];
		let res = {};
		if (search?.length > 0) {
			res = await ProductService.getAllProduct(limit, search);
		}
		return res;
	};

	const { data: products } = useQuery({
		queryKey: ['products', limit, searchDebounce],
		queryFn: fetchProductSearch,
		retry: 3,
		retryDelay: 1000,
		placeholderData: true
	});

	const content = (
		<div className='cursor-pointer'>
			<p
				className='hover:text-primary-color py-1'
				onClick={() => handleNavigate('profile')}
			>
				Tài khoản & Đơn hàng
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
		<header className='flex flex-col md:flex-row md:items-center w-full cursor-pointer p-4'>
			<div
				className='md:w-[10%] mr-3'
				onClick={() => handleNavigate('home')}
			>
				<img
					src={logo}
					alt=''
					className='w-[72px] h-[72px] md:w-[80px] md:h-[80px]'
				/>
			</div>

			<div className='flex items-center md:w-[85%] w-full'>
				<div className='w-full flex-1 relative'>
					<InputComponent
						placeholder='Tìm kiếm sản phẩm'
						size='large'
						value={searchValue}
						onChange={onSearch}
					/>
					{products?.data?.length > 0 && (
						<div className='w-full absolute top-12 right-0 left-0 bg-white z-10 rounded-lg'>
							<div className='flex flex-col '>
								{products?.data?.map(product => (
									<div
										className=' flex items-center justify-between p-4 hover:bg-bg-color rounded-lg'
										key={product?._id}
										onClick={() =>
											handleNavigateProductDetail(
												product?._id
											)
										}
									>
										<div className='flex-1 flex items-center gap-2'>
											<img
												src={product?.image}
												alt='image-search'
												width={50}
												height={50}
											/>
											<span>{product?.name}</span>
										</div>
										<span>
											{convertPrice(product?.price)}
											<sup>đ</sup>
										</span>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
				<div className='ml-8 flex text-lg items-center'>
					<Loading isPending={isLoading}>
						{user?.access_token ? (
							<Popover
								className='hidden md:flex md:w-full md:items-center md:justify-start md:mr-4'
								content={content}
								trigger='click'
							>
								{userAvatar ? (
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
								) : (
									<UserOutlined
										style={{
											height: '30px',
											width: '30px',
											borderRadius: '50%',
											objectFit: 'cover',
											marginRight: '10px',
											fontSize: '22px'
										}}
									/>
								)}
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
					<Badge
						count={order?.orderItems?.length}
						size='small'
					>
						<ShoppingCartOutlined
							style={{ fontSize: '22px' }}
							className='hover:text-primary-color'
							onClick={() => handleNavigate('cart')}
						/>
					</Badge>
				</div>
			</div>
		</header>
	);
};

export default Header;

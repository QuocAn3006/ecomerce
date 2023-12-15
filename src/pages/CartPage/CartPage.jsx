import { DeleteOutlined, MinusOutlined, PlusOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/Button/ButtonComponent';
import { Form, Image, InputNumber, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import emptycart from '../../assets/img/emptycart.png';
import {
	decreaseAmount,
	increaseAmount,
	removeAllOrderProduct,
	removeOrderProduct,
	selectedOrder
} from '../../redux/slide/orderSlide';
import { useEffect, useMemo, useState } from 'react';
import ModalComponent from '../../components/Modal/ModalComponent';
import Loading from '../../components/Loading/LoadingComponent';
import { useMutationHook } from '../../hook/useMutationHook';
import * as UserService from '../../services/userServices';
import InputComponent from '../../components/Input/InputComponent';
import { useForm } from 'antd/es/form/Form';
import { updateUser } from '../../redux/slide/userSlice';
import { useNavigate } from 'react-router-dom';

const CartPage = () => {
	const orders = useSelector(state => state?.order);
	const user = useSelector(state => state?.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const [listChecked, setListChecked] = useState([]);
	const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
	const [stateUserDetail, setStateUserDetail] = useState({
		name: '',
		phone: '',
		address: '',
		city: ''
	});

	const priceMemo = useMemo(() => {
		const result = orders?.orderItemsSelected?.reduce((total, cur) => {
			return total + cur.price * cur.amount;
		}, 0);
		return result;
	}, [orders]);

	const priceDiscountMemo = useMemo(() => {
		const result = orders?.orderItemsSelected?.reduce((total, cur) => {
			return total + cur.discount * cur.amount;
		}, 0);
		if (Number(result)) {
			return result;
		}
		return 0;
	}, [orders]);

	const priceDeliveryMemo = useMemo(() => {
		if (priceMemo > 10000000) {
			return 100000;
		} else if (priceMemo === 0) {
			return 0;
		} else {
			return 50000;
		}
	}, [priceMemo]);

	const totalPriceMemo = useMemo(() => {
		return (
			Number(priceMemo) -
			Number(priceDiscountMemo) +
			Number(priceDeliveryMemo)
		);
	}, [priceMemo, priceDeliveryMemo, priceDiscountMemo]);

	const handleOnChangeCheckbox = e => {
		if (listChecked.includes(e.target.value)) {
			const newListChecked = listChecked.filter(
				item => item !== e.target.value
			);
			setListChecked(newListChecked);
		} else {
			setListChecked([...listChecked, e.target.value]);
		}
	};

	const handleCheckAll = e => {
		if (e.target.checked) {
			const newListChecked = [];
			orders?.orderItems?.forEach(item => {
				newListChecked.push(item?.product);
			});
			setListChecked(newListChecked);
		} else {
			setListChecked([]);
		}
	};

	const handleChangeCount = (type, idProduct, limited) => {
		if (type === 'increase') {
			if (!limited) {
				dispatch(increaseAmount({ idProduct }));
			}
		} else if (type === 'decrease') {
			if (!limited) {
				dispatch(decreaseAmount({ idProduct }));
			}
		}
	};

	const handleDeleteProduct = idProduct => {
		dispatch(removeOrderProduct({ idProduct }));
	};

	const handleDeleteAllProduct = () => {
		if (listChecked.length >= 1) {
			dispatch(removeAllOrderProduct({ listChecked }));
		}
	};

	// update address

	const handleOnChangeDetail = e => {
		setStateUserDetail({
			...stateUserDetail,
			[e.target.name]: e.target.value
		});
	};

	const mutationUpdate = useMutationHook(data => {
		const { id, token, ...rests } = data;
		const res = UserService.updateUser(id, { ...rests }, token);
		return res;
	});

	const [form] = useForm();

	const { isPending } = mutationUpdate;

	const handleCancelUpdateInfo = () => {
		setStateUserDetail({
			name: '',
			phone: '',
			address: '',
			isAdmin: 'false'
		});
		form.resetFields();
		setIsOpenModalUpdateInfo(false);
	};

	const handleUpdateInfo = () => {
		const { name, phone, address, city } = stateUserDetail;
		if (name && phone && address && city) {
			mutationUpdate.mutate(
				{ id: user?.id, token: user?.access_token, ...stateUserDetail },
				{
					onSuccess: () => {
						dispatch(updateUser({ name, address, city, phone }));
						setIsOpenModalUpdateInfo(false);
					}
				}
			);
		}
	};

	const handlePayment = () => {
		if (!orders?.orderItemsSelected?.length) {
			message.error('Vui lòng chọn sản phẩm');
		} else if (
			!user?.name ||
			!user.address ||
			!user?.phone ||
			!user?.city
		) {
			setIsOpenModalUpdateInfo(true);
		} else {
			navigate('/payment');
		}
	};

	useEffect(() => {
		if (isOpenModalUpdateInfo) {
			setStateUserDetail({
				name: user?.name,
				phone: user?.phone,
				address: user?.address,
				city: user?.city
			});
		}
	}, [isOpenModalUpdateInfo]);

	useEffect(() => {
		form.setFieldsValue(stateUserDetail);
	}, [form, stateUserDetail]);

	useEffect(() => {
		dispatch(selectedOrder({ listChecked }));
	}, [listChecked]);

	return (
		<>
			<div className='p-4 bg-bg-color min-h-[100vh] max-h-full'>
				<h1 className='text-xl font-medium uppercase'>Giỏ hàng</h1>
				<div className='flex flex-col gap-3 justify-between md:flex-row mt-4'>
					<div className='md:w-[75%] w-full'>
						<div className='bg-white rounded-lg flex p-4'>
							<div className='flex items-center w-[60%] gap-1'>
								<input
									className='cursor-pointer'
									type='checkbox'
									onChange={handleCheckAll}
									checked={
										listChecked?.length ===
										orders?.orderItems?.length
									}
								/>
								<span>{`Tất cả sản phẩm`}</span>
							</div>

							<div className=' hidden md:flex justify-between items-center w-[40%]'>
								<span>Đơn giá</span>
								<span>Số lượng</span>
								<span>Thành tiền</span>
								<span
									className='cursor-pointer hover:text-[#ff4d4f]'
									onClick={handleDeleteAllProduct}
								>
									<DeleteOutlined />
								</span>
							</div>
						</div>

						{orders?.orderItems?.length === 0 && (
							<div className='bg-white rounded-lg flex flex-col items-center justify-center md:flex-col p-4 mt-4'>
								<img
									src={emptycart}
									alt='empty-cart'
									width={160}
									height={160}
								/>
								<p className='text-base font-semibold my-3'>
									Giỏ hàng trống
								</p>
							</div>
						)}

						{orders?.orderItems?.map(order => {
							return (
								<div
									className='bg-white rounded-lg flex flex-col md:flex-row md:items-center p-4 mt-4'
									key={order?.product}
								>
									<div className='flex items-center md:w-[60%] w-full gap-1'>
										<input
											className='cursor-pointer'
											type='checkbox'
											value={order?.product}
											onChange={handleOnChangeCheckbox}
											checked={listChecked.includes(
												order?.product
											)}
										/>
										<div className='flex-1 flex items-center ml-2'>
											<Image
												src={order?.image}
												alt='product-img'
												width={70}
												height={70}
											/>
											<span className='mx-2 w-full text-ellipsis line-clamp-2 md:line-clamp-1'>
												{order?.name}
											</span>
										</div>
									</div>

									<div className='flex justify-between items-center md:w-[40%] mt-4 md:mt-0 ml-[102px] md:ml-0'>
										<span className='hidden md:block font-medium'>
											{convertPrice(order?.price)}
											<sup>đ</sup>
										</span>
										<span>
											<div className='flex items-center cursor-pointer'>
												<button
													style={{
														width: '25px',
														height: '25px',
														backgroundColor:
															'rgb(255, 255, 255)',
														border: '1px solid rgb(236, 236, 236)',
														borderRadius: '4px',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',
														cursor: 'pointer'
													}}
													onClick={() =>
														handleChangeCount(
															'decrease',
															order?.product,
															order?.amount === 1
														)
													}
												>
													<MinusOutlined
														style={{
															color: '#000',
															fontSize: '13px'
														}}
													/>
												</button>
												<InputNumber
													style={{
														border: '1px solid rgb(236, 236, 236)'
													}}
													className='w-[35px] h-[25px] flex items-center mx-1'
													size='small'
													value={order?.amount}
													min={1}
													max={order?.countInStock}
													defaultValue={order?.amount}
												/>
												<button
													style={{
														width: '25px',
														height: '25px',
														backgroundColor:
															'rgb(255, 255, 255)',
														border: '1px solid rgb(236, 236, 236)',
														borderRadius: '4px',
														display: 'flex',
														alignItems: 'center',
														justifyContent:
															'center',
														cursor: 'pointer'
													}}
													onClick={() =>
														handleChangeCount(
															'increase',
															order?.product,
															order?.amount ===
																order?.countInStock
														)
													}
												>
													<PlusOutlined
														style={{
															color: '#000',
															fontSize: '13px'
														}}
													/>
												</button>
											</div>
										</span>
										<span className='text-[#ff4d4f] font-medium'>
											{convertPrice(
												order?.price * order?.amount
											)}
											<sup>đ</sup>
										</span>
										<span
											className='cursor-pointer hover:text-[#ff4d4f]'
											onClick={() =>
												handleDeleteProduct(
													order?.product
												)
											}
										>
											<DeleteOutlined />
										</span>
									</div>
								</div>
							);
						})}
					</div>
					<div className='flex flex-col md:w-[25%] w-full'>
						<div className='bg-white p-4 rounded-lg'>
							<div className='flex justify-between '>
								<h4>Giao tới</h4>
								<span
									className='text-primary-color cursor-pointer'
									onClick={() =>
										setIsOpenModalUpdateInfo(true)
									}
								>
									Thay đổi
								</span>
							</div>

							<div className='font-semibold text-base mt-2'>
								<span
									style={{
										borderRight:
											'1px solid rgb(235, 235, 240)',
										paddingRight: '8px'
									}}
								>
									{user?.name}
								</span>
								<span className='pl-2'>{user?.phone}</span>
							</div>

							<div className='mt-2'>
								<span
									style={{
										color: 'color: rgb(0, 171, 86)',
										backgroundColor: 'rgb(239, 255, 244)',
										padding: '0 6px',
										marginRight: '4px'
									}}
								>
									Nhà
								</span>
								<span style={{ color: 'rgb(128, 128, 137)' }}>
									{`${user?.address} - ${user?.city}`}
								</span>
							</div>
						</div>

						<div className='bg-white p-4 rounded-lg mt-4'>
							<div className='flex justify-between mb-3'>
								<span>Tạm tính</span>
								<span className='text-base font-medium'>
									{convertPrice(priceMemo)} <sup>đ</sup>
								</span>
							</div>

							<div
								className='flex justify-between mb-2'
								style={{
									borderBottom:
										'1px solid rgb(235, 235, 240)',
									paddingBottom: '20px'
								}}
							>
								<span>Giảm giá</span>
								<span className='text-base font-medium'>{`${priceDiscountMemo}%`}</span>
							</div>

							{/* <div
								className='flex justify-between'
								style={{
									borderBottom:
										'1px solid rgb(235, 235, 240)',
									paddingBottom: '20px'
								}}
							>
								<span>Phí giao hàng</span>
								<span className='text-base font-medium'>
									{convertPrice(priceDeliveryMemo)}{' '}
									<sup>đ</sup>
								</span>
							</div> */}

							<div className='flex justify-between mt-5'>
								<span>Tổng tiền</span>
								<span className='text-[#ff4d4f] text-lg font-medium'>
									{convertPrice(totalPriceMemo)}
									<sup>đ</sup>
								</span>
							</div>
						</div>

						<div>
							<ButtonComponent
								onClick={handlePayment}
								size={40}
								styleButton={{
									background: 'rgb(255, 57, 69)',
									height: '48px',
									width: '100%',
									border: 'none',
									borderRadius: '4px',
									margin: '26px 0 10px'
								}}
								textButton={'Mua hàng'}
								styleTextButton={{
									color: '#fff',
									fontSize: '16px'
								}}
							></ButtonComponent>
						</div>
					</div>
				</div>
			</div>

			<ModalComponent
				forceRender
				title='Cập nhật thông tin giao hàng'
				open={isOpenModalUpdateInfo}
				onCancel={handleCancelUpdateInfo}
				onOk={handleUpdateInfo}
			>
				<Loading isPending={isPending}>
					<Form
						name='basic'
						labelCol={{
							span: 6
						}}
						wrapperCol={{
							span: 18
						}}
						style={{
							maxWidth: 600
						}}
						autoComplete='on'
						form={form}
					>
						{/* name */}
						<Form.Item
							label='Name'
							name='name'
							rules={[
								{
									required: true,
									message: 'Please input your name product!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.name}
								onChange={handleOnChangeDetail}
								name='name'
							/>
						</Form.Item>

						{/* phone */}
						<Form.Item
							label='Phone'
							name='phone'
							rules={[
								{
									required: true,
									message: 'Please input your phone!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.phone}
								onChange={handleOnChangeDetail}
								name='phone'
							/>
						</Form.Item>

						{/* address */}
						<Form.Item
							label='Address'
							name='address'
							rules={[
								{
									required: true,
									message: 'Please input your address!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.address}
								onChange={handleOnChangeDetail}
								name='address'
							/>
						</Form.Item>

						{/* city */}
						<Form.Item
							label='City'
							name='city'
							rules={[
								{
									required: true,
									message: 'Please input your city!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.city}
								onChange={handleOnChangeDetail}
								name='city'
							/>
						</Form.Item>
					</Form>
				</Loading>
			</ModalComponent>
		</>
	);
};

export default CartPage;

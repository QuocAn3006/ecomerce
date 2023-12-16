import { DeleteOutlined, SendOutlined } from '@ant-design/icons';
import ButtonComponent from '../../components/Button/ButtonComponent';
import { Form, Image, Radio, message } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { convertPrice } from '../../utils';
import paymentChoose from '../../assets/img/payment-choose.png';
import paypalChoose from '../../assets/img/paypal-img.svg';
import { useEffect, useMemo, useState } from 'react';
import ModalComponent from '../../components/Modal/ModalComponent';
import Loading from '../../components/Loading/LoadingComponent';
import { useMutationHook } from '../../hook/useMutationHook';
import * as UserService from '../../services/userServices';
import * as OrderService from '../../services/orderService';
import InputComponent from '../../components/Input/InputComponent';
import { useForm } from 'antd/es/form/Form';
import { updateUser } from '../../redux/slide/userSlice';
import { useNavigate } from 'react-router-dom';
import {
	removeAllOrderProduct,
	removeOrderProduct
} from '../../redux/slide/orderSlide';

const PaymentPage = () => {
	const orders = useSelector(state => state?.order);
	const user = useSelector(state => state?.user);
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
	const [delivery, setDelivery] = useState('fast');
	const [payment, setPayment] = useState('later-money');
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
		if (delivery === 'fast') {
			return 100000;
		} else if (delivery === 'save') {
			return 50000;
		}
	}, [delivery]);

	const totalPriceMemo = useMemo(() => {
		return (
			Number(priceMemo) -
			Number(priceDiscountMemo) +
			Number(priceDeliveryMemo)
		);
	}, [priceMemo, priceDeliveryMemo, priceDiscountMemo]);

	const handleChooseDelivery = e => {
		setDelivery(e.target.value);
	};

	const handleChoosePayment = e => {
		setPayment(e.target.value);
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

	// payment
	const mutationCreateOrder = useMutationHook(data => {
		const { token, ...rests } = data;
		const res = OrderService.createOrder({ ...rests }, token);
		return res;
	});

	const handlePayment = () => {
		if (
			user?.access_token &&
			orders?.orderItemsSelected &&
			user?.name &&
			user?.address &&
			user?.phone &&
			user?.city &&
			priceMemo &&
			user?.id
		) {
			mutationCreateOrder.mutate({
				token: user?.access_token,
				orderItems: orders?.orderItemsSelected,
				fullName: user?.name,
				address: user?.address,
				phone: user?.phone,
				city: user?.city,
				paymentMethod: payment,
				itemPrice: priceMemo,
				shippingPrice: priceDeliveryMemo,
				totalPrice: totalPriceMemo,
				user: user?.id,
				email: user?.email
			});
		}
	};

	const {
		isPending: isLoadingCreateOrder,
		data: dataCreateOrder,
		isSuccess: isSuccessCreateOrder,
		isError: isErrorCreateOrder
	} = mutationCreateOrder;

	useEffect(() => {
		if (isSuccessCreateOrder && dataCreateOrder?.status === 'OK') {
			const arrayOrdered = [];
			orders?.orderItemsSelected?.forEach(element => {
				arrayOrdered.push(element.product);
			});
			dispatch(removeAllOrderProduct({ listChecked: arrayOrdered }));
			message.success('Đặt hàng thành công');
			navigate('/order-success', {
				state: {
					delivery,
					payment,
					orders: orders?.orderItemsSelected,
					totalPriceMemo: totalPriceMemo
				}
			});
		} else if (isErrorCreateOrder) {
			message.error('Đặt hàng thất bại');
		}
	}, [isSuccessCreateOrder, isErrorCreateOrder]);

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

	const handleDeleteProduct = idProduct => {
		dispatch(removeOrderProduct({ idProduct }));
	};

	// const addPaypalScript = async () => {
	// 	const { data } = await PaymentService.getConfig();
	// 	setClientId(data);
	// };
	// const initialOptions = {
	// 	clientId: clientId,
	// 	intent: 'capture'
	// };
	// const onCreateOder = () => {
	// 	return mutationCreateOrder.mutate({
	// 		token: user?.access_token,
	// 		orderItems: orders?.orderItemsSelected,
	// 		fullName: user?.name,
	// 		address: user?.address,
	// 		phone: user?.phone,
	// 		city: user?.city,
	// 		paymentMethod: payment,
	// 		itemPrice: priceMemo,
	// 		shippingPrice: priceDeliveryMemo,
	// 		totalPrice: totalPriceMemo,
	// 		user: user?.id,
	// 		isPaid: true,
	// 		email: user?.email
	// 	});
	// };

	// const onApprove = data => {
	// 	console.log(data);
	// };

	// useEffect(() => {
	// 	if (!window.paypal) {
	// 		addPaypalScript();
	// 	}
	// }, []);

	useEffect(() => {
		form.setFieldsValue(stateUserDetail);
	}, [form, stateUserDetail]);
	return (
		<>
			<Loading isPending={isLoadingCreateOrder}>
				<div className='p-4 bg-bg-color min-h-[100vh] max-h-full '>
					<div className='flex flex-col gap-3 mt-4 md:flex-row'>
						<div className='md:w-[75%] w-full'>
							<div className='bg-white rounded-lg flex flex-col p-4'>
								<h1 className='text-xl font-medium '>
									Chọn hình thức giao hàng
								</h1>

								<Radio.Group
									className='mt-4 flex flex-col md:flex-row justify-around'
									onChange={handleChooseDelivery}
									value={delivery}
								>
									<div
										className='p-4 flex flex-row md:w-[30%] rounded-md'
										style={{
											background: 'rgb(240, 248, 255)',
											border: '1px solid rgb(194, 225, 255)'
										}}
									>
										<Radio value='fast'>
											<span
												style={{
													color: '#ea8500',
													fontWeight: 'bold'
												}}
											>
												Giao hàng nhanh
											</span>
										</Radio>
									</div>

									<div
										className='p-4 flex flex-row md:w-[30%] mt-4 md:mt-0 rounded-md'
										style={{
											background: 'rgb(240, 248, 255)',
											border: '1px solid rgb(194, 225, 255)'
										}}
									>
										<Radio value='save'>
											<span
												style={{
													color: '#ea8500',
													fontWeight: 'bold'
												}}
											>
												Giao hàng tiết kiệm
											</span>
										</Radio>
									</div>
								</Radio.Group>

								{orders?.orderItemsSelected?.map(order => {
									return (
										<div
											className='rounded-xl flex mt-4 pt-5 px-4 pb-4 relative z-0 flex-col w-full justify-center'
											key={order?.product}
											style={{
												border: '1px solid rgb(221, 221, 227)'
											}}
										>
											<div
												className='absolute bg-white top-0 left-3 flex items-center'
												style={{
													color: 'rgb(7, 148, 73)',
													transform:
														'translateY(-50%)'
												}}
											>
												<div className='flex items-center mx-2'>
													<SendOutlined />

													{delivery === 'fast' ? (
														<span className='mx-1'>
															{`Giao hàng nhanh - ${priceDeliveryMemo.toLocaleString()}`}
															<sup>đ</sup>
														</span>
													) : (
														<span className='mx-1'>
															{`Giao hàng tiết kiệm - ${priceDeliveryMemo.toLocaleString()}`}
															<sup>đ</sup>
														</span>
													)}
												</div>
											</div>
											<div className='flex items-center'>
												<div className='flex flex-1 items-center ml-2'>
													<div className='max-w-full h-auto'>
														<Image
															src={order?.image}
															alt='product-img'
															width={50}
															height={50}
														/>
													</div>
													<div className='flex flex-col'>
														<span className='mx-2 line-clamp-1'>
															{order?.name}
														</span>
														<span className='mx-2'>
															{`SL: ${order?.amount}`}
														</span>
													</div>
												</div>
												<div className='flex items-center '>
													<span className=' font-medium'>
														{convertPrice(
															order?.price
														)}
														<sup>đ</sup>
													</span>
													<span
														className='ml-4 cursor-pointer hover:text-[#ff4d4f]'
														onClick={() =>
															handleDeleteProduct(
																order?.id
															)
														}
													>
														<DeleteOutlined />
													</span>
												</div>
											</div>
										</div>
									);
								})}
							</div>
							<div className='bg-white rounded-lg flex flex-col p-4 mt-4'>
								<h1 className='text-xl font-medium '>
									Chọn hình thức thanh toán
								</h1>

								<Radio.Group
									className='flex flex-col mt-4'
									value={payment}
									onChange={handleChoosePayment}
								>
									<Radio value='later-money'>
										<div className='flex items-center mb-2'>
											<img
												src={paymentChoose}
												alt='pay at home'
												width={32}
												height={32}
												className='mx-2'
											/>
											<span>
												Thanh toán khi nhận hàng
											</span>
										</div>
									</Radio>

									<Radio value='paypal'>
										<div className='flex items-center'>
											<img
												src={paypalChoose}
												alt='paypal'
												width={32}
												height={32}
												className='mx-2'
											/>
											<span>Thanh toán bằng PAYPAL</span>
										</div>
									</Radio>
								</Radio.Group>
							</div>
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
											backgroundColor:
												'rgb(239, 255, 244)',
											padding: '0 6px',
											marginRight: '4px'
										}}
									>
										Nhà
									</span>
									<span
										style={{ color: 'rgb(128, 128, 137)' }}
									>
										{`${user?.address} - ${user?.city}`}
									</span>
								</div>
							</div>

							<div className='bg-white p-4 rounded-lg mt-4'>
								<div className='flex justify-between mb-2'>
									<span>Tạm tính</span>
									<span className='text-base font-medium'>
										{convertPrice(priceMemo)} <sup>đ</sup>
									</span>
								</div>

								<div className='flex justify-between mb-2'>
									<span>Giảm giá</span>
									<span className='text-base font-medium'>{`${priceDiscountMemo}%`}</span>
								</div>

								<div
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
								</div>

								<div className='flex justify-between mt-5'>
									<span>Tổng tiền</span>
									<span className='text-[#ff4d4f] text-lg font-medium'>
										{convertPrice(totalPriceMemo)}
										<sup>đ</sup>
									</span>
								</div>
							</div>

							{payment === 'paypal' ? (
								<ButtonComponent
									onClick={() =>
										message.warning(
											'hiện chức năng này chưa thực hiện được'
										)
									}
									size={40}
									styleButton={{
										background: 'rgb(255, 57, 69)',
										height: '48px',
										width: '100%',
										border: 'none',
										borderRadius: '4px',
										margin: '26px 0 10px'
									}}
									textButton={'Đặt hàng'}
									styleTextButton={{
										color: '#fff',
										fontSize: '16px'
									}}
								></ButtonComponent>
							) : (
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
									textButton={'Đặt hàng'}
									styleTextButton={{
										color: '#fff',
										fontSize: '16px'
									}}
								></ButtonComponent>
							)}
						</div>
					</div>
				</div>
			</Loading>

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

export default PaymentPage;

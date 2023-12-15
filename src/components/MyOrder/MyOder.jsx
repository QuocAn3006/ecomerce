// import { SendOutlined } from '@ant-design/icons';
// import { convertPrice } from '../../utils';
// import { Image } from 'antd';
// import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as OrderService from '../../services/orderService';
import Loading from '../Loading/LoadingComponent';
import { SendOutlined } from '@ant-design/icons';
import { orderContant } from '../../contant';
import { Image, message } from 'antd';
import { convertPrice } from '../../utils';
import { useMutationHook } from '../../hook/useMutationHook';
import { useEffect } from 'react';

const MyOrder = props => {
	const { id, token } = props;

	const fetchMyOrder = async () => {
		const res = await OrderService.getOrderById(id, token);
		return res.data;
	};
	const queryOrder = useQuery({
		queryKey: ['order'],
		queryFn: fetchMyOrder,
		enabled: !!id && !!token
	});
	const { isPending, data } = queryOrder;

	// cancel order
	const mutation = useMutationHook(data => {
		const { id, token, orderItems, userId } = data;
		const res = OrderService.cancelOrder(id, token, orderItems, userId);
		return res;
	});
	const handleCancelOrder = order => {
		mutation.mutate(
			{
				id: order._id,
				token: token,
				orderItems: order?.orderItems,
				userId: id
			},
			{ onSuccess: () => queryOrder.refetch() }
		);
	};

	const {
		isPending: isPendingCancel,
		isError: isErrorCancel,
		data: dataCancel,
		isSuccess: isSuccessCancel
	} = mutation;

	useEffect(() => {
		if (isSuccessCancel && dataCancel?.status === 'OK') {
			message.success('Hủy đơn hàng thành công');
		} else if (isErrorCancel) {
			message.error('Hủy đơn hàng thất bại');
		}
	}, [isSuccessCancel, isErrorCancel]);
	const renderOrder = data => {
		return data?.map(order => {
			return (
				<div
					className='flex items-center ml-2'
					key={order?._id}
				>
					<div className='max-w-full h-auto'>
						<Image
							src={order?.image}
							alt='product-img'
							width={50}
							height={50}
						/>
					</div>
					<div className='flex flex-col'>
						<span className='mx-2 line-clamp-1'>{order?.name}</span>
						<span className='mx-2'>{`SL: ${order?.amount}`}</span>
						<span className='mx-2'>
							{`GT: ${convertPrice(order?.price)}`}
							<sup>đ</sup>
						</span>
					</div>
				</div>
			);
		});
	};
	return (
		<Loading isPending={isPending || isPendingCancel}>
			<div className='flex flex-col gap-3 mt-4 md:flex-row'>
				<div className='w-full'>
					<div className='bg-white rounded-lg flex flex-col p-4'>
						<h1 className='text-xl font-medium '>
							Đơn hàng của tôi
						</h1>

						<div className='mt-4 flex flex-col '>
							{data?.map(order => {
								return (
									<div
										className='rounded-xl flex mt-4 pt-5 px-4 pb-4 relative z-0 flex-col w-full justify-center'
										key={order?.id}
										style={{
											border: '1px solid rgb(221, 221, 227)'
										}}
									>
										<div
											className='absolute bg-white top-0 left-3 flex items-center'
											style={{
												color: 'rgb(7, 148, 73)',
												transform: 'translateY(-50%)'
											}}
										>
											<div className='flex items-center mx-2'>
												<SendOutlined />
												<span className='mx-1'>
													{
														orderContant.payment[
															order?.paymentMethod
														]
													}
												</span>
											</div>
										</div>
										<div className='flex md:justify-between flex-col md:flex-row md:items-center '>
											{renderOrder(order?.orderItems)}
											<div className='flex flex-col gap-2 md:items-center mt-2 ml-2 md:mt-0 md:ml-0 '>
												{order?.isDelivered ===
												false ? (
													<span className=' font-medium'>
														Chưa giao hàng
													</span>
												) : (
													<span className=' font-medium'>
														Đã giao hàng
													</span>
												)}

												{order?.isPaid === false ? (
													<span className=' font-medium'>
														Chưa thanh toán
													</span>
												) : (
													<span className=' font-medium'>
														Đã thanh toán
													</span>
												)}
												<span className=' font-medium'>
													{`Tổng tiền - ${convertPrice(
														order?.totalPrice
													)}`}

													<sup>đ</sup>
												</span>
											</div>
											<div className='py-2 px-4 rounded-lg md:ml-16 text-center'>
												<button
													className='w-full h-[48px] mt-2 rounded bg-white hover:bg-primary-color '
													style={{
														border: '1px solid rgb(10, 104, 255)'
													}}
													onClick={() =>
														handleCancelOrder(order)
													}
												>
													<span className='text-primary-color text-base p-2 hover:text-white'>
														Hủy đơn
													</span>
												</button>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			</div>
		</Loading>
	);
};

export default MyOrder;

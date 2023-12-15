import { SendOutlined } from '@ant-design/icons';
import { Image } from 'antd';

import Loading from '../../components/Loading/LoadingComponent';
import { useLocation } from 'react-router-dom';
import { orderContant } from '../../contant';
import { convertPrice } from '../../utils';

const OrderSuccess = () => {
	const location = useLocation();
	const { state } = location;
	return (
		<>
			<Loading isPending={false}>
				<div className='p-4 bg-bg-color min-h-[100vh] max-h-full '>
					<div className='flex flex-col gap-3 mt-4 md:flex-row'>
						<div className='w-full'>
							<div className='bg-white rounded-lg flex flex-col p-4'>
								<h1 className='text-xl font-medium '>
									Đơn hàng đặt thành công
								</h1>

								<div className='mt-4 flex flex-col md:flex-row '>
									{state.orders?.map(order => {
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
														<span className='mx-1'>
															{`${
																orderContant
																	.delivery[
																	state
																		?.delivery
																]
															} - ${
																orderContant
																	.payment[
																	state
																		?.payment
																]
															}`}
														</span>
													</div>
												</div>
												<div className='flex items-center justify-between'>
													<div className='flex items-center ml-2'>
														<div className='max-w-full h-auto'>
															<Image
																src={
																	order?.image
																}
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
															<span className='mx-2'>
																{`GT: ${convertPrice(
																	order?.price
																)}`}
																<sup>đ</sup>
															</span>
														</div>
													</div>
													<div className='flex items-center '>
														<span className=' font-medium'>
															{`Tổng tiền - ${convertPrice(
																state?.totalPriceMemo
															)}`}

															<sup>đ</sup>
														</span>
													</div>
													<div
														className='py-2 px-4 rounded-lg hidden md:flex md:items-center ml-16'
														style={{
															background:
																'rgb(245, 245, 250)'
														}}
													>
														<div className='mr-2'>
															<SendOutlined />
														</div>
														<div className='flex flex-col'>
															<span>
																Được giao bởi
																TikiNOW Smart
															</span>
															<span>
																Logistics
															</span>
														</div>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</div>
				</div>
			</Loading>
		</>
	);
};

export default OrderSuccess;

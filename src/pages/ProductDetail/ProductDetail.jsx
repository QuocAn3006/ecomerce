import { useLocation, useNavigate, useParams } from 'react-router-dom';
import * as ProductService from '../../services/productService';
import { useQuery } from '@tanstack/react-query';
import { Image, InputNumber, Rate, message } from 'antd';
import {
	CheckCircleOutlined,
	MinusOutlined,
	PlusOutlined,
	SendOutlined
} from '@ant-design/icons';
import percent from '../../assets/img/percent.png';
import paylater from '../../assets/img/paylater.png';
import '../ProductDetail/ProductDetail.css';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	addOrderProduct,
	buyProduct,
	resetOrder
} from '../../redux/slide/orderSlide';
import Loading from '../../components/Loading/LoadingComponent';
const ProductDetail = () => {
	const { id } = useParams();
	const [numProduct, setNumProduct] = useState(1);
	const user = useSelector(state => state?.user);
	const order = useSelector(state => state?.order);
	const dispatch = useDispatch();
	const location = useLocation();
	const navigate = useNavigate();
	const fetchDetailProduct = async context => {
		const idProduct = context?.queryKey && context?.queryKey[1];
		if (idProduct) {
			const res = await ProductService.getDetailProduct(idProduct);
			return res?.data;
		}
	};

	const { data: productDetail, isPending } = useQuery({
		queryKey: ['product-detail', id],
		queryFn: fetchDetailProduct,
		enabled: !!id
	});

	const handleOnChangeValue = value => {
		setNumProduct(Number(value));
	};

	const handleOnChangeCount = (type, limited) => {
		if (type === 'increase') {
			if (!limited) {
				setNumProduct(numProduct + 1);
			}
		} else {
			if (!limited) {
				setNumProduct(numProduct - 1);
			}
		}
	};

	const handleAddProductToCart = () => {
		if (!user?.id) {
			navigate('/signin', { state: location?.pathname });
		} else {
			order?.orderItems?.filter(item => {
				if (item.product === id) {
					message.error('Đơn hàng đã tồn tại trong giỏ hàng');
				}
			});

			dispatch(
				addOrderProduct({
					orderItem: {
						userId: user?.id,
						name: productDetail?.name,
						amount: numProduct,
						image: productDetail?.image,
						price: productDetail.price,
						product: productDetail?._id
					}
				})
			);
		}
	};

	const handleBuyProduct = () => {
		if (!user?.id) {
			navigate('/signin', { state: location?.pathname });
		} else {
			dispatch(
				buyProduct({
					orderItem: {
						userId: user?.id,
						name: productDetail?.name,
						amount: numProduct,
						image: productDetail?.image,
						price: productDetail?.price,
						product: productDetail?._id
					}
				})
			);
			navigate('/payment');
		}
	};

	useEffect(() => {
		if (order.isSucessOrder) {
			message.success('Thêm vào giỏ hàng thành công');
		}
		return () => {
			dispatch(resetOrder());
		};
	}, [order.isSucessOrder]);

	return (
		<Loading isPending={isPending}>
			<div className='p-4 flex flex-col gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 lg:gap-6 bg-bg-color'>
				<div className='bg-white p-4 rounded-lg h-fit md:sticky md:top-[12px]'>
					<div className='flex justify-center items-center'>
						<div className='text-center'>
							<Image
								src={productDetail?.image}
								alt='product-detail'
								preview={false}
								style={{
									border: '1px solid rgb(235, 235, 240)',
									borderRadius: '8px',
									overflow: 'hidden',
									width: '340px',
									height: '340px',
									padding: '14px',
									textAlign: 'center'
								}}
							/>
						</div>
					</div>
					<h3 className='text-base font-semibold  mt-4'>
						Đặc điểm nổi bật
					</h3>
					<div>
						<div className='py-4'>
							<CheckCircleOutlined style={{ color: '#0a68ff' }} />
							<span className='ml-1'>
								Thiết kế thời trang, cầm nắm thoải mái
							</span>
						</div>

						<div className='py-4'>
							<CheckCircleOutlined style={{ color: '#0a68ff' }} />
							<span className='ml-1'>
								Thiết kế thời trang, cầm nắm thoải mái
							</span>
						</div>

						<div className='py-4'>
							<CheckCircleOutlined style={{ color: '#0a68ff' }} />
							<span className='ml-1'>
								Thiết kế thời trang, cầm nắm thoải mái
							</span>
						</div>
					</div>
				</div>
				<div className=''>
					<div className='rounded-lg bg-white p-4'>
						<h1
							style={{
								fontSize: '24px',
								fontWeight: '500',
								lineHeight: '150%',
								wordBreak: 'break-word',
								whiteSpace: 'break-spaces'
							}}
						>
							{productDetail?.name}
						</h1>

						<div>
							<div className='flex text-base my-3'>
								<span>{productDetail?.rating}</span>
								<div
									style={{
										color: 'rgb(255, 196, 0)',
										marginLeft: '6px',
										paddingRight: '8px',
										borderRight: '1px solid #000'
									}}
								>
									<Rate
										allowHalf
										disabled
										defaultValue={productDetail?.rating}
										value={productDetail?.rating}
										style={{
											fontSize: '13px'
										}}
									/>
								</div>
								<span
									style={{
										color: 'rgb(120, 120, 120)',
										paddingLeft: '8px'
									}}
								>
									Đã bán 23
								</span>
							</div>
						</div>

						<div
							style={{
								fontSize: '24px',
								fontWeight: '600',
								lineHeight: '150%',
								wordBreak: 'break-word',
								whiteSpace: 'break-spaces'
							}}
						>
							{productDetail?.price.toLocaleString()}
							<sup>đ</sup>
						</div>

						<div>
							<h3 className='text-base font-semibold  my-4'>
								Thông tin vận chuyển
							</h3>

							<div
								className='flex justify-between items-center pb-5'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>
									Giao đến Q. Hải Châu, P. Hải Châu I, Đà Nẵng
								</span>

								<span className='text-primary-color'>Đổi</span>
							</div>

							<div className='mt-5'>
								<div className='pb-2'>
									<SendOutlined />
									<span className='pl-2'>Giao Thứ Năm</span>
								</div>

								<span>Trước 19h, 45.000₫</span>
							</div>
						</div>
					</div>

					<div className='rounded-lg bg-white p-4 mt-4'>
						<h3 className='text-base font-semibold'>
							Thông tin bổ sung
						</h3>

						<div>
							<div
								className='flex justify-between items-center pb-4'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<div className='flex items-center mt-4'>
									<Image
										src={percent}
										alt='Giảm đến 400k với thẻ TiKiCard'
										width='40px'
										height='40px'
									/>
									<span className='ml-2'>
										Giảm đến 400k với thẻ TiKiCard
									</span>
								</div>
								<span className='text-primary-color cursor-pointer'>
									Đăng ký
								</span>
							</div>

							<div className='flex justify-between items-center pb-4'>
								<div className='flex items-center mt-4'>
									<Image
										src={paylater}
										alt='Mua trước trả sau'
										width='40px'
										height='40px'
									/>
									<span className='ml-2'>
										Mua trước trả sau
									</span>
								</div>
								<span className='text-primary-color cursor-pointer'>
									Đăng ký
								</span>
							</div>
						</div>
					</div>

					<div className='rounded-lg bg-white p-4 mt-4'>
						<h3 className='text-base font-semibold'>
							Thông tin chi tiết
						</h3>

						<div className='flex flex-col gap-2 mt-2'>
							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Sản phẩm có được bảo hành không</span>
								<span className='ml-8 '>Có</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Có thuế VAT</span>
								<span className='ml-8 '>Có</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Hình thức bảo hành</span>
								<span className='ml-8 '>Điện tử</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Thời gian bảo hành</span>
								<span className='ml-8 '>18</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Dung lượng pin</span>
								<span className='ml-8 '>5000 mAh</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Bluetooth</span>
								<span className='ml-8 '>Có</span>
							</div>

							<div
								className='pb-4 grid grid-cols-2'
								style={{
									borderBottom: '1px solid rgb(235, 235, 240)'
								}}
							>
								<span>Hỗ trợ thẻ nhớ ngoài</span>
								<span className='ml-8'>
									MicroSD, hỗ trợ tối đa 512 GB
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className='h-fit sticky top-[12px]'>
					<div className='rounded-lg bg-white p-4'>
						<h3 className='text-base font-semibold '>Tạm tính</h3>

						<h2 className='text-2xl mt-2 font-bold'>
							{(
								productDetail?.price * numProduct
							).toLocaleString()}
							<sup>đ</sup>
						</h2>

						<div className='flex flex-col gap-2'>
							<h3 className='text-base font-semibold mt-2'>
								Số lượng
							</h3>
							<div className='flex items-center gap-1 mt-2'>
								<button
									style={{
										width: '32px',
										height: '32px',
										backgroundColor: 'rgb(255, 255, 255)',
										border: '1px solid rgb(236, 236, 236)',
										borderRadius: '4px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer'
									}}
									onClick={() =>
										handleOnChangeCount(
											'decrease',
											numProduct === 1
										)
									}
								>
									<MinusOutlined
										style={{
											color: '#000',
											fontSize: '16px'
										}}
									/>
								</button>
								<InputNumber
									style={{
										border: '1px solid rgb(236, 236, 236)'
									}}
									className='w-[40px] h-[32px] flex items-center mx-1'
									size='small'
									value={numProduct}
									onChange={handleOnChangeValue}
									defaultValue={1}
									min={1}
									max={productDetail?.countInStock}
								/>
								<button
									style={{
										width: '32px',
										height: '32px',
										backgroundColor: 'rgb(255, 255, 255)',
										border: '1px solid rgb(236, 236, 236)',
										borderRadius: '4px',
										display: 'flex',
										alignItems: 'center',
										justifyContent: 'center',
										cursor: 'pointer'
									}}
									onClick={() =>
										handleOnChangeCount(
											'increase',
											numProduct ===
												productDetail?.countInStock
										)
									}
								>
									<PlusOutlined
										style={{
											color: '#000',
											fontSize: '16px'
										}}
									/>
								</button>
							</div>
							<button
								style={{
									background: 'rgb(255, 57, 69)',
									height: '48px',
									width: '100%',
									border: 'none',
									borderRadius: '4px',
									marginTop: '8px'
								}}
								onClick={() => handleBuyProduct()}
							>
								<span
									style={{ color: '#fff', fontSize: '16px' }}
								>
									Mua ngay
								</span>
							</button>

							<button
								onClick={() => handleAddProductToCart()}
								style={{
									background: 'rgb(255, 255, 255)',
									height: '48px',
									width: '100%',
									border: '1px solid rgb(10, 104, 255)',
									marginTop: '8px',
									borderRadius: '4px'
								}}
							>
								<span className='text-primary-color text-base'>
									Thêm vào giỏ
								</span>
							</button>
						</div>
					</div>
				</div>
			</div>
		</Loading>
	);
};

export default ProductDetail;

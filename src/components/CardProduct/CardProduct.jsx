import { Card } from 'antd';
import './CardProduct.css';
import { StarFilled } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const CardProduct = props => {
	const navigate = useNavigate();
	const handleNavigateProductDetail = id => {
		navigate(`/product-detail/${id}`);
	};
	const { name, image, rating, price, id, discount, selled, countInStock } =
		props;
	return (
		<Card
			onClick={() => handleNavigateProductDetail(id)}
			hoverable
			style={{ position: 'relative' }}
			bodyStyle={{ padding: '12px' }}
			cover={
				<img
					src={image}
					alt='card-item'
					style={{ padding: '12px' }}
				/>
			}
		>
			{countInStock === 0 && (
				<div className='absolute top-[-40%] left-0 right-0 bottom-0 flex justify-center items-center'>
					<div
						style={{ backgroundColor: 'rgba(0,0,0,.65)' }}
						className='text-white rounded-full max-w-[calc(100% - 5rem)] min-w-[3.875rem] h-[3.75rem] flex justify-center items-center'
					>
						<span>Hết hàng</span>
					</div>
				</div>
			)}
			<div className='font-medium text-[16px] line-clamp-2 h-[50px]'>
				{name}
			</div>
			<div className='flex items-center my-2 flex-nowrap'>
				<span className='pr-[5px]'>
					<span className='pr-[5px]'>{rating}</span>
					<StarFilled style={{ fontSize: '11px', color: 'yellow' }} />
				</span>
				<span> | Đã bán hơn {selled || 100}</span>
			</div>
			<div
				className='text-base font-medium'
				style={{ color: 'rgb(255, 57, 69)' }}
			>
				{price.toLocaleString()}
				<sup>đ</sup>
				<span className='text-sm pl-2'>-{discount}%</span>
			</div>
		</Card>
	);
};

export default CardProduct;

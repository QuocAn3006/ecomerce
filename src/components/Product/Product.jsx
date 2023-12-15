import CardProduct from '../CardProduct/CardProduct';
import lamdep from '../../assets/img/lamdep.webp';
import maytinh from '../../assets/img/maytinh.webp';
import mevabe from '../../assets/img/mevabe.webp';
import diengiadung from '../../assets/img/diengiadung.webp';
import thoitrangnam from '../../assets/img/thoitrangnam.webp';
import thoitrangnu from '../../assets/img/thoitrangnu.webp';

const Product = props => {
	const { products } = props;
	const arrNav = [
		{
			image: mevabe,
			label: 'Đồ chơi - Mẹ & Bé'
		},

		{
			image: maytinh,
			label: 'Điện thoại - Máy tính bảng'
		},

		{
			image: lamdep,
			label: 'Làm đẹp - Sức khỏe'
		},

		{
			image: diengiadung,
			label: 'Điện gia dụng'
		},

		{
			image: thoitrangnu,
			label: 'Thời trang nữ'
		},

		{
			image: thoitrangnam,
			label: 'Thời trang nam'
		}
	];

	return (
		<div className='w-full flex flex-nowrap'>
			<div className='mr-3 bg-white hidden lg:block lg:w-[22%] p-3 text-[16px] h-fit rounded-lg cursor-pointer'>
				<div className='hidden md:flex md:flex-col '>
					<h3>Danh mục</h3>

					{arrNav.map(item => {
						return (
							<div
								key={item.label}
								className='flex my-2 px-1 py-2 hover:bg-[#ccc] rounded-lg items-center'
							>
								<img
									src={item.image}
									alt='img-nav'
									width='32'
									height='32'
								/>
								<span>{item.label}</span>
							</div>
						);
					})}
				</div>
			</div>
			<div className='ml-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 gap-3 w-full'>
				{products?.data?.length > 0 &&
					products?.data?.map(product => {
						return (
							<CardProduct
								key={product?._id}
								name={product?.name}
								image={product?.image}
								rating={product?.rating}
								id={product?._id}
								type={product?.type}
								description={product?.description}
								price={product?.price}
								discount={product?.discount}
								selled={product?.selled}
								countInStock={product?.countInStock}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default Product;

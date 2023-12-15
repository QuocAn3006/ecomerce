import SliderSection from '../../Layouts/Slider/SliderSection';
import slide1 from '../../assets/img/slide1.jpg';
import slide2 from '../../assets/img/slide2.png';
import slide3 from '../../assets/img/slide3.jpg';
import Product from '../../components/Product/Product';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/productService';
const HomePage = () => {
	const fetchAllProduct = async () => {
		const res = await ProductService.getAllProduct();
		return res;
	};

	const { data: products } = useQuery({
		queryKey: ['products'],
		queryFn: fetchAllProduct,
		retry: 3,
		retryDelay: 1000,
		placeholderData: true
	});
	return (
		<div className='bg-bg-color p-4'>
			<SliderSection arrSlidersImg={[slide1, slide2, slide3]} />
			<Product products={products} />
		</div>
	);
};

export default HomePage;

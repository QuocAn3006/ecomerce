/* eslint-disable react/prop-types */
import Slider from 'react-slick';
import { Image } from 'antd';
import './SlideSection.css';
const SliderSection = ({ arrSlidersImg }) => {
	const settings = {
		dots: true,
		infinite: true,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		autoplay: true,
		autoplaySpeed: 3000
	};
	return (
		<Slider
			{...settings}
			className='mb-12'
		>
			{arrSlidersImg.map(item => {
				return (
					<Image
						key={item}
						src={item}
						alt='slider'
						preview={false}
						width='100%'
						height='300px'
					/>
				);
			})}
		</Slider>
	);
};

export default SliderSection;

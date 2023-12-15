/* eslint-disable react/prop-types */
import Header from './Header/Header';
const DefaultLayout = ({ children }) => {
	return (
		<div className=''>
			<Header />
			{children}
		</div>
	);
};

export default DefaultLayout;

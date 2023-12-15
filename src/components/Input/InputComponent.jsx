/* eslint-disable react/prop-types */
import { Input } from 'antd';

const InputComponent = ({ ref, size, placeholder, style, ...rest }) => {
	return (
		<Input
			ref={ref}
			size={size}
			placeholder={placeholder}
			style={style}
			{...rest}
		/>
	);
};

export default InputComponent;

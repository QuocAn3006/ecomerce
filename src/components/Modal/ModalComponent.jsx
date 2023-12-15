import { Modal } from 'antd';
import './ModalComponent.css';
const ModalComponent = ({
	title = 'Modal',
	isOpen = false,
	children,
	...rests
}) => {
	return (
		<Modal
			title={title}
			open={isOpen}
			{...rests}
			style={{ color: '#000' }}
		>
			{children}
		</Modal>
	);
};

export default ModalComponent;

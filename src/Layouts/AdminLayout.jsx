import HeaderAdmin from './HeaderAdmin/HeaderAdmin';

const AdminLayout = ({ children }) => {
	return (
		<div>
			<HeaderAdmin />
			{children}
		</div>
	);
};

export default AdminLayout;

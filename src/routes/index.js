import HomePage from '../pages/HomePage/Home';
import SigninPage from '../pages/SigninPage/SigninPage';
import SignupPage from '../pages/SignupPage/SignupPage';
import NotFoundPage from '../pages/NotFoundPage/NotFoundPage';
import ProfilePage from '../pages/ProfilePage/ProfilePage';
import ProductDetail from '../pages/ProductDetail/ProductDetail';
import AdminPage from '../pages/AdminPage/AdminPage';
import AdminLayout from '../Layouts/AdminLayout';
import PaymentPage from '../pages/PaymentPage/PaymentPage';
import CartPage from '../pages/CartPage/CartPage';
import OrderSuccess from '../pages/OrderSuccess/OrderSuccess';
export const routes = [
	{
		path: '/',
		page: HomePage
	},

	{
		path: '/signin',
		page: SigninPage,
		layout: null
	},

	{
		path: '/signup',
		page: SignupPage,
		layout: null
	},

	{
		path: '/profile',
		page: ProfilePage
	},

	{
		path: '/cart',
		page: CartPage
	},

	{
		path: '/order-success',
		page: OrderSuccess
	},

	{
		path: '/payment',
		page: PaymentPage
	},

	{
		path: '/product-detail/:id',
		page: ProductDetail
	},

	{
		path: '/system/admin',
		page: AdminPage,
		layout: AdminLayout
	},

	{ path: '*', page: NotFoundPage }
];

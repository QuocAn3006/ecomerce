import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { routes } from './routes/index';
import DefaultLayout from './Layouts/DefaultLayout';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isJsonString } from './utils';
import { jwtDecode } from 'jwt-decode';
import { resetUser, updateUser } from './redux/slide/userSlice';
import * as UserService from './services/userServices';
import Loading from './components/Loading/LoadingComponent';
function App() {
	const [isLoading, setIsLoading] = useState(false);
	const dispatch = useDispatch();
	const user = useSelector(state => state?.user);
	const handleDecoded = () => {
		let storageData =
			user?.access_token || localStorage.getItem('access_token');
		let decoded = {};
		if (storageData && isJsonString(storageData) && !user?.access_token) {
			storageData = JSON.parse(storageData);
			decoded = jwtDecode(storageData);
		}
		return { decoded, storageData };
	};

	const handleGetDetailsUser = async (id, token) => {
		let storageRefreshToken = localStorage.getItem('refresh_token');
		const refreshToken = JSON.parse(storageRefreshToken);
		const res = await UserService.getDetailUser(id, token);
		dispatch(
			updateUser({
				...res?.data,
				access_token: token,
				refreshToken
			})
		);
	};
	useEffect(() => {
		setIsLoading(true);
		const { decoded, storageData } = handleDecoded();
		if (decoded?.id) {
			handleGetDetailsUser(decoded?.id, storageData);
		}
		setIsLoading(false);
	}, []);

	UserService.axiosJWT.interceptors.request.use(
		async config => {
			const currentTime = new Date();
			const { decoded } = handleDecoded();
			let storageRefreshToken = localStorage.getItem('refresh_token');
			const refreshToken = JSON.parse(storageRefreshToken);
			const decodedRefreshToken = jwtDecode(refreshToken);
			if (decoded?.exp < currentTime.getTime() / 1000) {
				if (decodedRefreshToken?.exp > currentTime.getTime() / 1000) {
					const data = await UserService.refreshToken(refreshToken);
					config.headers['token'] = `Bearer ${data?.access_token}`;
				} else {
					dispatch(resetUser());
				}
			}
			return config;
		},
		err => {
			return Promise.reject(err);
		}
	);
	return (
		<Loading isPending={isLoading}>
			<Router>
				<Routes>
					{routes.map(route => {
						const Page = route.page;
						let Layout = DefaultLayout;
						if (route?.layout) {
							Layout = route.layout;
						} else if (route.layout === null) {
							Layout = Fragment;
						}

						return (
							<Route
								key={route.path}
								path={route.path}
								element={
									<Layout>
										<Page />
									</Layout>
								}
							/>
						);
					})}
				</Routes>
			</Router>
		</Loading>
	);
}

export default App;

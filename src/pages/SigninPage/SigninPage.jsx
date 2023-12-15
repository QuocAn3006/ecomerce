import { Image } from 'antd';
import logoLogin from '../../assets/img/logo-login.png';
import facebook from '../../assets/img/facebook.png';
import google from '../../assets/img/google.png';
import InputComponent from '../../components/Input/InputComponent';
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons';
import ButtonComponent from '../../components/Button/ButtonComponent';
import * as UserService from '../../services/userServices';
import { useMutationHook } from '../../hook/useMutationHook';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Loading from '../../components/Loading/LoadingComponent';
import { jwtDecode } from 'jwt-decode';
import { useDispatch } from 'react-redux';
import { updateUser } from '../../redux/slide/userSlice';

const SigninPage = () => {
	const [isShowPassword, setIsShowPassword] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const handleNavigateSignUp = () => {
		navigate('/signup');
	};

	const mutation = useMutationHook(data => UserService.login(data));

	const { data, isSuccess, isPending } = mutation;
	// isPending: isPendingLoginGoogle

	const handleLogin = () => {
		mutation.mutate({ email, password });
	};

	const handleGetDetailUser = async (id, token) => {
		const storage = localStorage.getItem('refresh_token');
		const refreshToken = JSON.parse(storage);
		const res = await UserService.getDetailUser(id, token);
		dispatch(
			updateUser({ ...res?.data, access_token: token, refreshToken })
		);
	};

	useEffect(() => {
		if (isSuccess) {
			if (data?.status === 'OK') {
				if (location?.state) {
					navigate(location?.state);
				} else {
					navigate('/');
				}
				localStorage.setItem(
					'access_token',
					JSON.stringify(data?.access_token)
				);
				localStorage.setItem(
					'refresh_token',
					JSON.stringify(data?.refresh_token)
				);

				if (data?.access_token) {
					const decoded = jwtDecode(data?.access_token);
					if (decoded?.id) {
						handleGetDetailUser(decoded?.id, data?.access_token);
					}
				}
			}
		}
	}, [isSuccess]);

	return (
		<div
			style={{
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				background: 'rgba(0,0,0,0.53)',
				height: '100vh'
			}}
		>
			<div
				style={{
					width: '800px',
					height: 'fitContent',
					borderRadius: '8px',
					background: '#fff',
					display: 'flex'
				}}
			>
				<div className='flex-1 px-[45px] pt-[40px] pb-[24px] flex flex-col gap-4 text-[16px]'>
					<h1>Xin Chào</h1>
					<p>Đăng nhập hoặc tạo tài khoản</p>
					<InputComponent
						placeholder='email'
						size='large'
						type='text'
						value={email}
						onChange={e => setEmail(e.target.value)}
					/>
					<div style={{ position: 'relative' }}>
						<span
							style={{
								zIndex: 10,
								position: 'absolute',
								top: '7px',
								right: '8px'
							}}
							onClick={() => setIsShowPassword(!isShowPassword)}
						>
							{isShowPassword ? (
								<EyeFilled style={{ fontSize: '14px' }} />
							) : (
								<EyeInvisibleFilled
									style={{ fontSize: '14px' }}
								/>
							)}
						</span>
						<InputComponent
							placeholder='password'
							size='large'
							value={password}
							onChange={e => setPassword(e.target.value)}
							type={isShowPassword ? 'text' : 'password'}
						/>
					</div>

					<Loading isPending={isPending}>
						<ButtonComponent
							disabled={!email.length || !password.length}
							onClick={handleLogin}
							size={40}
							styleButton={{
								background: 'rgb(255, 57, 69)',
								height: '48px',
								width: '100%',
								border: 'none',
								borderRadius: '4px',
								margin: '26px 0 10px'
							}}
							textButton={'Đăng nhập'}
							styleTextButton={{
								color: '#fff',
								fontSize: '16px'
							}}
						></ButtonComponent>
					</Loading>
					{data?.status === 'ERR' && (
						<span className='text-err-color'>{data?.message}</span>
					)}
					<div>
						<p className='relative text-center mb-4 before:content-[""] before:w-full before:h-[1px] before:absolute before:left-0 before:top-[50%] before:translate-y-[-50%] before:bg-[#ccc] before:z-[1]'>
							<span className='relative z-[2] text-[#ccc] text-[15px] bg-white py-0 px-[20px] inline-block'>
								Hoặc tiếp tục bằng
							</span>
						</p>

						<div className='flex items-center justify-center cursor-pointer'>
							<div>
								<img
									src={facebook}
									alt='facebook-logo'
									width={46}
									className='mr-4'
								/>
							</div>
							<div>
								<img
									src={google}
									alt='facebook-logo'
									width={46}
								/>
							</div>
						</div>
					</div>

					<p className='text-sm text-primary-color'>Quên mật khẩu</p>
					<p className='text-sm'>
						Bạn chưa có tài khoản{' '}
						<span
							className='text-primary-color text-sm cursor-pointer'
							onClick={handleNavigateSignUp}
						>
							Tạo tài khoản
						</span>
					</p>
				</div>

				<div className='w-[300px] bg-white flex items-center justify-center gap-6 flex-col'>
					<Image
						src={logoLogin}
						preview={false}
						alt='image-logo'
						width='203px'
						height='203px'
					/>
					<h4>Đăng nhập để mua sắm ngay</h4>
				</div>
			</div>
		</div>
	);
};

export default SigninPage;

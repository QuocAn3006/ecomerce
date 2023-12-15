import { useDispatch, useSelector } from 'react-redux';
import ava from '../../assets/img/avatar.png';
import edit from '../../assets/img/edit.png';
import ButtonComponent from '../../components/Button/ButtonComponent';
import InputComponent from '../../components/Input/InputComponent';
import ModalComponent from '../../components/Modal/ModalComponent';
import './AccountDetail.css';
import Loading from '../../components/Loading/LoadingComponent';
import { useEffect, useState } from 'react';
import * as UserService from '../../services/userServices';
import { useMutationHook } from '../../hook/useMutationHook';
import { updateUser } from '../../redux/slide/userSlice';
import { getBase64 } from '../../utils';
import { Upload, message } from 'antd';

const AccountDetail = () => {
	const user = useSelector(state => state?.user);
	const dispatch = useDispatch();
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [address, setAddress] = useState('');
	const [avatar, setAvatar] = useState('');
	const [imageSrc, setImageSrc] = useState(null);
	const [isModalEditAva, setIsModalEditAva] = useState(false);

	const mutation = useMutationHook(data => {
		const { id, access_token, ...rests } = data;
		UserService.updateUser(id, rests, access_token);
	});

	const { isPending, isSuccess, data: dataUpdateUser, isError } = mutation;

	useEffect(() => {
		setName(user?.name);
		setEmail(user?.email);
		setPhone(user?.phone);
		setAddress(user?.address);
		setAvatar(user?.avatar);
	}, [user]);

	useEffect(() => {
		if (isSuccess && dataUpdateUser?.status === 'OK') {
			message.success('cập nhật thành công');
			handleGetDetailUser(user?.id, user?.access_token);
		} else if (isError) {
			message.error('cập nhật thất bại');
		}
	}, [isSuccess, isError]);

	const handleGetDetailUser = async (id, token) => {
		const res = await UserService.getDetailUser(id, token);
		dispatch(updateUser({ ...res?.data, access_token: token }));
	};

	const handleOnChangeAva = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setIsModalEditAva(true);
		setImageSrc(file.preview);
	};

	const handleChangeAvaSubmit = () => {
		setAvatar(imageSrc);
		setIsModalEditAva(false);
	};

	const handleUpdate = () => {
		mutation.mutate({
			id: user?.id,
			name,
			email,
			phone,
			address,
			avatar,
			access_token: user?.access_token
		});
	};
	return (
		<div className='flex flex-col items-center justify-center'>
			<span className='text-base font-normal text-[#ccc]'>
				Thông tin cá nhân
			</span>
			<Loading isPending={isPending}>
				<div className='mt-4'>
					<div className='flex flex-row'>
						<div className='mr-4 flex justify-center items-center relative'>
							{user?.avatar ? (
								<div className='rounded-full w-[112px] h-[112px] flex justify-center items-center cursor-pointer'>
									<img
										src={avatar}
										alt='ava'
										style={{
											borderRadius: '50%',
											overflow: 'hidden',
											width: '100%',
											height: '100%'
										}}
									/>
								</div>
							) : (
								<div className='rounded-full w-[112px] h-[112px] flex justify-center items-center cursor-pointer border-[4px] border-primary-color'>
									<img
										src={ava}
										alt='ava'
										width='50px'
										height='50px'
									/>
								</div>
							)}
							<Upload
								className='absolute w-4 h-4 bg-[#64646d] rounded-xl right-[8px] bottom-[98px] flex justify-center items-center'
								onChange={handleOnChangeAva}
								maxCount={1}
							>
								<img
									src={edit}
									alt='edit'
									width='10px'
									height='10px'
								/>
							</Upload>
						</div>

						<div className='w-full flex flex-col justify-between'>
							<div className='flex items-center mb-8'>
								<label className='w-[80px] min-w-[80px] text-sm ml-4'>
									Họ & Tên
								</label>
								<div className='flex items-center flex-1'>
									<InputComponent
										placeholder='Username'
										size='large'
										value={name}
										onChange={e => setName(e.target.value)}
									/>
									<ButtonComponent
										onClick={handleUpdate}
										size={40}
										styleButton={{
											height: '30px',
											width: 'fit-content',
											borderRadius: '4px',
											padding: '2px 6px 6px',
											marginLeft: '4px'
										}}
										textButton={'Cập nhật'}
										styleTextButton={{
											color: 'rgb(26, 148, 255)'
										}}
									></ButtonComponent>
								</div>
							</div>

							<div className='flex items-center mb-8'>
								<label className='w-[80px] min-w-[80px] text-sm ml-4'>
									Email
								</label>
								<div className='flex items-center flex-1'>
									<InputComponent
										placeholder='abc@gmail.com'
										size='large'
										value={email}
										onChange={e => setEmail(e.target.value)}
									/>
									<ButtonComponent
										onClick={handleUpdate}
										size={40}
										styleButton={{
											height: '30px',
											width: 'fit-content',
											borderRadius: '4px',
											padding: '2px 6px 6px',
											marginLeft: '4px'
										}}
										textButton={'Cập nhật'}
										styleTextButton={{
											color: 'rgb(26, 148, 255)'
										}}
									></ButtonComponent>
								</div>
							</div>

							<div className='flex items-center mb-8'>
								<label className='w-[80px] min-w-[80px] text-sm ml-4'>
									Số điện thoại
								</label>
								<div className='flex items-center flex-1'>
									<InputComponent
										placeholder='phone number'
										size='large'
										value={phone}
										onChange={e => setPhone(e.target.value)}
									/>
									<ButtonComponent
										onClick={handleUpdate}
										size={40}
										styleButton={{
											height: '30px',
											width: 'fit-content',
											borderRadius: '4px',
											padding: '2px 6px 6px',
											marginLeft: '4px'
										}}
										textButton={'Cập nhật'}
										styleTextButton={{
											color: 'rgb(26, 148, 255)'
										}}
									></ButtonComponent>
								</div>
							</div>

							<div className='flex items-center mb-8'>
								<label className='w-[80px] min-w-[80px] text-sm ml-4'>
									Địa chỉ
								</label>
								<div className='flex items-center flex-1'>
									<InputComponent
										placeholder='Address'
										size='large'
										value={address}
										onChange={e =>
											setAddress(e.target.value)
										}
									/>
									<ButtonComponent
										onClick={handleUpdate}
										size={40}
										styleButton={{
											height: '30px',
											width: 'fit-content',
											borderRadius: '4px',
											padding: '2px 6px 6px',
											marginLeft: '4px'
										}}
										textButton={'Cập nhật'}
										styleTextButton={{
											color: 'rgb(26, 148, 255)'
										}}
									></ButtonComponent>
								</div>
							</div>
						</div>
					</div>
				</div>

				<ButtonComponent
					size={40}
					styleButton={{
						background: 'rgb(11, 116, 229)',
						height: '48px',
						width: '100%',
						border: 'none',
						borderRadius: '4px',
						margin: '26px 0 10px'
					}}
					textButton={'Lưu thay đổi'}
					styleTextButton={{
						color: '#fff',
						fontSize: '16px'
					}}
				></ButtonComponent>
			</Loading>

			<ModalComponent
				title='Cập nhật ảnh đại diện'
				open={isModalEditAva}
				footer={null}
			>
				<div>
					<div className='h-[300px] flex justify-center'>
						<div className='w-[300px] h-[300px] relative overflow-hidden mt-4 rounded-full'>
							<div
								style={{
									width: '400px',
									height: '400px',
									cursor: 'grab',
									transform: 'translate(-50px, -50px)',
									touchAction: 'none'
								}}
							>
								<img
									src={imageSrc}
									alt='image-edit'
									style={{
										width: '100%',
										height: '100%',
										objectFit: 'cover'
									}}
								/>
							</div>
						</div>
					</div>
					<div className='mt-4 flex gap-2'>
						<button
							className='w-[50%] h-[48px] mt-2 rounded bg-white  '
							style={{
								border: '1px solid rgb(10, 104, 255)'
							}}
						>
							<span className='text-primary-color text-base p-2 '>
								Huỷ bỏ
							</span>
						</button>

						<button
							onClick={handleChangeAvaSubmit}
							className='w-[50%] h-[48px] mt-2 rounded bg-primary-color '
							style={{
								border: '1px solid rgb(10, 104, 255)'
							}}
						>
							<span className=' text-base p-2 text-white'>
								Lưu thay đổi
							</span>
						</button>
					</div>
				</div>
			</ModalComponent>
		</div>
	);
};

export default AccountDetail;

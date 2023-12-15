import { useEffect, useRef, useState } from 'react';
import * as UserService from '../../services/userServices';
import { useQuery } from '@tanstack/react-query';
import InputComponent from '../Input/InputComponent';
import { Button, Form, Space, Upload, message } from 'antd';
import {
	DeleteOutlined,
	EditOutlined,
	SearchOutlined,
	UploadOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import TableComponent from '../Table/TableComponent';
import DrawerComponent from '../Drawer/DrawerComponent';
import Loading from '../Loading/LoadingComponent';
import { getBase64 } from '../../utils';
import { useMutationHook } from '../../hook/useMutationHook';
import ModalComponent from '../Modal/ModalComponent';
const UserAdmin = () => {
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
	const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
	const [rowSelected, setRowSelected] = useState('');
	const searchInput = useRef(null);

	const [stateUserDetail, setStateUserDetail] = useState({
		name: '',
		email: '',
		phone: '',
		isAdmin: false,
		avatar: '',
		address: ''
	});
	const [form] = Form.useForm();
	const user = useSelector(state => state?.user);

	const getAllUser = async () => {
		const res = await UserService.getAllUser(user?.access_token);
		return res;
	};

	const queryUsers = useQuery({
		queryKey: ['users'],
		queryFn: getAllUser
	});

	const { data: users, isPending: isLoadingUser } = queryUsers;

	const handleOnChangeDetails = e => {
		setStateUserDetail({
			...stateUserDetail,
			[e.target.name]: e.target.value
		});
	};

	const handleOnchangeAvatarDetails = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateUserDetail({
			...stateUserDetail,
			avatar: file.preview
		});
	};

	// mutation update user
	const mutationUpdate = useMutationHook(data => {
		const { id, token, ...rests } = data;
		const res = UserService.updateUser(id, { ...rests }, token);
		return res;
	});

	const fetchGetUserDetail = async id => {
		const res = await UserService.getDetailUser(id);
		setIsLoadingUpdate(true);
		if (res?.data) {
			setStateUserDetail({
				name: res?.data?.name,
				email: res?.data?.email,
				isAdmin: res?.data?.isAdmin,
				phone: res?.data?.phone,
				avatar: res?.data?.avatar,
				address: res?.data?.address
			});
		}
		setIsLoadingUpdate(false);
	};

	const onUpdateUser = () => {
		mutationUpdate.mutate(
			{
				id: rowSelected,
				token: user?.access_token,
				...stateUserDetail
			},
			{
				onSettled: () => {
					queryUsers.refetch();
				}
			}
		);
	};
	const {
		data: dataUpdated,
		isPending: isLoadingUpdated,
		isSuccess: isSuccessUpdated,
		isError: isErrorUpdated
	} = mutationUpdate;

	useEffect(() => {
		if (isSuccessUpdated && dataUpdated?.status === 'OK') {
			message.success('Cập nhật thông tin thành công');
			handleCancelDrawer();
		} else if (isErrorUpdated && dataUpdated?.status === 'ERR') {
			message.error('Cập nhật thông tin thất bại');
		}
	}, [isSuccessUpdated, isErrorUpdated]);

	// mutation delete user

	const mutationDelete = useMutationHook(data => {
		const { id, token } = data;
		const res = UserService.deleteUser(id, token);
		return res;
	});

	const handleDeleteUser = () => {
		mutationDelete.mutate(
			{ id: rowSelected, token: user?.access_token },
			{ onSettled: () => queryUsers.refetch() }
		);
	};

	const {
		data: dataDelete,
		isPending: isLoadingDelete,
		isError: isErrorDelete,
		isSuccess: isSuccessDelete
	} = mutationDelete;

	useEffect(() => {
		if (isSuccessDelete && dataDelete?.status === 'OK') {
			message.success('xóa người dùng thành công');
			setIsModalOpenDelete(false);
		} else if (isErrorDelete && dataDelete?.status === 'ERR') {
			message.error('Xóa người dùng thất bại');
		}
	}, [isSuccessDelete, isErrorDelete]);

	useEffect(() => {
		if (rowSelected) {
			setIsLoadingUpdate(true);
			fetchGetUserDetail(rowSelected);
		}
	}, [rowSelected]);

	useEffect(() => {
		form.setFieldsValue(stateUserDetail);
	}, [form, stateUserDetail]);

	const handleSearch = confirm => {
		confirm();
	};

	const handleCancelDrawer = () => {
		setIsOpenDrawer(false);
		setStateUserDetail({
			name: '',
			email: '',
			phone: '',
			isAdmin: false,
			address: '',
			avatar: ''
		});
		form.resetFields();
	};
	const handleReset = clearFilters => {
		clearFilters();
	};
	const getColumnSearchProps = dataIndex => ({
		filterDropdown: ({
			setSelectedKeys,
			selectedKeys,
			confirm,
			clearFilters,
			close
		}) => (
			<div
				style={{
					padding: 8
				}}
				onKeyDown={e => e.stopPropagation()}
			>
				<InputComponent
					ref={searchInput}
					placeholder={`Search ${dataIndex}`}
					value={selectedKeys[0]}
					onChange={e =>
						setSelectedKeys(e.target.value ? [e.target.value] : [])
					}
					onPressEnter={() =>
						handleSearch(selectedKeys, confirm, dataIndex)
					}
					style={{
						marginBottom: 8,
						display: 'block'
					}}
				/>
				<Space>
					<Button
						type='primary'
						onClick={() =>
							handleSearch(selectedKeys, confirm, dataIndex)
						}
						icon={<SearchOutlined />}
						size='small'
						style={{
							width: 90
						}}
					>
						Search
					</Button>
					<Button
						onClick={() =>
							clearFilters && handleReset(clearFilters)
						}
						size='small'
						style={{
							width: 90
						}}
					>
						Reset
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							confirm({
								closeDropdown: false
							});
						}}
					>
						Filter
					</Button>
					<Button
						type='link'
						size='small'
						onClick={() => {
							close();
						}}
					>
						close
					</Button>
				</Space>
			</div>
		),
		filterIcon: filtered => (
			<SearchOutlined
				style={{
					color: filtered ? '#1677ff' : undefined
				}}
			/>
		),
		onFilter: (value, record) =>
			record[dataIndex]
				.toString()
				.toLowerCase()
				.includes(value.toLowerCase()),
		onFilterDropdownOpenChange: visible => {
			if (visible) {
				setTimeout(() => searchInput.current?.select(), 100);
			}
		}
	});
	const renderAction = () => {
		return (
			<div>
				<EditOutlined
					style={{
						color: '#dcbf12',
						fontSize: '24px',
						marginRight: '8px',
						cursor: 'pointer'
					}}
					onClick={() => setIsOpenDrawer(true)}
				/>
				<DeleteOutlined
					style={{
						color: 'red',
						fontSize: '24px',
						cursor: 'pointer'
					}}
					onClick={() => setIsModalOpenDelete(true)}
				/>
			</div>
		);
	};
	const columns = [
		{
			title: 'Name',
			dataIndex: 'name',
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps('name')
		},

		{
			title: 'Email',
			dataIndex: 'email',
			sorter: (a, b) => a.name.length - b.name.length,
			...getColumnSearchProps('name')
		},

		{
			title: 'Address',
			dataIndex: 'address',
			sorter: (a, b) => a.address.length - b.address.length,
			...getColumnSearchProps('address')
		},

		{
			title: 'Phone',
			dataIndex: 'phone',
			...getColumnSearchProps('isAdmin')
		},
		{
			title: 'Admin',
			dataIndex: 'isAdmin',
			filters: [
				{
					text: 'True',
					value: true
				},
				{
					text: 'False',
					value: false
				}
			]
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction
		}
	];
	const dataTable =
		users?.data?.length > 0 &&
		users?.data?.map(userData => {
			return {
				...userData,
				key: userData?._id,
				isAdmin: userData?.isAdmin ? 'True' : 'False'
			};
		});
	return (
		<div>
			<h1>Quản lý người dùng</h1>

			<div className='mt-5'>
				<TableComponent
					columns={columns}
					dataTable={dataTable}
					isLoading={isLoadingUser}
					onRow={record => {
						return {
							onClick: () => {
								setRowSelected(record?._id);
							} // click row
						};
					}}
				/>
			</div>

			<DrawerComponent
				forceRender
				title='Thông tin người dùng'
				isOpen={isOpenDrawer}
				onClose={() => setIsOpenDrawer(false)}
				width='600px'
			>
				<Loading isPending={isLoadingUpdate || isLoadingUpdated}>
					<Form
						name='basic'
						labelCol={{
							span: 6
						}}
						wrapperCol={{
							span: 18
						}}
						style={{
							maxWidth: 600
						}}
						onFinish={onUpdateUser}
						autoComplete='on'
						form={form}
					>
						{/* name */}
						<Form.Item
							label='Name'
							name='name'
							rules={[
								{
									required: true,
									message: 'Please input your name product!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.name}
								onChange={handleOnChangeDetails}
								name='name'
							/>
						</Form.Item>

						{/* email */}
						<Form.Item
							label='Email'
							name='email'
							rules={[
								{
									required: true,
									message: 'Please input your email!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.email}
								onChange={handleOnChangeDetails}
								name='email'
							/>
						</Form.Item>

						{/* phone */}
						<Form.Item
							label='Phone'
							name='phone'
							rules={[
								{
									required: true,
									message: 'Please input your phone!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.phone}
								onChange={handleOnChangeDetails}
								name='phone'
							/>
						</Form.Item>

						{/* isAdmin */}
						<Form.Item
							label='Is Admin'
							name='isAdmin'
							rules={[
								{
									required: true,
									message: 'Please input your isAdmin!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.isAdmin}
								onChange={handleOnChangeDetails}
								name='isAdmin'
							/>
						</Form.Item>

						{/* address */}
						<Form.Item
							label='Address'
							name='address'
							rules={[
								{
									required: true,
									message: 'Please input your address!'
								}
							]}
						>
							<InputComponent
								value={stateUserDetail?.address}
								onChange={handleOnChangeDetails}
								name='address'
							/>
						</Form.Item>

						{/* image */}
						<Form.Item
							label='Image'
							name='image'
							rules={[
								{
									required: true,
									message: 'Please input your Image!'
								}
							]}
						>
							<div className='wrapperInput'>
								<Upload
									onChange={handleOnchangeAvatarDetails}
									maxCount={1}
									className='uploadFile'
								>
									<Button icon={<UploadOutlined />}>
										Upload
									</Button>
								</Upload>
								{stateUserDetail?.avatar && (
									<img
										src={stateUserDetail?.avatar}
										alt='avatar'
										style={{
											height: '60px',
											width: '60px',
											borderRadius: '50%',
											objectFit: 'cover',
											marginLeft: '10px'
										}}
									/>
								)}
							</div>
						</Form.Item>

						<Form.Item
							wrapperCol={{
								offset: 8,
								span: 16
							}}
						>
							<Button
								type='primary'
								htmlType='submit'
								style={{
									color: '#000',
									border: '1px solid rgb(235, 235, 240)'
								}}
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponent>

			<ModalComponent
				title='Xóa sản phẩm'
				open={isModalOpenDelete}
				onCancel={() => setIsModalOpenDelete(false)}
				onOk={handleDeleteUser}
			>
				<Loading isPending={isLoadingDelete}>
					<div>Bạn có muốn xóa người dùng này không</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default UserAdmin;

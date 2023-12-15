import {
	DeleteOutlined,
	EditOutlined,
	PlusOutlined,
	SearchOutlined,
	UploadOutlined
} from '@ant-design/icons';
import { Button, Form, Select, Space, Upload, message } from 'antd';
import TableComponent from '../Table/TableComponent';
import InputComponent from '../Input/InputComponent';
import { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import * as ProductService from '../../services/productService';
import ModalComponent from '../Modal/ModalComponent';
import DrawerComponet from '../Drawer/DrawerComponent';
import Loading from '../Loading/LoadingComponent';
import { useForm } from 'antd/es/form/Form';
import { useMutationHook } from '../../hook/useMutationHook';
import { getBase64, renderOptions } from '../../utils';
import { useSelector } from 'react-redux';

const ProductAdmin = () => {
	const user = useSelector(state => state?.user);
	const searchInput = useRef(null);
	const [rowSelected, setRowSelected] = useState('');
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
	const [isOpenDrawer, setIsOpenDrawer] = useState(false);
	const [isLoadingUpdated, setIsLoadingUpdated] = useState(false);

	const [form] = useForm();
	const initial = () => ({
		name: '',
		price: '',
		description: '',
		discount: '',
		rating: '',
		image: '',
		type: '',
		countInStock: '',
		newType: ''
	});
	const [stateProduct, setStateProduct] = useState(initial());
	const [stateProductDetail, setStateProductDetail] = useState(initial());
	// handle event
	const handleCancel = () => {
		setIsModalOpen(false);
		setStateProduct({
			name: '',
			price: '',
			description: '',
			rating: '',
			image: '',
			type: '',
			countInStock: '',
			newType: ''
		});
		form.resetFields();
	};

	const handleCancelDrawer = () => {
		setIsOpenDrawer(false);
		setStateProductDetail({
			name: '',
			price: '',
			description: '',
			rating: '',
			image: '',
			type: '',
			countInStock: ''
		});
		form.resetFields();
	};

	const handleCancelDelete = () => {
		setIsModalDeleteOpen(false);
	};

	const handleOnChange = e => {
		setStateProduct({
			...stateProduct,
			[e.target.name]: e.target.value
		});
	};

	const handleOnChangeDetails = e => {
		setStateProductDetail({
			...stateProductDetail,
			[e.target.name]: e.target.value
		});
	};

	const handleOnchangeAvatarDetails = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProductDetail({
			...stateProductDetail,
			image: file.preview
		});
	};

	// mutation create product
	const mutation = useMutationHook(data => {
		const {
			name,
			image,
			type,
			discount,
			price,
			countInStock,
			rating,
			description
		} = data;
		const res = ProductService.createProduct({
			name,
			price,
			discount,
			description,
			rating,
			image,
			type,
			countInStock
		});
		return res;
	});

	const onFinish = () => {
		const params = {
			name: stateProduct?.name,
			image: stateProduct?.image,
			countInStock: stateProduct?.countInStock,
			description: stateProduct?.description,
			discount: stateProduct?.discount,
			price: stateProduct?.price,
			rating: stateProduct?.rating,
			type:
				stateProduct?.type === 'add_type'
					? stateProduct?.newType
					: stateProduct?.type
		};
		mutation.mutate(params, {
			onSettled: () => {
				queryProducts.refetch();
			}
		});
	};
	const handleOnchangeAvatar = async ({ fileList }) => {
		const file = fileList[0];
		if (!file.url && !file.preview) {
			file.preview = await getBase64(file.originFileObj);
		}
		setStateProduct({
			...stateProduct,
			image: file.preview
		});
	};

	const handleChangeSeclect = value => {
		setStateProduct({
			...stateProduct,
			type: value
		});
	};
	const { data, isPending, isSuccess, isError } = mutation;

	useEffect(() => {
		if (isSuccess && data?.status === 'OK') {
			message.success('Thêm sản phẩm thành công');
			handleCancel();
		} else if (isError) {
			message.error('Thêm sản phẩm thất bại');
		}
	}, [isSuccess, isError]);

	// mutation update product
	const mutationUpdate = useMutationHook(data => {
		const { id, token, ...rests } = data;
		const res = ProductService.updateProduct(id, token, { ...rests });
		return res;
	});

	const fetchGetProductDetail = async id => {
		const res = await ProductService.getDetailProduct(id);
		setIsLoadingUpdated(true);
		if (res?.data) {
			setStateProductDetail({
				name: res?.data?.name,
				price: res?.data?.price,
				description: res?.data?.description,
				rating: res?.data?.rating,
				discount: res?.data?.discount,
				image: res?.data?.image,
				type: res?.data?.type,
				countInStock: res?.data?.countInStock
			});
		}
		setIsLoadingUpdated(false);
	};
	const onUpdateProduct = () => {
		mutationUpdate.mutate(
			{
				id: rowSelected,
				token: user?.access_token,
				...stateProductDetail
			},
			{
				onSettled: () => {
					queryProducts.refetch();
				}
			}
		);
	};
	const {
		data: dataUpdate,
		isPending: isLoadingUpdate,
		isSuccess: isSuccessUpdate,
		isError: isErrorUpdate
	} = mutationUpdate;
	useEffect(() => {
		if (isSuccessUpdate && dataUpdate?.status === 'OK') {
			message.success('Sửa sản phẩm thành công');
			handleCancelDrawer();
		} else if (isError && dataUpdate?.status === 'ERR') {
			message.error('Sửa sản phẩm thất bại');
		}
	}, [isSuccessUpdate, isErrorUpdate]);

	useEffect(() => {
		if (rowSelected) {
			setIsLoadingUpdated(true);
			fetchGetProductDetail(rowSelected);
		}
	}, [isOpenDrawer, rowSelected]);

	useEffect(() => {
		if (!isModalOpen) {
			form.setFieldsValue(stateProductDetail);
		} else {
			form.setFieldsValue(initial());
		}
	}, [isModalOpen, stateProductDetail, form]);

	// mutation delete product
	const mutationDelete = useMutationHook(data => {
		const { id, token } = data;
		const res = ProductService.deleteProduct(id, token);
		return res;
	});

	const {
		data: dataDelete,
		isPending: isLoadingDelete,
		isSuccess: isSuccessDelete,
		isError: isErrorDelete
	} = mutationDelete;

	const handleDeleteProduct = () => {
		mutationDelete.mutate(
			{ id: rowSelected, token: user?.access_token },
			{
				onSettled: () => {
					queryProducts.refetch();
				}
			}
		);
	};
	useEffect(() => {
		if (isSuccess && dataDelete?.status === 'OK') {
			message.success('Xoá sản phẩm thành công');
			handleCancelDelete();
		} else if (isErrorDelete && dataDelete?.status === 'ERR') {
			message.error('Xoá sản phẩm thất bại');
		}
	}, [isSuccessDelete, isErrorDelete]);

	const getAllProduct = async () => {
		const res = await ProductService.getAllProduct();
		return res;
	};

	const getAllType = async () => {
		const res = await ProductService.getAllType();
		return res;
	};

	const queryProducts = useQuery({
		queryKey: ['products'],
		queryFn: getAllProduct
	});

	const queryTypeProducts = useQuery({
		queryKey: ['type-product'],
		queryFn: getAllType
	});

	const { data: products, isLoading: isLoadingProducts } = queryProducts;
	const handleSearch = confirm => {
		confirm();
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
						marginRight: '10px',
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
					onClick={() => setIsModalDeleteOpen(true)}
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
			title: 'Price',
			dataIndex: 'price',
			sorter: (a, b) => a.price - b.price,
			filters: [
				{
					text: '>= 50',
					value: '>='
				},
				{
					text: '<= 50',
					value: '<='
				}
			],

			onFilter: (value, record) => {
				if (value === '>=') {
					return record.price >= 50;
				} else return record.price <= 50;
			}
		},
		{
			title: 'Type',
			dataIndex: 'type'
		},

		{
			title: 'Rating',
			dataIndex: 'rating',
			sorter: (a, b) => a.rating - b.rating,
			filters: [
				{
					text: '>= 3',
					value: '>='
				},
				{
					text: '<= 3',
					value: '<='
				}
			],

			onFilter: (value, record) => {
				if (value === '>=') {
					return Number(record.rating >= 3);
				} else return Number(record.rating <= 3);
			}
		},
		{
			title: 'Action',
			dataIndex: 'action',
			render: renderAction
		}
	];
	const dataTable =
		products?.data?.length > 0 &&
		products?.data?.map(product => {
			return { ...product, key: product?._id };
		});
	return (
		<div>
			<h1>Quản lý sản phẩm</h1>
			<div className='mt-3'>
				<Button
					className='flex items-center'
					onClick={() => setIsModalOpen(true)}
				>
					<PlusOutlined />
					{' Add product'}
				</Button>
			</div>

			<div className='mt-5'>
				<TableComponent
					columns={columns}
					dataTable={dataTable}
					isLoading={isLoadingProducts}
					onRow={record => {
						return {
							onClick: () => {
								setRowSelected(record?._id);
							} // click row
						};
					}}
				/>
			</div>

			<ModalComponent
				forceRender
				title='Tạo sản phẩm mới'
				open={isModalOpen}
				footer={null}
				onCancel={handleCancel}
			>
				<Loading isPending={isPending}>
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
						onFinish={onFinish}
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
								value={stateProduct.name}
								onChange={handleOnChange}
								name='name'
							/>
						</Form.Item>

						{/* type */}
						<Form.Item
							label='Type'
							name='type'
							rules={[
								{
									required: true,
									message: 'Please input your Type!'
								}
							]}
						>
							<Select
								name='type'
								value={stateProduct.type}
								onChange={handleChangeSeclect}
								options={renderOptions(
									queryTypeProducts?.data?.data
								)}
							/>
						</Form.Item>
						{stateProduct.type === 'add_type' && (
							<Form.Item
								label='New Type'
								name='newType'
								rules={[
									{
										required: true,
										message: 'Please input your type!'
									}
								]}
							>
								<InputComponent
									value={stateProduct.newType}
									onChange={handleOnChange}
									name='newType'
								/>
							</Form.Item>
						)}
						{/* count in stock */}
						<Form.Item
							label='Count in stock'
							name='countInStock'
							rules={[
								{
									required: true,
									message: 'Please input your countInStock!'
								}
							]}
						>
							<InputComponent
								value={stateProduct.countInStock}
								onChange={handleOnChange}
								name='countInStock'
							/>
						</Form.Item>

						{/* discount */}
						<Form.Item
							label='Discount'
							name='discount'
							rules={[
								{
									required: true,
									message: 'Please input your discount!'
								}
							]}
						>
							<InputComponent
								value={stateProduct.discount}
								onChange={handleOnChange}
								name='discount'
							/>
						</Form.Item>

						{/* price */}
						<Form.Item
							label='Price'
							name='price'
							rules={[
								{
									required: true,
									message: 'Please input your Price!'
								}
							]}
						>
							<InputComponent
								value={stateProduct.price}
								onChange={handleOnChange}
								name='price'
							/>
						</Form.Item>

						{/* rating */}
						<Form.Item
							label='Rating'
							name='rating'
							rules={[
								{
									required: true,
									message: 'Please input your Rating!'
								}
							]}
						>
							<InputComponent
								value={stateProduct.rating}
								onChange={handleOnChange}
								name='rating'
							/>
						</Form.Item>

						{/* description */}
						<Form.Item
							label='Description'
							name='description'
							rules={[
								{
									required: true,
									message: 'Please input your Description!'
								}
							]}
						>
							<InputComponent
								value={stateProduct.description}
								onChange={handleOnChange}
								name='description'
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
									onChange={handleOnchangeAvatar}
									maxCount={1}
									className='uploadFile'
								>
									<Button icon={<UploadOutlined />}>
										Upload
									</Button>
								</Upload>
								{stateProduct?.image && (
									<img
										src={stateProduct?.image}
										alt='avatar'
										style={{
											height: '60px',
											width: '60px',
											borderRadius: '50%',
											objectFit: 'cover',
											marginLeft: '10px',
											marginTop: '10px'
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
								className='text-[#000]'
								style={{
									border: '1px solid rgb(235, 235, 240)'
								}}
								type='primary'
								htmlType='submit'
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</ModalComponent>

			<DrawerComponet
				title='Chi tiết sản phẩm'
				isOpen={isOpenDrawer}
				onClose={() => setIsOpenDrawer(false)}
				width='600px'
			>
				<Loading isPending={isLoadingUpdate || isLoadingUpdated}>
					<Form
						name='basic2'
						labelCol={{
							span: 6
						}}
						wrapperCol={{
							span: 18
						}}
						style={{
							maxWidth: 600
						}}
						onFinish={onUpdateProduct}
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
								value={stateProductDetail?.name}
								onChange={handleOnChangeDetails}
								name='name'
							/>
						</Form.Item>

						{/* type */}
						<Form.Item
							label='Type'
							name='type'
							rules={[
								{
									required: true,
									message: 'Please input your Type!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.type}
								onChange={handleOnChangeDetails}
								name='type'
							/>
						</Form.Item>

						{/* count in stock */}
						<Form.Item
							label='Count in stock'
							name='countInStock'
							rules={[
								{
									required: true,
									message: 'Please input your countInStock!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.countInStock}
								onChange={handleOnChangeDetails}
								name='countInStock'
							/>
						</Form.Item>

						{/* discount */}
						<Form.Item
							label='Discount'
							name='discount'
							rules={[
								{
									required: true,
									message: 'Please input your discount!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.discount}
								onChange={handleOnChangeDetails}
								name='discount'
							/>
						</Form.Item>

						{/* price */}
						<Form.Item
							label='Price'
							name='price'
							rules={[
								{
									required: true,
									message: 'Please input your Price!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.price}
								onChange={handleOnChangeDetails}
								name='price'
							/>
						</Form.Item>

						{/* rating */}
						<Form.Item
							label='Rating'
							name='rating'
							rules={[
								{
									required: true,
									message: 'Please input your Rating!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.rating}
								onChange={handleOnChangeDetails}
								name='rating'
							/>
						</Form.Item>

						{/* description */}
						<Form.Item
							label='Description'
							name='description'
							rules={[
								{
									required: true,
									message: 'Please input your Description!'
								}
							]}
						>
							<InputComponent
								value={stateProductDetail?.description}
								onChange={handleOnChangeDetails}
								name='description'
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
							<div className=''>
								<Upload
									onChange={handleOnchangeAvatarDetails}
									maxCount={1}
									className='uploadFile'
								>
									<Button icon={<UploadOutlined />}>
										Upload
									</Button>
								</Upload>
								{stateProductDetail?.image && (
									<img
										src={stateProductDetail?.image}
										alt='avatar'
										style={{
											height: '80px',
											width: '80px',
											borderRadius: '8px',
											objectFit: 'cover',
											marginLeft: '10px',
											marginTop: '10px'
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
								className='text-[#000]'
								style={{
									border: '1px solid rgb(235, 235, 240)'
								}}
								type='primary'
								htmlType='submit'
							>
								Submit
							</Button>
						</Form.Item>
					</Form>
				</Loading>
			</DrawerComponet>

			<ModalComponent
				title='Xóa sản phẩm'
				open={isModalDeleteOpen}
				onCancel={handleCancelDelete}
				onOk={handleDeleteProduct}
			>
				<Loading isPending={isLoadingDelete}>
					<div>Bạn có muốn xóa sản phẩm này không</div>
				</Loading>
			</ModalComponent>
		</div>
	);
};

export default ProductAdmin;

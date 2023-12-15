import axios from 'axios';

import { axiosJWT } from './userServices';

export const getAllProduct = async (limit, search) => {
	let res = {};
	if (search?.length > 0) {
		res = await axios.get(
			`${
				import.meta.env.VITE_API_URL
			}/product/get-all-product?limit=${limit}&filter=name&filter=${search}`
		);
	} else {
		res = await axios.get(
			`${import.meta.env.VITE_API_URL}/product/get-all-product`
		);
	}
	return res.data;
};

export const getProductType = async (type, page, limit) => {
	if (type) {
		const res = await axios.get(
			`${
				import.meta.env.VITE_API_URL
			}/product/get-all?filter=type&filter=${type}&limit=${limit}&page=${page}`
		);
		return res.data;
	}
};

export const getAllType = async () => {
	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/product/get-all-type`
	);
	return res.data;
};

export const getDetailProduct = async id => {
	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/product/details-product/${id}`
	);
	return res.data;
};

export const updateProduct = async (id, access_token, data) => {
	const res = await axiosJWT.put(
		`${import.meta.env.VITE_API_URL}/product/update-product/${id}`,
		data,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const createProduct = async data => {
	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}/product/create-product`,
		data
	);
	return res.data;
};

export const deleteProduct = async (id, access_token) => {
	const res = await axiosJWT.delete(
		`${import.meta.env.VITE_API_URL}/product/delete-product/${id}`,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

// import axios from 'axios';
import { axiosJWT } from './userServices';

export const createOrder = async (data, access_token) => {
	const res = await axiosJWT.post(
		`${import.meta.env.VITE_API_URL}/order/create-order/${data.user}`,
		data,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const getOrderById = async (id, access_token) => {
	const res = await axiosJWT.get(
		`${import.meta.env.VITE_API_URL}/order/get-order-id/${id}`,

		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const cancelOrder = async (id, access_token, orderItems, userId) => {
	const data = { orderItems, orderId: id };
	const res = await axiosJWT.delete(
		`${import.meta.env.VITE_API_URL}/order/cancel-order/${userId}`,
		{ data },
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const getAllOrder = async access_token => {
	const res = await axiosJWT.get(
		`${import.meta.env.VITE_API_URL}/order/get-all-order`,

		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

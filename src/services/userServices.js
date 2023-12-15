/* eslint-disable no-undef */
import axios from 'axios';

export const axiosJWT = axios.create();
export const login = async data => {
	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}/user/sign-in`,
		data
	);
	return res.data;
};

export const loginWithGoogle = async access_token => {
	const res = await axiosJWT.post(
		`${import.meta.env.VITE_API_URL}/user/sign-in-with-google`,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const register = async data => {
	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}/user/sign-up`,
		data
	);
	return res.data;
};

export const logout = async () => {
	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}/user/log-out`
	);
	return res.data;
};

export const getDetailUser = async (id, access_token) => {
	const res = await axiosJWT.get(
		`${import.meta.env.VITE_API_URL}/user/get-details/${id}`,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const getAllUser = async access_token => {
	const res = await axiosJWT.get(
		`${import.meta.env.VITE_API_URL}/user/getAll`,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const deleteUser = async (id, access_token) => {
	const res = await axiosJWT.delete(
		`${import.meta.env.VITE_API_URL}/user/delete-user/${id}`,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const updateUser = async (id, data, access_token) => {
	const res = await axiosJWT.put(
		`${import.meta.env.VITE_API_URL}/user/update-user/${id}`,
		data,
		{
			headers: {
				token: `Bearer ${access_token}`
			}
		}
	);
	return res.data;
};

export const refreshToken = async refreshToken => {
	const res = await axios.post(
		`${import.meta.env.VITE_API_URL}/user/refresh-token`,
		{},
		{
			headers: {
				token: `Bearer ${refreshToken}`
			}
		}
	);
	return res.data;
};

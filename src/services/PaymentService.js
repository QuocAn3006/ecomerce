import axios from 'axios';

export const getConfig = async () => {
	const res = await axios.get(
		`${import.meta.env.VITE_API_URL}/payment/config`
	);
	return res.data;
};

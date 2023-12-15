import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	name: '',
	email: '',
	address: '',
	avatar: '',
	phone: '',
	id: '',
	isAdmin: false,
	city: '',
	access_token: '',
	refreshToken: ''
};

export const userSlice = createSlice({
	name: 'user',
	initialState: initialState,
	reducers: {
		updateUser: (state, action) => {
			const {
				name = '',
				email = '',
				address = '',
				avatar = '',
				phone = '',
				_id = '',
				isAdmin,
				city = '',
				access_token = '',
				refreshToken = ''
			} = action.payload;
			state.name = name ? name : state?.name;
			state.email = email ? email : state?.email;
			state.address = address ? address : state?.address;
			state.avatar = avatar ? avatar : state?.avatar;
			state.phone = phone ? phone : state?.phone;
			state.id = _id ? _id : state?.id;
			state.isAdmin = isAdmin ? isAdmin : state.isAdmin;
			state.city = city ? city : state.city;
			state.access_token = access_token
				? access_token
				: state.access_token;
			state.refreshToken = refreshToken
				? refreshToken
				: state.refreshToken;
		},
		resetUser: state => {
			state.name = '';
			state.email = '';
			state.address = '';
			state.avatar = '';
			state.phone = '';
			state.id = '';
			state.isAdmin = '';
			state.city = '';
			state.access_token = '';
			state.refreshToken = '';
		}
	}
});
export const { updateUser, resetUser } = userSlice.actions;
export default userSlice.reducer;

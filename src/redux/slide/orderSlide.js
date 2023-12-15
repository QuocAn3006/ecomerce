import { createSlice } from '@reduxjs/toolkit';

const initialState = {
	orderItemsSelected: [],
	orderItems: [],
	shippingAddress: {},
	paymentMethod: '',
	itemPrice: 0,
	shippingPrice: 0,
	totalPrice: 0,
	isPaid: false,
	paidAt: '',
	isDelivered: false,
	userId: '',
	delivereddAt: '',
	isSucessOrder: false
};

export const orderSlide = createSlice({
	name: 'order',
	initialState,
	reducers: {
		addOrderProduct: (state, action) => {
			const { orderItem } = action.payload;
			const itemOrder = state?.orderItems?.find(
				item => item?.product === orderItem.product
			);

			if (itemOrder) {
				if (itemOrder.amount <= itemOrder.countInstock) {
					itemOrder.amount += orderItem?.amount;
				}
			} else {
				state?.orderItems?.push(orderItem);
				state.isSucessOrder = true;
			}
		},
		resetOrder: state => {
			state.isSucessOrder = false;
		},

		buyProduct: (state, action) => {
			const { orderItem } = action.payload;
			state?.orderItemsSelected.push(orderItem);
		},

		removeOrderProduct: (state, action) => {
			const { idProduct } = action.payload;
			const itemOrder = state?.orderItems?.filter(
				item => item?.product !== idProduct
			);
			const itemOrderSelected = state?.orderItemsSelected.filter(
				item => item?.product === idProduct
			);
			state.orderItems = itemOrder;
			state.orderItemsSelected = itemOrderSelected;
		},
		removeAllOrderProduct: (state, action) => {
			const { listChecked } = action.payload;
			const itemOrders = state?.orderItems?.filter(
				item => !listChecked.includes(item.product)
			);

			const itemOrdersSelected = state?.orderItemsSelected?.filter(
				item => !listChecked.includes(item.product)
			);
			state.orderItems = itemOrders;
			state.orderItemsSelected = itemOrdersSelected;
		},
		increaseAmount: (state, action) => {
			const { idProduct } = action.payload;
			const itemOrder = state?.orderItems.find(
				item => item?.product === idProduct
			);

			const itemOrderSelected = state?.orderItemsSelected.find(
				item => item?.product === idProduct
			);
			itemOrder.amount++;
			if (itemOrderSelected) {
				itemOrderSelected.amount++;
			}
		},
		decreaseAmount: (state, action) => {
			const { idProduct } = action.payload;
			const itemOrder = state?.orderItems.find(
				item => item?.product === idProduct
			);
			const itemOrderSelected = state?.orderItemsSelected.find(
				item => item?.product === idProduct
			);
			itemOrder.amount--;
			if (itemOrderSelected) {
				itemOrderSelected.amount--;
			}
		},
		selectedOrder: (state, action) => {
			const { listChecked } = action.payload;
			const orderSeleted = [];
			state.orderItems.forEach(order => {
				if (listChecked.includes(order?.product)) {
					orderSeleted.push(order);
				}
			});
			state.orderItemsSelected = orderSeleted;
		}
	}
});

// Action creators are generated for each case reducer function
export const {
	buyProduct,
	addOrderProduct,
	removeOrderProduct,
	increaseAmount,
	decreaseAmount,
	removeAllOrderProduct,
	selectedOrder,
	resetOrder
} = orderSlide.actions;

export default orderSlide.reducer;

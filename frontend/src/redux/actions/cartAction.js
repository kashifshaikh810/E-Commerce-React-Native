import {
  ADD_TO_CART,
  ADD_TO_CART_FAIL,
  ADD_TO_CART_REQUEST,
  ADD_TO_CART_SUCCESS,
  CLEAR_ERRORS,
  GET_TO_CART_FAIL,
  GET_TO_CART_REQUEST,
  GET_TO_CART_SUCCESS,
  REMOVE_TO_CART,
  SAVE_SHIPPING_INFO,
} from '../constants/cartConstants';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export const addItemsToCart =
  (id, quantity, cartItems) => async (dispatch, getState) => {
    try {
      let link = `http://192.168.100.4:5000/api/v1/products/${id}`;

      const {data} = await axios.get(link);

      const isItemExist = cartItems?.find(i => i.product === data.product._id);

      if (isItemExist) {
        dispatch({
          type: ADD_TO_CART_FAIL,
          payload: 'Already in your cart',
        });
      } else {
        dispatch({type: ADD_TO_CART_REQUEST});

        let link = `http://192.168.100.4:5000/api/v1/products/${id}`;

        const {data} = await axios.get(link);

        const config = {headers: {'Content-Type': 'application/json'}};

        let url = `http://192.168.100.4:5000/api/v1/new/cartItem`;

        const cartData = {
          product: data.product._id,
          name: data.product.name,
          price: data.product.price,
          image: data.product.images[0].url,
          stock: data.product.Stock,
          quantity,
        };

        const {data: itemData} = await axios.post(url, cartData, config);

        dispatch({
          type: ADD_TO_CART_SUCCESS,
          payload: itemData,
        });
      }
    } catch (error) {
      dispatch({
        type: ADD_TO_CART_FAIL,
        payload: error?.response?.data?.message,
      });
    }
  };

export const getCartItem = () => async (dispatch, getState) => {
  try {
    dispatch({type: GET_TO_CART_REQUEST});

    let url = `http://192.168.100.4:5000/api/v1/me/cartItem`;

    const {data} = await axios.get(url);

    dispatch({
      type: GET_TO_CART_SUCCESS,
      payload: data.cartItems,
    });
  } catch (error) {
    dispatch({type: GET_TO_CART_FAIL, payload: error?.response?.data?.message});
  }
};

export const removeToCart = id => async (dispatch, getState) => {
  dispatch({
    type: REMOVE_TO_CART,
    payload: id,
  });

  AsyncStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems));
};

export const saveShippingInfo = data => async (dispatch, getState) => {
  dispatch({
    type: SAVE_SHIPPING_INFO,
    payload: data,
  });

  AsyncStorage.setItem('shippingInfo', JSON.stringify(data));
};

export const clearCartErrors = () => async (dispatch, getState) => {
  dispatch({
    type: CLEAR_ERRORS,
  });
};

export const updateQuantity =
  (productId, quantity) => async (dispatch, getState) => {
    try {
      const config = {headers: {'Content-Type': 'application/json'}};

      let url = `http://192.168.100.4:5000/api/v1/update/cartItem/${productId}`;

      const {data} = await axios.put(url, {quantity}, config);

      console.log(data);
    } catch (error) {
      console.warn(error);
    }
  };

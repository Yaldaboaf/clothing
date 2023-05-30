import { createContext, useState, useEffect, useReducer } from "react";

import { createAction } from '../utils/reducer/reducer.utils';

export const addCartItem = (cartItems, productToAdd) => {
  const existingCartItem = cartItems.find((cartItem) => 
    cartItem.id === productToAdd.id
  );
  if (existingCartItem){
    return cartItems.map((cartItem) => 
      cartItem.id === productToAdd.id 
        ? {...cartItem, quantity: cartItem.quantity + 1} 
        : cartItem
    );
  }

  return [...cartItems, {...productToAdd, quantity: 1}]
};

export const removeCartItem = (cartItems, cartItemToRemove) => {
  const existingCartItem = (cartItems.find((cartItem) => cartItem.id === cartItemToRemove.id));
  if (existingCartItem.quantity === 1){
    return cartItems.filter((cartItems) => cartItems.id !== cartItemToRemove.id );
  }
  return cartItems.map((cartItem) => 
      cartItem.id === cartItemToRemove.id
        ? {...cartItem, quantity: cartItem.quantity - 1} 
        : cartItem
    )
}

export const clearCartItem = (cartItems, cartItemToClear) => {
    return cartItems.filter((cartItem) => cartItem.id !==  cartItemToClear.id);  
}

export const CartContext = createContext({
  isCartOpen: false, 
  setIsCartOpen: () => {},
  cartItems: [],
  addItemToCart: () => {},
  removeItemFromCart: () => {},
  clearItemFromCart: () => {},
  cartCount: 0,
  cartPriceCount: 0,
});

const INITIAL_CART_STATE ={
  cartCount: 0,
  cartPriceCount: 0,
  isCartOpen: false, 
  cartItems: [],
}

const CART_ACTION_TYPES = {
  SET_CART_ITEMS: "SET_CART_ITEMS",
  SET_IS_CART_OPEN: "SET_IS_CART_OPEN" 
}

const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch(type){
    case CART_ACTION_TYPES.SET_CART_ITEMS: 
        return {
          ...state,
          ...payload
        }
    case CART_ACTION_TYPES.SET_IS_CART_OPEN:
        return {
          ...state,
          isCartOpen: payload
        }
    default: 
        throw new Error (`Unhandled type ${type} in cartReducer`);
  }
}

export const CartProvider = ({children}) => {
  // const [isCartOpen, setIsCartOpen] = useState(false);
  // const [cartItems, setCartItems] = useState([]);
  // const [cartCount, setCartCount] = useState(0);
  // const [cartPriceCount, setCartPriceCount] = useState(0);

  const [ { cartPriceCount, cartCount, cartItems, isCartOpen }, dispatch ] = useReducer( cartReducer, INITIAL_CART_STATE);

  // useEffect(() => {
  //   const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
  //   setCartCount(newCartCount);
  // }, [cartItems])

  // useEffect(() => {
  //   const newCartPriceCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
  //   setCartPriceCount(newCartPriceCount);
  // }, [cartItems])

  const updateCartItemsReducer = (newCartItems) => {
    const newCartCount = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity,
      0
    );
    const newCartPriceCount = newCartItems.reduce(
      (total, cartItem) => total + cartItem.quantity * cartItem.price,
      0
    );
    dispatch(
      {
        type: CART_ACTION_TYPES.SET_CART_ITEMS, payload:
        { 
          cartItems: newCartItems,
          cartPriceCount: newCartPriceCount,
          cartCount: newCartCount
        }
      }
    );
  }
  
  const setIsCartOpen = (bool) => {
    dispatch( createAction(CART_ACTION_TYPES.SET_IS_CART_OPEN, bool))
  }

  const addItemToCart = (cartItemToAdd) => {
    const newCartItems = addCartItem(cartItems, cartItemToAdd);
    updateCartItemsReducer(newCartItems);
  }

  const removeItemFromCart = (cartItemToRemove) => {
    const newCartItems = removeCartItem(cartItems, cartItemToRemove);
    updateCartItemsReducer(newCartItems);
  }

  const clearItemFromCart = (cartItemToClear) => {
    const newCartItems = clearCartItem(cartItems, cartItemToClear);
    updateCartItemsReducer(newCartItems);
  }

  const value = { isCartOpen, setIsCartOpen, cartItems , addItemToCart, cartCount, removeItemFromCart, clearItemFromCart, cartPriceCount };
 
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
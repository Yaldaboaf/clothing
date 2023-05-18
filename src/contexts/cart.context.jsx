import { createContext, useState, useEffect } from "react";

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
  cartItemsSum: 0,
  cartCount: 0,
  cartPriceCount: 0,
});

export const CartProvider = ({children}) => {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartPriceCount, setCartPriceCount] = useState(0);


  useEffect(() => {
    const newCartCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity, 0);
    setCartCount(newCartCount);
  }, [cartItems])

  useEffect(() => {
    const newCartPriceCount = cartItems.reduce((total, cartItem) => total + cartItem.quantity * cartItem.price, 0);
    setCartPriceCount(newCartPriceCount);
  }, [cartItems])


  const addItemToCart = (product) => {
    setCartItems(addCartItem(cartItems, product));
  }

  const removeItemFromCart = (cartItemToRemove) => {
    setCartItems(removeCartItem(cartItems, cartItemToRemove));
  }

  const clearItemFromCart = (cartItemToClear) => {
    setCartItems(clearCartItem(cartItems, cartItemToClear));
  }

  const value = { isCartOpen, setIsCartOpen, cartItems , addItemToCart, cartCount, removeItemFromCart, clearItemFromCart, cartPriceCount };
 
  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

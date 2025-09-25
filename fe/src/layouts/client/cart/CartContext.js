import React, { createContext, useContext, useState, useEffect } from "react";
import { get, set } from "local-storage";
import { GioHangAPI } from "../../../pages/api/client/gioHang/GioHangAPI";
const CartContext = createContext();

export function CartProvider({ children }) { 
           const [totalQuantity, setTotalQuantity] = useState(0);
  const storedGioHang = get("GioHang");
  useEffect(() => {
       const storedData = get("userData");
    if (storedData !== null) {
    GioHangAPI.getByIDKH(storedData.userID).then((res) => {
      GioHangAPI.getAllGHCTByIDGH(res.data.id).then((res) => {
        setTotalQuantity(res.data.length);
      });
    });
    } else {
      if (storedGioHang !== null) {
        GioHangAPI.getAllGHCTByIDGH(storedGioHang.id).then((res) => {
          setTotalQuantity(res.data.length);
        });
      }
    }

  }, [totalQuantity]);

    const updateTotalQuantity = (newCart) => {
      setTotalQuantity(newCart);
    };
      return (
        <CartContext.Provider value={{ totalQuantity, updateTotalQuantity }}>
          {children}
        </CartContext.Provider>
      );

}
export function useCart() {
  return useContext(CartContext);
}
import React from 'react'
import { useState } from "react";
const ProductCard = ({name,price,category,stock}) => {

  return (
    <div className="bg-green-400 text-white p-7 rounded-lg shadow-lg pt-4">
      <h2 className="text-3xl font-bold">{name}</h2>
      <p className="mt-3">${price}</p>
      <p className="mt-2 block">{category}</p>
      <span className="mt-2 block">Stock:{stock}</span>
    </div>
  )
}
export default ProductCard

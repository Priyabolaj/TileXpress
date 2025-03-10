import React from "react";
import summaryImage from "../../../assets/frontend/img/categories/bathroom.jpg";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

function OrderPlaced() {
  const { orderPlaced } = useSelector((state) => state.order);

  if (!orderPlaced) {
    return <div>Loading...</div>;
  }

  return (
    <div className="grid grid-col-2 lg:grid-flow-col gap-x-24">
      <div className="h-full md:w-[35rem] object-cover bg-repeat">
        <img
          className="w-full h-full rounded object-cover bg-repeat"
          src={summaryImage}
          alt="summary"
        />
      </div>
      <div className="flex flex-col">
        <div className="py-4 border-b">
          <p className="text-sm font-medium text-indigo-500">
            Payment successful
          </p>
          <h2 className="text-3xl md:text-5xl font-bold my-2">Thanks for ordering</h2>
          <p>
            We appreciate your order, we’re currently processing it. So hang
            tight and we’ll send you confirmation very soon!
          </p>
          <p className="font-medium mt-8 ">Tracking number</p>
          <p className="font-medium text-indigo-500">{orderPlaced.orderId}</p>
        </div>
        {/* Map */}
        {orderPlaced.orderItems?.map((item, idx) => (
          <div key={idx} className="flex justify-between border-b py-2 lg:py-4">
            <div className="flex flex-row gap-x-8">
              <img
                className="h-32 w-24 lg:h-32 lg:w-24 rounded object-cover"
                src={item.product.imageUrl}
                alt="product"
              />
              <div className="flex flex-col justify-start gap-y-2">
                <p className="text-sm md:text-base font-medium">
                  {item.product.title}
                </p>
                <p className="text-xs md:text-sm">{item.product.brand}</p>
                <p className="text-xs md:text-sm">Size: {item.size}</p>
                <p className="text-xs md:text-sm">Quantity: {item.quantity}</p>
              </div>
            </div>
            <p className="text-sm md:text-base self-start font-medium">
              ₹{item.discountedPrice}
            </p>
          </div>
        ))}
        {/* Map End */}
        <div className="flex flex-col text-sm md:text-base">
          <div className="pb-2 pt-4 flex justify-between">
            <p>Total price</p>
            <span className="font-semibold">₹{orderPlaced.totalPrice}</span>
          </div>
          <div className="py-2 flex justify-between">
            <p>Discounted price</p>
            <span className="font-semibold">
              ₹{orderPlaced.totalDiscountedPrice}
            </span>
          </div>
          <div className="py-2 flex justify-between">
            <p>Money saved</p>
            <span className="font-semibold text-green-500">
              ₹{orderPlaced.discount}
            </span>
          </div>
          <div className="pb-4 pt-2 border-b flex justify-between">
            <p>Shipping estimate</p>
            <span className="font-semibold text-red-500">-₹50</span>
          </div>
          <div className="py-4 flex justify-between font-semibold">
            <p>Order total</p>
            <span>₹{orderPlaced.totalDiscountedPrice + 50}</span>
          </div>
        </div>
        <div className="grid grid-col-2 md:grid-flow-col gap-y-4 border-b py-4">
          <div>
            <h5 className="text-base font-medium mb-1">Shipping Address</h5>
            <p className="text-sm">
              {orderPlaced.shippingAddress?.firstName +
                " " +
                orderPlaced.shippingAddress?.lastName}
            </p>
            <p className="text-sm">{orderPlaced.shippingAddress?.streetAddress}</p>
            <p className="text-sm">{orderPlaced.shippingAddress?.city}, {orderPlaced.shippingAddress?.state} - {orderPlaced.shippingAddress?.zipCode}</p>
          </div>
          <div>
            <h5 className="text-base font-medium mb-1">Payment Information</h5>
            <p className="text-sm">Method: {orderPlaced.paymentMethod}</p>
            <p className="text-sm">Status: {orderPlaced.paymentStatus}</p>
            <p className="text-sm">Date: {orderPlaced.orderDate}</p>
          </div>
        </div>
        <Link
          to={"/store"}
          className="text-base text-end font-medium text-indigo-500 hover:text-indigo-600 my-8"
        >
          Continue Shopping -&gt;
        </Link>
      </div>
    </div>
  );
}

export default OrderPlaced;
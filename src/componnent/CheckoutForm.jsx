import React, { useEffect, useState } from "react";
import { makeRequest } from "../api"; // Your axios instance
import axios from "axios";
import { useSelector } from "react-redux";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "react-router-dom";

const CheckoutForm = () => {
  const stripePromise = loadStripe(
    process.env.REACT_APP_STRIPE_PUBLISH_KEY
  );

  console.log(process.env.REACT_APP_STRIPE_PUBLISH_KEY)
  const cart = useSelector((statu) => statu.cart);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    zipCode: "",
    address: "",
  });

  const [errors, setErrors] = useState({
    fullName: "",
    email: "",
    zipCode: "",
    address: "",
  });

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const priceTotal = () => {
    return cart
      .reduce((total, item) => total + item.attributes.price * item.amount, 0)
      .toFixed(2);
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    // Full Name Validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
      isValid = false;
    }

    // Email Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email address.";
      isValid = false;
    }

    // ZIP Code Validation
    const zipCodeRegex = /^\d{5}(?:[-\s]\d{4})?$/;
    if (!zipCodeRegex.test(formData.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code.";
      isValid = false;
    }

    // Address Validation
    if (!formData.address.trim()) {
      newErrors.address = "Address is required.";
      isValid = false;
    }
    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleCheckout();
      // Handle successful form submission
    }
  };

  const handleCheckout = async () => {
    const stripe = await stripePromise;
    // Create a payment session using Strapi API
    const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/payments/create-session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.REACT_APP_API_KEY}`,
        },
        body: JSON.stringify({ cart }),
      }
    );

    const session = await response.json();


    // Redirect to Stripe Checkout
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error(result.error.message);
    }
  };

  return (
    <>
      <div className="grid sm:px-10 lg:grid-cols-2 lg:px-20 xl:px-32">
        <div className="px-4 pt-8">
          <p className="text-xl font-medium">Order Summary</p>
          <p className="text-gray-400">
            Check your items. And select a suitable shipping method.
          </p>
          <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-6">
            {cart.map((item) => {
              return (
                <div key={item.id}>
                  {loading ? (
                    <div
                      className="flex  rounded-lg bg-white sm:flex-row"
                      key={item.id}
                    >
                      <div className="m-2 h-24 w-28 rounded-md border border-[F5CAAB] object-cover object-center relative bg-gray-300 animate-pulse">
                        <div className="flex gap-2 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                          <i className="bx bxs-image text-[30px] text-gray-50"></i>
                        </div>
                      </div>
                      <div className="flex w-full flex-col px-4 py-4 gap-1 ">
                        <div className="font-semibold bg-slate-300 animate-pulse w-full h-5 rounded-[20px]"></div>
                        <span className="float-right w-[60%] h-4 rounded-[20px] animate-pulse bg-slate-300"></span>
                        <p className="text-lg font-bold w-[30%] h-5 rounded-[20px] animate-pulse bg-slate-300"></p>
                      </div>
                    </div>
                  ) : (
                    <div
                      className="flex  rounded-lg bg-white sm:flex-row"
                      key={item.id}
                    >
                      <img
                        className="m-2 h-24 w-28 rounded-md border object-cover object-center"
                        src={item.attributes.images.data[0].attributes.url}
                      />

                      <div className="flex w-full flex-col px-4 py-4">
                        <Link
                          to={`/product/${item.id}`}
                          className="font-semibold"
                        >
                          {item.attributes.title}
                        </Link>
                        <span className="float-right text-gray-400">
                          Free Shipping
                        </span>
                        <p className="text-lg font-bold">
                          ${(item.attributes.price * item.amount).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
          <p className="text-xl font-medium">Order Details</p>
          <p className="text-gray-400">
            Complete your order by providing your Shipping details.
          </p>
          <div className="">
            <label
              htmlFor="email"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Email
            </label>
            <div className="">
              <div className="relative">
                <input
                  type="text"
                  id="email"
                  onChange={handleChange}
                  name="email"
                  className={`w-full rounded-md  border ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }  px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[[#F5CAAB]]`}
                  placeholder="your.email@gmail.com"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-red-500 text-sm">{errors.email}</p>
            </div>
            <label
              htmlFor="card-holder"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Full Name
            </label>
            <div className="">
              <div className="relative">
                <input
                  type="text"
                  id="card-holder"
                  onChange={handleChange}
                  name="fullName"
                  //
                  className={`w-full rounded-md  border ${
                    errors.fullName ? "border-red-500" : "border-gray-300"
                  }  px-4 py-3 pl-11 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[[#F5CAAB]]`}
                  placeholder="Your full name here"
                />
                <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5zm6-10.125a1.875 1.875 0 11-3.75 0 1.875 1.875 0 013.75 0zm1.294 6.336a6.721 6.721 0 01-3.17.789 6.721 6.721 0 01-3.168-.789 3.376 3.376 0 016.338 0z"
                    />
                  </svg>
                </div>
              </div>

              <p className="text-red-500 text-sm">{errors.fullName}</p>
            </div>
            <label
              htmlFor="billing-address"
              className="mt-4 mb-2 block text-sm font-medium"
            >
              Billing Address
            </label>
            <div className="flex flex-col gap-5 sm:flex-row">
              <div className="relative flex-shrink-0 sm:w-7/12">
                <input
                  type="text"
                  onChange={handleChange}
                  id="address"
                  name="address"
                  // className="w-full rounded-md border border-gray-200 px-4 py-3 pl-3 text-sm shadow-sm outline-none focus:z-10 focus:border-blue-500 focus:ring-blue-500"
                  className={`w-full rounded-md  border ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }  px-4 py-3 pl-5 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[[#F5CAAB]]`}
                  placeholder=" Address"
                />
                {/* <div className="pointer-events-none absolute inset-y-0 left-0 inline-flex items-center px-3">
          <i class='bx bx-location-plus text-[20px] text-gray-400'></i>
          </div> */}
                {errors.address && (
                  <p className="text-red-500 text-sm">{errors.address}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  name="zipCode"
                  onChange={handleChange}
                  //
                  className={`border ${
                    errors.zipCode ? "border-red-500" : "border-gray-200 "
                  }  px-4 py-3 pl-5 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[#F5CAAB] sm:w-full`}
                  placeholder="Code Zip"
                />
                {errors.zipCode && (
                  <p className="text-red-500 text-sm">{errors.zipCode}</p>
                )}
              </div>
            </div>
            <div className="relative pt-3">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-5 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[#F5CAAB]"
                placeholder="Apartment, suite, etc. (optional)"
              />
            </div>
            <div className="relative pt-3">
              <input
                type="text"
                id="email"
                name="email"
                className="w-full rounded-md border border-gray-200 px-4 py-3 pl-5 text-sm shadow-sm outline-none focus:z-10 focus:border-[#F5CAAB] focus:ring-[#F5CAAB]"
                placeholder="City"
              />
            </div>
            {/* <-- Total --> */}
            <div className="mt-6 border-t border-b py-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Subtotal</p>
                <p className="font-semibold text-gray-900">${priceTotal()}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">Shipping</p>
                <p className="font-semibold text-gray-900">Free Shiping</p>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm font-medium text-gray-900">Total</p>
              <p className="text-2xl font-semibold text-gray-900">
                ${priceTotal()}
              </p>
            </div>
          </div>
          <button
            className="mt-4 mb-8 w-full rounded-md bg-gray-900 px-6 py-3 font-medium text-white flex items-center justify-center"
            onClick={handleSubmit}
          >
            <i className="bx bxs-credit-card mr-2 text-[30px]"></i>
            Pay Order
          </button>
        </div>
      </div>
    </>
  );
};

export default CheckoutForm;
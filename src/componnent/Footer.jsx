import React from "react";
import logo from "../images/SAFWA@4x.png";
import { useSelector } from "react-redux";

function Footer() {
  const categories = useSelector((state) => state.categories);
  return (
    <div className="mt-[20px]">
      <div className="container flex flex-col lg:flex-row gap-4 justify-between border-t-[1.5px]  py-[40px]">
        <div>
          <ul className="flex flex-col gap-[10px] text-[#868686] " >
            <li>
              <img src={logo} className="w-[200px]" />
            </li>
            <li className="flex items-center gap-2">
              <i className="bx bx-location-plus  text-[15px] font-[400]"></i>
              1418 Riverwood Drive, Suite 3245 Cottonwood,
              <br /> CA 96052, United States
            </li>
            <li className="flex items-center gap-2">
              <i className="bx bx-phone text-[15px] font-[400]"></i>+ 185659635
            </li>
            <li className="flex items-center gap-2">
              <i className="bx bx-envelope text-[15px] font-[400]"></i>
              contact@katie.com
            </li>
          </ul>
        </div>
        <div className="flex gap-[100px]">
          <div>
            <h2 className="text-[25px] pb-2 font-[500]">Pages</h2>
            <ul className="flex flex-col gap-[10px] text-[15px] font-[400] text-[#868686] ">
              <li>Home</li>
              <li>Shop</li>
              <li>Products</li>
              <li>Blog</li>
            </ul>
          </div>
          <div>
            <h6 className="text-[25px] pb-2 font-[500]">categories</h6>
            <ul className="flex flex-col gap-[10px] text-[15px] font-[400] text-[#868686] ">
              {categories.map((cate) => {
                return <li key={cate.id}>{cate.attributes.name}</li>;
              })}
            </ul>
          </div>
        </div>
      </div>
      <div className="pb-2">
        <h5 className="text-[13px] text-center">
          SAFWA - 2024 # DEV_ABELGHANI_BERHOUCH
        </h5>
      </div>
    </div>
  );
}

export default Footer;
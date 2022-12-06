import ProductTour from "@extension-onboarding/components/ProductTour";
import React from "react";
import { Outlet } from "react-router-dom";

const ProductTourLayout = () => {
  return (
    <>
      <ProductTour />
      <Outlet />
    </>
  );
};

export default ProductTourLayout;

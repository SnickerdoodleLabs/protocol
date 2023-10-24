import React from "react";
import { Outlet } from "react-router-dom";

import ProductTour from "@extension-onboarding/components/ProductTour";

const ProductTourLayout = () => {
  return (
    <>
      <ProductTour />
      <Outlet />
    </>
  );
};

export default ProductTourLayout;

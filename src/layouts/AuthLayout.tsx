import React from "react";
import { Link } from "react-router-dom";
import bannerImage from "../assets/images/undraw_in_the_office.png";

type Props = {
  currentRoute: string;
  children: React.ReactNode;
};

const AuthLayout = ({ children, currentRoute }: Props) => {
  return (
    <div className="relative flex items-center justify-center h-screen w-full">
      {/* Background Image */}
      <img
        src={bannerImage}
        alt="banner"
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Overlay to make content readable */}
      <div className="absolute top-0 left-0 w-full h-full bg-black/30"></div>

      {/* Centered Form Container */}
      <div className="relative z-10 bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;

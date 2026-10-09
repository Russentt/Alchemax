import React, { type JSX } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

export default function Layout(): JSX.Element {
  return (
    <div className="alchemax-app d-flex flex-column min-vh-100 bg-light">
      <Navbar />

      {/* 
        This wrapper strictly forces the child pages to push the footer down, 
        preventing the overlap seen in your image. 
      */}
      <div className="flex-grow-1 d-flex flex-column">
        <Outlet />
      </div>

      <Footer />
      <Chatbot />
    </div>
  );
}

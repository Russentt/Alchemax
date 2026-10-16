import { Suspense, type JSX } from "react";
import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Chatbot from "./Chatbot";

export default function Layout(): JSX.Element {
  return (
    <div className="alchemax-app d-flex flex-column min-vh-100 bg-light">
      <Navbar />
      <div className="flex-grow-1 d-flex flex-column">
        <Suspense fallback={<div className="flex-grow-1" aria-busy="true" />}>
          <Outlet />
        </Suspense>
      </div>
      <Footer />
      <Chatbot />
    </div>
  );
}

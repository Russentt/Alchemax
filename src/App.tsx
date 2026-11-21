import { lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const Home = lazy(() => import("./pages/Home"));
const Metodologia = lazy(() => import("./pages/Metodologia"));
const Account = lazy(() => import("./pages/Account"));
const Register = lazy(() => import("./pages/Register"));
const Carrito = lazy(() => import("./pages/Carrito"));
const Faq = lazy(() => import("./pages/Faq"));
const Login = lazy(() => import("./pages/Login"));
const Testimonios = lazy(() => import("./pages/Testimonios"));
const Telemedicina = lazy(() => import("./pages/Telemedicina"));
const Blog = lazy(() => import("./pages/Blog"));
const Admin = lazy(() => import("./pages/Admin"));
const Article = lazy(() => import("./pages/Article"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Nutricionista = lazy(() => import("./pages/Nutricionista"));

const App = () => {
  return (
    <BrowserRouter basename="/Alchemax">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route
            path="account"
            element={
              <ProtectedRoute allowedRoles={["usuario"]}>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route path="register" element={<Register />} />
          <Route
            path="carrito"
            element={
              <ProtectedRoute allowedRoles={["usuario"]}>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="metodologia" element={<Metodologia />} />
          <Route path="telemedicina" element={<Telemedicina />} />
          <Route path="faq" element={<Faq />} />
          <Route path="testimonios" element={<Testimonios />} />
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />
          <Route
            path="nutricionista"
            element={
              <ProtectedRoute allowedRoles={["nutricionista"]}>
                <Nutricionista />
              </ProtectedRoute>
            }
          />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:articleId" element={<Article />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

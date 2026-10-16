import { lazy } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import { StorageUsuario } from "./services/storageUsuario";
import type { JSX } from "react/jsx-runtime";

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

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const usuario = StorageUsuario.getUsuarioSesion();
  if (!usuario) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const App = () => {
  return (
    <BrowserRouter basename="/Alchemax">
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="register" element={<Register />} />
          <Route
            path="carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route path="login" element={<Login />} />
          <Route path="metodologia" element={<Metodologia />} />
          <Route path="telemedicina" element={<Telemedicina />} />
          <Route path="faq" element={<Faq />} />
          <Route path="testimonios" element={<Testimonios />} />
          <Route path="admin" element={<Admin />} />
          <Route path="nutricionista" element={<Nutricionista />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:articleId" element={<Article />} />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

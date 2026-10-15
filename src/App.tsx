
import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router";
import Layout from "./components/Layout";
import Metodologia from "./pages/Metodologia";
import Account from "./pages/Account";
import Register from "./pages/Register";
import Carrito from "./pages/Carrito";
import Faq from "./pages/Faq";
import Login from "./pages/Login";
import Testimonios from "./pages/Testimonios";
import Telemedicina from "./pages/Telemedicina";
import Blog from "./pages/Blog";
import Admin from "./pages/Admin";
import Article from "./pages/Article";
import NotFound from "./pages/NotFound";
import ScrollToTop from "./components/ScrollToTop";
import Nutricionista from "./pages/Nutricionista";
import { StorageUsuario } from "./services/storageUsuario";
import type { JSX } from "react/jsx-runtime";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

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
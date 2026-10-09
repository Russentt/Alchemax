import Home from "./pages/Home";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Route, Routes } from "react-router";
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

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout></Layout>}>
          <Route index element={<Home />} />
          <Route path="account" element={<Account />} />
          <Route path="register" element={<Register />} />
          <Route path="carrito" element={<Carrito />} />
          <Route path="login" element={<Login />} />
          <Route path="metodologia" element={<Metodologia />} />
          <Route path="telemedicina" element={<Telemedicina />} />
          <Route path="faq" element={<Faq />} />
          <Route path="testimonios" element={<Testimonios />} />
          <Route path="admin" element={<Admin />} />

          {/* Core Blog Routing */}
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:articleId" element={<Article />} />

          {/* Catch-all 404 - Must remain at the very bottom of the Layout children */}
          <Route
            path="*"
            element={
              <main className="container my-5 py-5 text-center flex-grow-1">
                <div className="fs-1 mb-3">🔍</div>
                <h2 className="fw-bold text-success mb-3">
                  404 - Página no encontrada
                </h2>
                <p className="text-muted">
                  La ruta que intentas buscar no existe en el sistema.
                </p>
              </main>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;

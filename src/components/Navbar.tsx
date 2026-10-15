import React, { useState, useEffect, useRef, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { StorageUsuario } from "../services/storageUsuario";

export default function Navbar(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const recursosRef = useRef<HTMLLIElement>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const sesionActual = StorageUsuario.getUsuarioSesion();
  // Redireccion dependiendo del rol
  useEffect(() => {
    const sesion =
      StorageUsuario.getUsuarioSesion() ||
      sessionStorage.getItem("session_user");
    setIsAuthenticated(!!sesion);
  }, [location]);

  const rutaPerfil =
    sesionActual?.rol === "admin"
      ? "/admin"
      : sesionActual?.rol === "nutricionista"
      ? "/nutricionista"
      : "/account";

  // Sincroniza el estado de la sesión cada vez que el usuario navega entre páginas
  useEffect(() => {
    const sesion =
      StorageUsuario.getUsuarioSesion() ||
      sessionStorage.getItem("session_user");
    setIsAuthenticated(!!sesion);
  }, [location]);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsDropdownOpen(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (recursosRef.current && !recursosRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
  };

  const handleLogout = () => {
    StorageUsuario.logout();
    sessionStorage.removeItem("session_user");
    setIsAuthenticated(false);
    handleLinkClick();
    navigate("/login", { replace: true });
  };

  const toggleRecursos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDropdownOpen((prev) => !prev);
  };

  // Funciones para pintar de verde la sección activa en el header
  const getNavLinkClass = (path: string, hash: string = "") => {
    const isActive = hash
      ? location.pathname === path && location.hash === hash
      : location.pathname === path && location.hash === "";
    return `nav-link ${isActive ? "text-success fw-bold" : ""}`;
  };

  const isRecursosActive =
    location.pathname === "/faq" ||
    location.pathname === "/telemedicina" ||
    location.pathname.startsWith("/blog");

  const shouldShow = isVisible || isHovered || isMobileMenuOpen;

  return (
    <>
      <div
        className="fixed-top w-100"
        style={{ height: "30px", zIndex: 1040 }}
        onMouseEnter={() => setIsHovered(true)}
      />

      <header
        className="bg-white shadow-sm fixed-top w-100"
        style={{
          transition: "transform 0.3s ease-in-out",
          transform: shouldShow ? "translateY(0)" : "translateY(-100%)",
          zIndex: 1030,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <nav className="navbar navbar-expand-lg navbar-light py-3">
          <div className="container-fluid px-4">
            <Link
              to="/"
              className="text-decoration-none"
              onClick={handleLinkClick}
            >
              <span className="navbar-brand mb-0 h1 text-success fw-bold">
                NutriVida
              </span>
            </Link>

            <button
              className="navbar-toggler border-0 shadow-none"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            <div
              className={`collapse navbar-collapse justify-content-end mt-3 mt-lg-0 ${
                isMobileMenuOpen ? "show" : ""
              }`}
              style={
                isMobileMenuOpen
                  ? { maxHeight: "calc(100vh - 80px)", overflowY: "auto" }
                  : { overflow: "visible" }
              }
            >
              <ul className="navbar-nav align-items-center text-center gap-2 w-100 justify-content-lg-end">
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/#servicios"
                    className={getNavLinkClass("/", "#servicios")}
                    onClick={handleLinkClick}
                  >
                    Servicios
                  </Link>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/metodologia"
                    className={getNavLinkClass("/metodologia")}
                    onClick={handleLinkClick}
                  >
                    Nuestro Método
                  </Link>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/testimonios"
                    className={getNavLinkClass("/testimonios")}
                    onClick={handleLinkClick}
                  >
                    Testimonios
                  </Link>
                </li>

                <li
                  className="nav-item dropdown w-100 w-lg-auto"
                  ref={recursosRef}
                >
                  <a
                    href="#recursos"
                    className={`nav-link dropdown-toggle w-100 ${
                      isRecursosActive ? "text-success fw-bold" : ""
                    }`}
                    onClick={toggleRecursos}
                    aria-expanded={isDropdownOpen}
                  >
                    Recursos
                  </a>
                  <ul
                    className={`dropdown-menu border-0 shadow-sm text-center text-lg-start ${
                      isDropdownOpen ? "show" : ""
                    }`}
                    style={{
                      display: isDropdownOpen ? "block" : "none",
                      marginTop: "0.5rem",
                      position: isMobileMenuOpen ? "static" : "absolute",
                    }}
                  >
                    <li>
                      <Link
                        className={`dropdown-item py-2 ${
                          location.pathname === "/faq"
                            ? "text-success fw-bold bg-light"
                            : ""
                        }`}
                        to="/faq"
                        onClick={handleLinkClick}
                      >
                        Preguntas Frecuentes
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item py-2 ${
                          location.pathname === "/telemedicina"
                            ? "text-success fw-bold bg-light"
                            : ""
                        }`}
                        to="/telemedicina"
                        onClick={handleLinkClick}
                      >
                        Telemedicina
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item py-2 ${
                          location.pathname.startsWith("/blog")
                            ? "text-success fw-bold bg-light"
                            : ""
                        }`}
                        to="/blog"
                        onClick={handleLinkClick}
                      >
                        Artículos Clínicos
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>

              <div className="d-flex flex-column flex-lg-row align-items-center gap-2 ms-lg-4 mt-3 mt-lg-0">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="btn btn-outline-success btn-sm fw-bold px-4 py-2 rounded-pill shadow-sm w-100 w-lg-auto"
                      onClick={handleLinkClick}
                    >
                      Ingresar
                    </Link>
                    <Link
                      to="/register"
                      className="btn btn-success btn-sm fw-bold px-4 py-2 rounded-pill shadow-sm w-100 w-lg-auto"
                      onClick={handleLinkClick}
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={rutaPerfil}
                      className="btn btn-success btn-sm fw-bold px-4 py-2 rounded-pill shadow-sm w-100 w-lg-auto text-nowrap"
                      onClick={handleLinkClick}
                    >
                      {sesionActual?.rol === "nutricionista" || sesionActual?.rol === "admin"
                        ? "Mi Perfil"
                        : "Mi Perfil"}
                    </Link>
                    <button
                      type="button"
                      className="btn btn-outline-danger btn-sm fw-bold px-4 py-2 rounded-pill shadow-sm w-100 w-lg-auto text-nowrap"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      <div style={{ height: "76px" }} aria-hidden="true" />
    </>
  );
}

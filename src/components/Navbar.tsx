import React, { useState, useEffect, useRef, type JSX } from "react";
import { Link } from "react-router";

export default function Navbar(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState<boolean>(false);

  // Authentication & Role Mocks
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<"patient" | "admin">("patient");

  const recursosRef = useRef<HTMLLIElement>(null);
  const perfilRef = useRef<HTMLDivElement>(null);

  // 1. Scroll Event: Hides navbar on scroll down, reveals on scroll up
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsDropdownOpen(false);
        setIsUserDropdownOpen(false);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 2. Click Outside Event: Closes dropdowns if user clicks elsewhere
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (recursosRef.current && !recursosRef.current.contains(target)) {
        setIsDropdownOpen(false);
      }
      if (perfilRef.current && !perfilRef.current.contains(target)) {
        setIsUserDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Universal close function for when a route is clicked
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsUserDropdownOpen(false);
  };

  // Safe toggle for the Recursos dropdown
  const toggleRecursos = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation(); // Prevents the mousedown event from instantly closing it
    setIsDropdownOpen((prev) => !prev);
    setIsUserDropdownOpen(false);
  };

  // Safe toggle for the Profile dropdown
  const togglePerfil = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsUserDropdownOpen((prev) => !prev);
    setIsDropdownOpen(false);
  };

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
              // CRITICAL FIX: Only apply overflowY on mobile. On desktop, this must remain visible so the dropdown doesn't get clipped.
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
                    className="nav-link text-success fw-bold"
                    onClick={handleLinkClick}
                  >
                    Servicios
                  </Link>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/metodologia"
                    className="nav-link"
                    onClick={handleLinkClick}
                  >
                    Nuestro Método
                  </Link>
                </li>
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/testimonios"
                    className="nav-link"
                    onClick={handleLinkClick}
                  >
                    Testimonios
                  </Link>
                </li>

                {/* Refactored Dropdown */}
                <li
                  className="nav-item dropdown w-100 w-lg-auto"
                  ref={recursosRef}
                >
                  <a
                    href="#recursos"
                    className="nav-link dropdown-toggle w-100"
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
                        className="dropdown-item py-2"
                        to="/faq"
                        onClick={handleLinkClick}
                      >
                        Preguntas Frecuentes
                      </Link>
                    </li>
                    <li>
                      <Link
                        className="dropdown-item py-2"
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
                        className="dropdown-item py-2"
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
                  <div className="dropdown w-100 w-lg-auto" ref={perfilRef}>
                    <a
                      href="#perfil"
                      className="btn btn-success btn-sm fw-bold px-4 py-2 rounded-pill shadow-sm dropdown-toggle w-100"
                      onClick={togglePerfil}
                    >
                      Mi Perfil
                    </a>
                    <ul
                      className={`dropdown-menu dropdown-menu-end border-0 shadow-sm text-center text-lg-start ${
                        isUserDropdownOpen ? "show" : ""
                      }`}
                      style={{
                        display: isUserDropdownOpen ? "block" : "none",
                        marginTop: "0.5rem",
                        position: isMobileMenuOpen ? "static" : "absolute",
                      }}
                    >
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/account"
                          onClick={handleLinkClick}
                        >
                          Portal del Paciente
                        </Link>
                      </li>
                      <li>
                        <Link
                          className="dropdown-item py-2"
                          to="/carrito"
                          onClick={handleLinkClick}
                        >
                          Mi Carrito
                        </Link>
                      </li>
                      {userRole === "admin" && (
                        <>
                          <li>
                            <hr className="dropdown-divider" />
                          </li>
                          <li>
                            <Link
                              className="dropdown-item py-2 text-danger fw-bold"
                              to="/admin"
                              onClick={handleLinkClick}
                            >
                              Panel de Control
                            </Link>
                          </li>
                        </>
                      )}
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button
                          className="dropdown-item py-2 text-muted"
                          onClick={handleLinkClick}
                        >
                          Cerrar Sesión
                        </button>
                      </li>
                    </ul>
                  </div>
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

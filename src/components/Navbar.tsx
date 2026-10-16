import { useState, useEffect, useRef, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { StorageUsuario } from "../services/storageUsuario";

export default function Navbar(): JSX.Element {
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  // Estados para controlar los submenús
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false); // Para Recursos
  const [isServiciosOpen, setIsServiciosOpen] = useState<boolean>(false); // Para Servicios

  const recursosRef = useRef<HTMLLIElement>(null);
  const serviciosRef = useRef<HTMLLIElement>(null);

  const hoverTimeoutRef = useRef<number | null>(null);
  const recursosTimeoutRef = useRef<number | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const sesionActual = StorageUsuario.getUsuarioSesion();
  const isAuthenticated = Boolean(
    sesionActual || sessionStorage.getItem("session_user"),
  );

  const rutaPerfil =
    sesionActual?.rol === "admin"
      ? "/admin"
      : sesionActual?.rol === "nutricionista"
        ? "/nutricionista"
        : "/account";

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY < 50 || currentScrollY < lastScrollY) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setIsDropdownOpen(false);
        setIsServiciosOpen(false);
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
      if (serviciosRef.current && !serviciosRef.current.contains(target)) {
        setIsServiciosOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
    setIsDropdownOpen(false);
    setIsServiciosOpen(false);
  };

  const handleLogout = () => {
    StorageUsuario.logout();
    sessionStorage.removeItem("session_user");
    handleLinkClick();
    navigate("/login", { replace: true });
  };

  // --- Hover Servicios ---
  const handleMouseEnterServicios = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsServiciosOpen(true);
      setIsDropdownOpen(false);
    }, 150);
  };

  const handleMouseLeaveServicios = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = window.setTimeout(() => {
      setIsServiciosOpen(false);
    }, 300);
  };

  // --- Hover Recursos ---
  const handleMouseEnterRecursos = () => {
    if (recursosTimeoutRef.current) clearTimeout(recursosTimeoutRef.current);
    recursosTimeoutRef.current = window.setTimeout(() => {
      setIsDropdownOpen(true);
      setIsServiciosOpen(false);
    }, 150);
  };

  const handleMouseLeaveRecursos = () => {
    if (recursosTimeoutRef.current) clearTimeout(recursosTimeoutRef.current);
    recursosTimeoutRef.current = window.setTimeout(() => {
      setIsDropdownOpen(false);
    }, 300);
  };

  const getNavLinkClass = (path: string, hash: string = "") => {
    const isActive = hash
      ? location.pathname === path && location.hash === hash
      : location.pathname === path && location.hash === "";
    return `nav-link tracking-tight px-3 rounded-pill transition-all ${
      isActive ? "text-success fw-bold bg-light" : "text-dark fw-medium hover-lift-text"
    }`;
  };

  const isRecursosActive =
    location.pathname === "/faq" ||
    location.pathname === "/telemedicina" ||
    location.pathname.startsWith("/blog");

  const isServiciosActive = location.pathname.startsWith("/metodologia");

  const shouldShow = isVisible || isHovered || isMobileMenuOpen;

  return (
    <>
      <div
        className="fixed-top w-100"
        style={{ height: "40px", zIndex: 1040 }}
        onMouseEnter={() => setIsHovered(true)}
      />

      <header
        className="fixed-top w-100"
        style={{
          padding: "1rem", // Separación superior para crear el efecto flotante
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
          transform: shouldShow ? "translateY(0)" : "translateY(-120%)",
          zIndex: 1030,
          pointerEvents: "none", // Permite hacer click "a través" del padding
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* LA ISLA FLOTANTE (CAPSULE NAVBAR) */}
        <nav
          className="navbar navbar-expand-lg mx-auto"
          style={{
            pointerEvents: "auto", // Reactiva el click dentro de la isla
            maxWidth: "1100px",
            background: "rgba(255, 255, 255, 0.75)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255, 255, 255, 0.6)",
            borderRadius: isMobileMenuOpen ? "24px" : "50px", // Cambia la forma en móvil
            padding: "0.5rem 1.5rem",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
            transition: "border-radius 0.3s ease",
          }}
        >
          <div className="container-fluid px-0">
            <Link
              to="/"
              className="text-decoration-none d-flex align-items-center me-4"
              onClick={handleLinkClick}
            >
              <span className="navbar-brand mb-0 h4 tracking-tight text-dark fw-bolder m-0">
                Nutri<span className="text-success">Vida.</span>
              </span>
            </Link>

            <button
              className="navbar-toggler border-0 shadow-none p-2"
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-expanded={isMobileMenuOpen}
              style={{ borderRadius: "50px", backgroundColor: isMobileMenuOpen ? 'rgba(0,0,0,0.05)' : 'transparent' }}
            >
              <span className="navbar-toggler-icon" style={{ width: '1.2em', height: '1.2em' }}></span>
            </button>

            <div
              className={`collapse navbar-collapse justify-content-between mt-3 mt-lg-0 ${
                isMobileMenuOpen ? "show" : ""
              }`}
              style={
                isMobileMenuOpen
                  ? { maxHeight: "calc(80vh)", overflowY: "auto" }
                  : { overflow: "visible" }
              }
            >
              {/* Enlaces centrales alineados como píldoras */}
              <ul className="navbar-nav mx-auto align-items-center text-center gap-1">
                <li className="nav-item w-100 w-lg-auto">
                  <Link
                    to="/#servicios"
                    className={getNavLinkClass("/", "#servicios")}
                    onClick={handleLinkClick}
                  >
                    Especialidades
                  </Link>
                </li>

                {/* Submenú SERVICIOS (Ahora funciona como Recursos) */}
                <li
                  className="nav-item dropdown w-100 w-lg-auto"
                  ref={serviciosRef}
                  onMouseEnter={handleMouseEnterServicios}
                  onMouseLeave={handleMouseLeaveServicios}
                >
                  <a
                    href="#servicios-menu"
                    className={`nav-link dropdown-toggle tracking-tight px-3 rounded-pill transition-all w-100 ${
                      isServiciosActive
                        ? "text-success fw-bold bg-light"
                        : "text-dark fw-medium"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsServiciosOpen(!isServiciosOpen);
                      setIsDropdownOpen(false);
                    }}
                    aria-expanded={isServiciosOpen}
                  >
                    Servicios
                  </a>
                  <ul
                    className={`dropdown-menu glass-panel-small p-2 border-0 text-center text-lg-start ${
                      isServiciosOpen ? "show" : ""
                    }`}
                    style={{
                      display: isServiciosOpen ? "block" : "none",
                      marginTop: "1rem", // Se separa de la cápsula para flotar libremente
                      top: "100%",
                      position: isMobileMenuOpen ? "static" : "absolute",
                      minWidth: "240px",
                      borderRadius: "20px", // Bento card style
                    }}
                  >
                    <li>
                      <Link
                        className={`dropdown-item py-2 px-3 rounded-3 transition-all ${
                          location.pathname === "/metodologia" && !location.hash
                            ? "bg-light text-success fw-bold"
                            : "text-dark"
                        }`}
                        to="/metodologia"
                        onClick={handleLinkClick}
                      >
                        Vista General
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider opacity-10 my-1" />
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item py-2 px-3 rounded-3 transition-all ${
                          location.hash === "#catalogo"
                            ? "bg-light text-success fw-bold"
                            : "text-dark"
                        }`}
                        to="/metodologia#catalogo"
                        onClick={handleLinkClick}
                      >
                        Catálogo Clínico
                      </Link>
                    </li>
                  </ul>
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

                {/* Submenú RECURSOS */}
                <li
                  className="nav-item dropdown w-100 w-lg-auto"
                  ref={recursosRef}
                  onMouseEnter={handleMouseEnterRecursos}
                  onMouseLeave={handleMouseLeaveRecursos}
                >
                  <a
                    href="#recursos-menu"
                    className={`nav-link dropdown-toggle tracking-tight px-3 rounded-pill transition-all w-100 ${
                      isRecursosActive ? "text-success fw-bold bg-light" : "text-dark fw-medium"
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setIsDropdownOpen(!isDropdownOpen);
                      setIsServiciosOpen(false);
                    }}
                    aria-expanded={isDropdownOpen}
                  >
                    Recursos
                  </a>
                  <ul
                    className={`dropdown-menu glass-panel-small p-2 border-0 text-center text-lg-start ${
                      isDropdownOpen ? "show" : ""
                    }`}
                    style={{
                      display: isDropdownOpen ? "block" : "none",
                      marginTop: "1rem", 
                      top: "100%",
                      position: isMobileMenuOpen ? "static" : "absolute",
                      minWidth: "240px",
                      borderRadius: "20px",
                    }}
                  >
                    <li>
                      <Link
                        className={`dropdown-item py-2 px-3 rounded-3 transition-all ${
                          location.pathname === "/faq"
                            ? "bg-light text-success fw-bold"
                            : "text-dark"
                        }`}
                        to="/faq"
                        onClick={handleLinkClick}
                      >
                        Preguntas Frecuentes
                      </Link>
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item py-2 px-3 rounded-3 transition-all ${
                          location.pathname === "/telemedicina"
                            ? "bg-light text-success fw-bold"
                            : "text-dark"
                        }`}
                        to="/telemedicina"
                        onClick={handleLinkClick}
                      >
                        Telemedicina
                      </Link>
                    </li>
                    <li>
                      <hr className="dropdown-divider opacity-10 my-1" />
                    </li>
                    <li>
                      <Link
                        className={`dropdown-item py-2 px-3 rounded-3 transition-all ${
                          location.pathname.startsWith("/blog")
                            ? "bg-light text-success fw-bold"
                            : "text-dark"
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

              {/* Botones de Autenticación compactos */}
              <div className="d-flex flex-column flex-lg-row align-items-center gap-2 mt-4 mt-lg-0">
                {!isAuthenticated ? (
                  <>
                    <Link
                      to="/login"
                      className="btn-kinetic-secondary text-decoration-none text-nowrap w-100 w-lg-auto"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem', backgroundColor: 'transparent' }}
                      onClick={handleLinkClick}
                    >
                      Ingresar
                    </Link>
                    <Link
                      to="/register"
                      className="btn-kinetic-health text-decoration-none text-nowrap w-100 w-lg-auto"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem', boxShadow: 'none' }}
                      onClick={handleLinkClick}
                    >
                      Registrarse
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={rutaPerfil}
                      className="btn-kinetic-health text-decoration-none text-nowrap w-100 w-lg-auto"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1.5rem', boxShadow: 'none' }}
                      onClick={handleLinkClick}
                    >
                      {sesionActual?.rol === "nutricionista" || sesionActual?.rol === "admin"
                        ? "Panel Control"
                        : "Mi Perfil"}
                    </Link>
                    <button
                      type="button"
                      className="btn-kinetic-secondary text-danger border-0 text-nowrap w-100 w-lg-auto"
                      style={{ fontSize: '0.9rem', padding: '0.5rem 1.2rem', backgroundColor: 'transparent' }}
                      onClick={handleLogout}
                    >
                      Salir
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Espaciador aumentado para compensar la cápsula flotante */}
      <div style={{ height: "100px" }} aria-hidden="true" />
    </>
  );
}
export default function NotFound() {
  return (
    <main className="container my-5 py-5 text-center flex-grow-1">
      <div className="fs-1 mb-3">🔍</div>
      <h2 className="fw-bold text-success mb-3">404 - Página no encontrada</h2>
      <p className="text-muted">
        La ruta que intentas buscar no existe en el sistema.
      </p>
    </main>
  );
}

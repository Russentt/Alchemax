export type EstadoCompra = "Activo" | "Completado" | "Cancelado";

export type PeriodoReporte = "semana" | "mes" | "anio" | "historico";

export interface CompraUsuarioRef {
  id: number;
  nombre?: string;
  email?: string;
}

export interface Compra {
  id: number;
  servicio: number;
  nombre: string;
  fechaCompra: string;
  monto: number;
  estado: EstadoCompra;
  usuario?: CompraUsuarioRef | null;
}

export interface ServicioSolicitadoReporte {
  servicioId: number;
  nombre: string;
  cantidadVendida: number;
  montoRecaudado: number;
  porcentajeVentas: number;
}

export interface ReporteAdmin {
  periodo: PeriodoReporte;
  fechaInicio: string | null;
  fechaFin: string | null;
  totalOperaciones: number;
  totalCompras: number;
  comprasActivas: number;
  comprasCompletadas: number;
  comprasCanceladas: number;
  montoTotalVendido: number;
  ticketPromedio: number;
  totalCitas: number;
  citasProgramadas: number;
  citasConfirmadas: number;
  citasCompletadas: number;
  citasCanceladas: number;
  serviciosRealizados: number;
  serviciosMasSolicitados: ServicioSolicitadoReporte[];
}

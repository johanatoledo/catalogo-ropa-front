"use client";

import { useState } from "react";
import TimerPedido from "./TimerPedido";

function EstadoBadge({ estado, pagoVerificado }) {
  if (!pagoVerificado) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-xl bg-amber-100 px-3 py-1 text-xs font-black uppercase text-amber-800">
        <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse"></span>
        Pendiente
      </span>
    );
  }

  const estaListo = estado?.toLowerCase() === "listo";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-black uppercase ${
        estaListo
          ? "bg-green-100 text-green-700"
          : "bg-blue-100 text-blue-700"
      }`}
    >
      <span
        className={`h-2 w-2 rounded-full ${
          estaListo ? "bg-green-500" : "bg-blue-500 animate-ping"
        }`}
      ></span>
      {estado || "En Preparación"}
    </span>
  );
}

function PagoBadge({ pagoVerificado }) {
  return (
    <span
      className={`inline-flex items-center rounded-xl px-3 py-1 text-xs font-black uppercase ${
        pagoVerificado
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
    >
      {pagoVerificado ? "Pago Verificado" : "Pago Pendiente"}
    </span>
  );
}

export default function AdminPedidosTable({
  pedidos = [],
  onEntregar,
  onConfirmarPago,
  onAsignarUbicacion,
}) {
  const [ubicaciones, setUbicaciones] = useState({});
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [cargandoId, setCargandoId] = useState(null);

  const handleAccionConfirmar = async (id) => {
    setCargandoId(id);
    try {
      await onConfirmarPago(id);
    } finally {
      setCargandoId(null);
    }
  };

  const handleAccionEntregar = async (id) => {
    setCargandoId(id);
    try {
      await onEntregar(id);
    } finally {
      setCargandoId(null);
    }
  };

  const pedidosFiltrados = pedidos.filter((pedido) => {
    if (filtroTipo === "todos") return true;
    return pedido.tipo_pedido === filtroTipo;
  });

  const totalRestaurante = pedidos.filter(
    (pedido) => pedido.tipo_pedido === "restaurante"
  ).length;

  const totalLlevar = pedidos.filter(
    (pedido) => pedido.tipo_pedido === "llevar"
  ).length;

  if (!pedidos.length) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-xl">
        <p className="text-xl font-black text-gray-800">
          No hay pedidos activos
        </p>
        <p className="mt-2 text-gray-500">
          Los nuevos pedidos aparecerán aquí automáticamente.
        </p>
      </div>
    );
  }

  return (
  <section className="w-full px-4 py-8 md:px-6 xl:px-8">
    <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
     <div className="flex w-full flex-wrap gap-3 border-b bg-gray-50 p-5">
        <button
          onClick={() => setFiltroTipo("todos")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "todos"
              ? "bg-amber-800 text-white"
              : "border bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Todos ({pedidos.length})
        </button>

        <button
          onClick={() => setFiltroTipo("restaurante")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "restaurante"
              ? "bg-amber-700 text-white"
              : "border bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Restaurante ({totalRestaurante})
        </button>

        <button
          onClick={() => setFiltroTipo("llevar")}
          className={`rounded-xl px-4 py-2 text-sm font-black transition ${
            filtroTipo === "llevar"
              ? "bg-purple-700 text-white"
              : "border bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          Para llevar ({totalLlevar})
        </button>
      </div>

      {/* Tabla principal */}
    
      <div className="w-full overflow-hidden rounded-3xl bg-white shadow-xl">
       <div div className="w-full overflow-x-auto">
        <table className="w-full min-w-[1450px] table-auto border-collapse text-left text-base">
          <thead className="bg-amber-800 text-xs font-black uppercase text-white tracking-wider">
            <tr>
              <th className="whitespace-nowrap px-5 py-4">Id</th>
              <th className="whitespace-nowrap px-5 py-4">Cliente</th>
              <th className="whitespace-nowrap px-5 py-4">Tipo</th>
              <th className="whitespace-nowrap px-5 py-4">Ubicación</th>
              <th className="whitespace-nowrap px-5 py-4">Pedido</th>
              <th className="whitespace-nowrap px-5 py-4">Total</th>
              <th className="whitespace-nowrap px-5 py-4">Yape</th>
              <th className="whitespace-nowrap px-5 py-4">Pago</th>
              <th className="whitespace-nowrap px-5 py-4">Estado</th>
              <th className="whitespace-nowrap px-5 py-4">Tiempo</th>
              <th className="whitespace-nowrap px-5 py-4">Acción</th>
        </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {pedidosFiltrados.length === 0 && (
              <tr>
                <td
                  colSpan="11"
                  className="p-8 text-center font-bold text-gray-500"
                >
                  No existen pedidos para este filtro.
                </td>
              </tr>
            )}

            {pedidosFiltrados.map((pedido) => {
              let productos = [];

              try {
                productos =
                  typeof pedido.productos === "string"
                    ? JSON.parse(pedido.productos)
                    : pedido.productos || [];
              } catch {
                productos = [];
              }

              const esRestaurante = pedido.tipo_pedido === "restaurante";
              function normalizarBooleano(valor) {
                   return (
                      valor === true ||
                      valor === 1 ||
                      valor === "1"
                   );
            }
             const pagoVerificado = normalizarBooleano(
             pedido.pago_verificado
        );

              const ubicacionActual =
                ubicaciones[pedido.id] ?? pedido.ubicacion ?? "";

              const estaProcesando = cargandoId === pedido.id;

              return (
                <tr
                  key={pedido.id}
                  className="hover:bg-amber-50/40 transition-colors"
                >
                  {/* Nro Pedido */}
                  <td className="p-4 align-top font-black text-gray-900">
                    #{pedido.id}
                  </td>

                  {/* Cliente */}
                  <td className="p-4 align-top font-black uppercase text-gray-900 min-w-[130px]">
                    {pedido.cliente_nombre}
                  </td>

                  {/* Tipo de Pedido */}
                  <td className="p-4 align-top">
                    <span
                      className={`inline-block rounded-xl px-3 py-1 text-xs font-black uppercase ${
                        esRestaurante
                          ? "bg-amber-100 text-amber-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {esRestaurante ? "Restaurante" : "Para Llevar"}
                    </span>
                  </td>

                  {/* Ubicación / Mesa */}
                  <td className="p-4 align-top min-w-[180px]">
                    {esRestaurante ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          value={ubicacionActual}
                          onChange={(e) =>
                            setUbicaciones((prev) => ({
                              ...prev,
                              [pedido.id]: e.target.value,
                            }))
                          }
                          placeholder="Ej: Mesa 4, Terraza"
                          className="w-full rounded-xl border border-gray-300 px-3 py-1.5 text-xs font-bold outline-none focus:border-amber-700"
                        />
                        <button
                          onClick={() =>
                            onAsignarUbicacion(pedido.id, ubicacionActual)
                          }
                          className="rounded-xl bg-gray-800 px-3 py-1.5 text-xs font-black text-white hover:bg-black transition"
                        >
                          Guardar Ubicación
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-bold text-gray-500 italic">
                        Recojo en Mostrador
                      </span>
                    )}
                  </td>

                  {/* Detalle del Pedido */}
                  <td className="p-4 align-top min-w-[240px] whitespace-normal">
                    {productos.length > 0 ? (
                      <ul className="space-y-1.5 text-xs">
                        {productos.map((item, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-1.5 text-gray-800 font-medium"
                          >
                            <span className="font-black text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                              {item.cantidad}x
                            </span>
                            <span className="leading-tight">{item.nombre}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-xs text-gray-400">Sin productos</span>
                    )}
                  </td>

                  {/* Total */}
                  <td className="p-4 align-top font-black text-red-600 whitespace-nowrap">
                    S/ {Number(pedido.total || 0).toFixed(2)}
                  </td>

                  {/* Yape */}
                  <td className="p-4 align-top font-mono font-bold text-gray-800">
                    {pedido.yape_operacion || "—"}
                  </td>

                  {/* Estado del Pago */}
                  <td className="p-4 align-top">
                    <PagoBadge pagoVerificado={pagoVerificado} />
                  </td>

                  {/* Estado del Pedido */}
                  <td className="p-4 align-top">
                    <EstadoBadge
                      estado={pedido.estado}
                      pagoVerificado={pagoVerificado}
                    />
                  </td>

                  {/* Tiempo / Cronómetro */}
                  <td className="p-4 align-top">
                    <TimerPedido
                      pagoConfirmadoEn={pedido.pago_confirmado_en}
                      pagoVerificado={pagoVerificado}
                      estado={pedido.estado}
                      compacto
                    />
                  </td>

                  {/* Acciones */}
                  <td className="p-4 align-top text-center">
                    {pagoVerificado ? (
                      <button
                        disabled={estaProcesando}
                        onClick={() => handleAccionEntregar(pedido.id)}
                        className="w-full min-w-[130px] rounded-xl bg-green-700 px-3 py-2 text-xs font-black text-white hover:bg-green-800 transition shadow-sm disabled:opacity-50"
                      >
                        {estaProcesando ? "Procesando..." : "Marcar Entregado"}
                      </button>
                    ) : (
                      <button
                        disabled={estaProcesando}
                        onClick={() => handleAccionConfirmar(pedido.id)}
                        className="w-full min-w-[130px] rounded-xl bg-purple-700 px-3 py-2 text-xs font-black text-white hover:bg-purple-800 transition shadow-md animate-pulse disabled:opacity-50"
                      >
                        {estaProcesando ? "Confirmando..." : "Confirmar Pago"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      </div>   
     </div>
    </section>
  );
}
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import { obtenerPedido } from "@/services/pedidosService";
import { STORE_CONFIG } from "@/config/store";

import { CheckCircle2, CircleCheck, Clock3, House, MapPin, PackageCheck, PackageOpen, Phone, ShoppingBag, Store, Truck, WalletCards, } from "lucide-react";

const ORDER_STATUS = {
  pendiente: {
    label: "Pedido recibido",
    description:
      "Hemos recibido tu pedido y estamos revisando la información.",
    icon: Clock3,
  },

  confirmado: {
    label: "Pedido confirmado",
    description:
      "Tu pedido fue confirmado correctamente.",
    icon: CircleCheck,
  },

  preparando: {
    label: "Preparando pedido",
    description:
      "Estamos preparando tus prendas para la entrega.",
    icon: PackageOpen,
  },

  listo: {
    label: "Pedido listo",
    description:
      "Tu pedido está listo para continuar con la entrega.",
    icon: PackageCheck,
  },

  enviado: {
    label: "Pedido en camino",
    description:
      "Tu pedido salió de JOMI Store y se encuentra en camino.",
    icon: Truck,
  },

  entregado: {
    label: "Pedido entregado",
    description:
      "Tu pedido fue entregado correctamente.",
    icon: PackageCheck,
  },

  cancelado: {
    label: "Pedido cancelado",
    description:
      "Este pedido fue cancelado.",
    icon: Clock3,
  },
};

function normalizarEstado(estado) {
  return String(estado || "pendiente") .trim() .toLowerCase();
}

function normalizarMetodoEntrega(metodo) {
  return String(metodo || "delivery") .trim() .toLowerCase();
}

function obtenerProductos(pedido) {
  if (!pedido?.productos) {
    return [];
  }

  if (Array.isArray(pedido.productos)) {
    return pedido.productos;
  }

  if (typeof pedido.productos === "string") {
    try {
      const productos = JSON.parse(pedido.productos);

      return Array.isArray(productos)
        ? productos
        : [];
    } catch {
      return [];
    }
  }

  return [];
}

function formatearPrecio(valor) {
  const numero = Number(valor);

  if (!Number.isFinite(numero)) {
    return "0.00";
  }

  return numero.toFixed(2);
}

export default function PedidoDetallePage() {
  const params = useParams();
  const id = params?.id;

  const [pedido, setPedido] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    let componenteActivo = true;

    const cargarPedido = async () => {
      try {
        setError("");

        const data = await obtenerPedido(id);

        if (componenteActivo && data) {
          setPedido(data);
        }
      } catch (errorPedido) {
        console.error(
          "Error al cargar el pedido:",
          errorPedido
        );

        if (componenteActivo) {
          setError(
            errorPedido?.message ||
              "No pudimos cargar la información del pedido."
          );
        }
      } finally {
        if (componenteActivo) {
          setCargando(false);
        }
      }
    };

    cargarPedido();

    /*
     * Dejamos preparado el polling para Business.
     *
     * Cuando conectemos el backend real, permitirá que
     * el cliente vea cambios realizados desde el panel
     * administrativo sin recargar manualmente.
     */
    const intervalo = window.setInterval(
      cargarPedido,
      15000
    );

    return () => {
      componenteActivo = false;

      window.clearInterval(intervalo);
    };
  }, [id]);

  const productos = useMemo(
    () => obtenerProductos(pedido),
    [pedido]
  );

  if (cargando) {
    return (
      <main className="min-h-screen bg-jomi-white">
        <Navbar />

        <section className="jomi-container py-16">
          <div className="mx-auto max-w-3xl">
            <div
              className="
                flex
                min-h-72
                flex-col
                items-center
                justify-center
                rounded-3xl
                border
                border-jomi-border
                bg-white
                px-6
                text-center
              "
            >
              <div
                className="
                  h-10
                  w-10
                  animate-spin
                  rounded-full
                  border-4
                  border-jomi-primary/20
                  border-t-jomi-primary
                "
              />

              <p className="mt-5 text-sm font-medium text-black/60">
                Cargando información de tu pedido...
              </p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error || !pedido) {
    return (
      <main className="min-h-screen bg-jomi-white">
        <Navbar />

        <section className="jomi-container py-16">
          <div className="mx-auto max-w-xl">
            <div
              className="
                rounded-3xl
                border
                border-jomi-sale/20
                bg-white
                px-6
                py-12
                text-center
                shadow-sm
              "
            >
              <PackageOpen
                size={52}
                className="mx-auto text-jomi-sale"
              />

              <h1 className="mt-5 text-2xl font-semibold text-jomi-black">
                No encontramos tu pedido
              </h1>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-black/55">
                {error ||
                  "Verifica que el número del pedido sea correcto."}
              </p>

              <Link
                href="/"
                className="
                  mt-7
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-jomi-primary
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-jomi-white
                  transition
                  hover:bg-jomi-secondary
                "
              >
                <House size={17} />

                Volver al catálogo
              </Link>
            </div>
          </div>
        </section>
      </main>
    );
  }

  const estado =
    normalizarEstado(pedido.estado);

  const status = ORDER_STATUS[estado] || ORDER_STATUS.pendiente;

  const StatusIcon = status.icon;

  const metodoEntrega =
    normalizarMetodoEntrega( pedido.metodo_entrega || pedido.delivery_method );

  const esDelivery = metodoEntrega === "delivery";

  const pedidoEntregado = estado === "entregado";

  const total =
    pedido.total ??
    productos.reduce((acumulado, item) => acumulado + Number(item.precio || 0) * Number(item.cantidad || 0), 0 );

  if (pedidoEntregado) {
    return (
      <main className="min-h-screen bg-jomi-white">
        <Navbar />

        <section className="jomi-container py-10 sm:py-16">
          <div className="mx-auto max-w-3xl">
            <div
              className="
                overflow-hidden
                rounded-3xl
                border
                border-jomi-secondary/20
                bg-white
                shadow-sm
              "
            >
              <div
                className="
                  flex
                  flex-col
                  items-center
                  bg-jomi-secondary/10
                  px-6
                  py-12
                  text-center
                "
              >
                <div
                  className="
                    flex
                    h-24
                    w-24
                    items-center
                    justify-center
                    rounded-full
                    bg-jomi-secondary
                    text-white
                  "
                >
                  <PackageCheck size={48} />
                </div>

                <p
                  className="
                    mt-6
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-jomi-secondary
                  "
                >
                  Pedido entregado
                </p>

                <h1
                  className="
                    mt-2
                    text-3xl
                    font-semibold
                    text-jomi-black
                  "
                >
                  ¡Gracias por tu compra!
                </h1>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-md
                    text-sm
                    leading-6
                    text-black/60
                  "
                >
                  Esperamos que disfrutes tus prendas de
                  JOMI Store.
                </p>
              </div>

              <div className="px-6 py-7 text-center">
                <p className="text-sm text-black/50">
                  Pedido
                </p>

                <p className="mt-1 font-semibold text-jomi-black">
                  #{pedido.id}
                </p>

                <Link
                  href="/"
                  className="
                    mt-6
                    inline-flex
                    items-center
                    justify-center
                    rounded-xl
                    bg-jomi-primary
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-jomi-white
                    transition
                    hover:bg-jomi-secondary
                  "
                >
                  Seguir comprando
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-jomi-white">
      <Navbar />

      <section className="jomi-container py-8 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Confirmación */}
          <section
            className="
              rounded-3xl
              border
              border-jomi-primary/15
              bg-white
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="
                  flex
                  h-16
                  w-16
                  items-center
                  justify-center
                  rounded-full
                  bg-jomi-primary/10
                  text-jomi-primary
                "
              >
                <CheckCircle2 size={34} />
              </div>

              <p
                className="
                  mt-5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-jomi-secondary
                "
              >
                JOMI Store
              </p>

              <h1
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  text-jomi-black
                  sm:text-3xl
                "
              >
                Tu pedido fue registrado
              </h1>

              <p
                className="
                  mt-3
                  max-w-lg
                  text-sm
                  leading-6
                  text-black/55
                "
              >
                Conserva el número de pedido para
                consultar su estado.
              </p>

              <div
                className="
                  mt-5
                  rounded-full
                  bg-jomi-soft
                  px-5
                  py-2
                  text-sm
                  font-semibold
                  text-jomi-black
                "
              >
                Pedido #{pedido.id}
              </div>
            </div>
          </section>

          {/* Estado */}
          <section
            className="
              mt-5
              rounded-3xl
              border
              border-jomi-border
              bg-white
              p-6
              sm:p-7
            "
          >
            <div className="flex items-start gap-4">
              <div
                className="
                  flex
                  h-12
                  w-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-jomi-secondary/10
                  text-jomi-secondary
                "
              >
                <StatusIcon size={23} />
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-[0.15em] text-black/45">
                  Estado actual
                </p>

                <h2 className="mt-1 text-lg font-semibold text-jomi-black">
                  {status.label}
                </h2>

                <p className="mt-1 text-sm leading-6 text-black/55">
                  {status.description}
                </p>
              </div>
            </div>
          </section>

          {/* Cliente y entrega */}
          <section
            className="
              mt-5
              grid
              gap-4
              sm:grid-cols-2
            "
          >
            <div
              className="
                rounded-3xl
                border
                border-jomi-border
                bg-white
                p-6
              "
            >
              <h2 className="font-semibold text-jomi-black">
                Datos del pedido
              </h2>

              <div className="mt-5 space-y-4">
                <div className="flex gap-3">
                  <ShoppingBag
                    size={18}
                    className="mt-0.5 shrink-0 text-jomi-primary"
                  />

                  <div>
                    <p className="text-xs text-black/45">
                      Cliente
                    </p>

                    <p className="mt-1 text-sm font-medium text-jomi-black">
                      {pedido.cliente_nombre ||
                        pedido.clienteNombre ||
                        "Cliente"}
                    </p>
                  </div>
                </div>

                {pedido.cliente_telefono && (
                  <div className="flex gap-3">
                    <Phone
                      size={18}
                      className="mt-0.5 shrink-0 text-jomi-primary"
                    />

                    <div>
                      <p className="text-xs text-black/45">
                        Teléfono
                      </p>

                      <p className="mt-1 text-sm font-medium text-jomi-black">
                        {pedido.cliente_telefono}
                      </p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <WalletCards
                    size={18}
                    className="mt-0.5 shrink-0 text-jomi-primary"
                  />

                  <div>
                    <p className="text-xs text-black/45">
                      Forma de pago
                    </p>

                    <p className="mt-1 text-sm font-medium text-jomi-black">
                      Pago contraentrega
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="
                rounded-3xl
                border
                border-jomi-border
                bg-white
                p-6
              "
            >
              <h2 className="font-semibold text-jomi-black">
                Entrega
              </h2>

              <div className="mt-5 flex gap-3">
                {esDelivery ? (
                  <Truck
                    size={20}
                    className="mt-0.5 shrink-0 text-jomi-secondary"
                  />
                ) : (
                  <Store
                    size={20}
                    className="mt-0.5 shrink-0 text-jomi-secondary"
                  />
                )}

                <div>
                  <p className="text-sm font-medium text-jomi-black">
                    {esDelivery
                      ? "Delivery"
                      : "Recojo coordinado"}
                  </p>

                  {esDelivery && (
                    <div className="mt-3 space-y-1 text-sm leading-6 text-black/55">
                      {pedido.direccion?.distrito && (
                        <p>
                          {
                            pedido.direccion
                              .distrito
                          }
                        </p>
                      )}

                      {pedido.direccion
                        ?.direccion && (
                        <p>
                          {
                            pedido.direccion
                              .direccion
                          }
                        </p>
                      )}

                      {pedido.direccion
                        ?.referencia && (
                        <p className="text-xs">
                          Ref.{" "}
                          {
                            pedido.direccion
                              .referencia
                          }
                        </p>
                      )}
                    </div>
                  )}

                  {!esDelivery && (
                    <p className="mt-2 text-sm leading-6 text-black/55">
                      JOMI Store se comunicará contigo
                      para coordinar el recojo.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Productos */}
          <section
            className="
              mt-5
              rounded-3xl
              border
              border-jomi-border
              bg-white
              p-6
              sm:p-7
            "
          >
            <h2 className="font-semibold text-jomi-black">
              Detalle del pedido
            </h2>

            <div className="mt-5 divide-y divide-jomi-border">
              {productos.map((item, index) => {
                const cantidad = Number(item.cantidad) || 0;
                const precio = Number(item.precio) || 0;
                const subtotal = cantidad * precio;

                return (
                  <div
                    key={ item.variante_id || item.varianteId || item.id || index }
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      py-4
                      first:pt-0
                    "
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-jomi-black">
                        {item.nombre}
                      </p>

                      <div className=" mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-black/45 " >
                        <span> Cantidad: {cantidad} </span>

                        {item.talla && ( <span> Talla:{" "} {Array.isArray( item.talla )
                              ? item.talla.join( " / " )
                              : item.talla}
                          </span> )}

                        {item.color && ( <span> Color:{" "} {Array.isArray( item.color )
                              ? item.color.join( " / " )
                              : item.color}
                          </span> )}
                      </div>
                    </div>

                    <p className=" shrink-0 text-sm font-semibold text-jomi-black " >
                      { STORE_CONFIG.currency.symbol }{" "} {formatearPrecio( subtotal )}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className=" mt-2 border-t border-jomi-border pt-5 " >
              {pedido.delivery_cost > 0 && (
                <div className="mb-3 flex justify-between text-sm text-black/55">
                  <span>Delivery</span>

                  <span> { STORE_CONFIG.currency.symbol }{" "} {formatearPrecio( pedido.delivery_cost )} </span>
                </div>
              )}

              {esDelivery &&
                !pedido.delivery_cost && (
                  <div className="mb-3 flex justify-between gap-4 text-sm text-black/55">
                    <span>Delivery</span>
                    <span className="text-right"> Por confirmar </span>
                  </div>
                )}

              <div className="flex items-end justify-between gap-4">
                <span className="font-semibold text-jomi-black"> Total productos </span>
                <span className="text-xl font-bold text-jomi-black"> { STORE_CONFIG.currency .symbol }{" "} {formatearPrecio(total)} </span>
              </div>
            </div>
          </section>

          {/* Pago */}
          <section className="mt-5 rounded-3xl border border-jomi-secondary/20 bg-jomi-secondary/8 p-5 " >
            <div className="flex items-start gap-3">
              <WalletCards
                size={21}
                className="mt-0.5 shrink-0 text-jomi-secondary"
              />

              <div>
                <h2 className="font-semibold text-jomi-black"> Pago contraentrega </h2>

                <p className="mt-1 text-sm leading-6 text-black/55">
                  No necesitas realizar ningún pago
                  anticipado. El pago se realizará al
                  momento de recibir tu pedido.
                </p>
              </div>
            </div>
          </section>

          {/* Volver */}
          <div className="mt-7 text-center">
            <Link
              href="/"
              className=" inline-flex items-center justify-center  gap-2 rounded-xl border border-jomi-primary px-5 py-3 text-sm font-semibold text-jomi-primary transition hover:bg-jomi-primary hover:text-jomi-white "
            >
              <House size={17} />
              Volver al catálogo
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
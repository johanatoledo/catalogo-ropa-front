"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Banknote, ShoppingBag, X, } from "lucide-react";
import CustomerForm from "@/components/checkout/CustomerForm";
import DeliverySelector from "@/components/checkout/DeliverySelector";
import { crearPedido } from "@/services/pedidosService";
import { STORE_CONFIG, } from "@/config/store";

const INITIAL_FORM = {
  nombre: "",
  telefono: "",
  metodoEntrega:
    STORE_CONFIG.delivery.defaultMethod,
  distrito: "",
  direccion: "",
  referencia: "",
};

export default function CheckoutPanel({ carrito, total, onClose, onPedidoCreado, }) {
  const router = useRouter();

  const itemsPedido = Array.isArray(carrito)
    ? carrito
    : [];

  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [cargando, setCargando] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  const subtotal = useMemo( () => itemsPedido.reduce( (acumulado, item) => acumulado + Number(item.precio || 0) * Number(item.cantidad || 0), 0 ), [itemsPedido] );

  /*
   * Por ahora el delivery no tiene precio automático.
   * Posteriormente deberá calcularse desde el backend
   * utilizando distrito + zona + tarifa.
   */
  const deliveryCost = 0;

  const totalPedido = subtotal + deliveryCost;

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape" && !cargando) {
        onClose();
      }
    };

    document.addEventListener( "keydown", handleEscape );

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener( "keydown", handleEscape );

      document.body.style.overflow = previousOverflow;
    };
  }, [cargando, onClose]);

  const actualizarCampo = (campo, valor) => {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));

    if (errors[campo]) {
      setErrors((prev) => {
        const nuevosErrores = { ...prev };
        delete nuevosErrores[campo];

        return nuevosErrores;
      });
    }

    if (mensajeError) {
      setMensajeError("");
    }
  };

  const cambiarMetodoEntrega = (metodo) => {
    setForm((prev) => ({
      ...prev,

      metodoEntrega: metodo,

      /*
       * Si cambia a recojo eliminamos los datos
       * de dirección que ya no son necesarios.
       */
      distrito: metodo === "pickup" ? "" : prev.distrito,

      direccion: metodo === "pickup"  ? "" : prev.direccion,

      referencia: metodo === "pickup" ? "" : prev.referencia,
    }));

    setErrors((prev) => {
      const nuevosErrores = { ...prev };

      delete nuevosErrores.distrito;
      delete nuevosErrores.direccion;

      return nuevosErrores;
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    const nombre = form.nombre.trim();
    const telefono = form.telefono .replace(/\s+/g, "") .trim();

    if (!nombre) {
      nuevosErrores.nombre = "Ingresa tu nombre completo.";
    } else if (nombre.length < 3) {
      nuevosErrores.nombre = "Ingresa un nombre válido.";
    }

    if (!telefono) {
      nuevosErrores.telefono = "Ingresa un número de contacto.";
    } else if (!/^[0-9+]{9,15}$/.test(telefono)) {
      nuevosErrores.telefono = "Ingresa un teléfono válido.";
    }

    if (
      form.metodoEntrega === "delivery"
    ) {
      if (!form.distrito.trim()) {
        nuevosErrores.distrito = "Indica el distrito de entrega.";
      }

      if (!form.direccion.trim()) {
        nuevosErrores.direccion = "Ingresa la dirección de entrega.";
      }
    }

    setErrors(nuevosErrores);

    return (
      Object.keys(nuevosErrores).length === 0
    );
  };

  const confirmarPedido = async () => {
    setMensajeError("");
    setMensajeExito("");

    if (!validarFormulario()) {
      return;
    }

    if (itemsPedido.length === 0) {
      setMensajeError(
        "Tu carrito está vacío."
      );

      return;
    }

    if ( !Number.isFinite(totalPedido) || totalPedido <= 0) {
      setMensajeError( "No se pudo calcular correctamente el total del pedido." );
      return;
    }

    try {
      setCargando(true);

      /*
       * IMPORTANTE:
       *
       * Los precios y el total enviados desde el navegador
       * NO deben considerarse confiables en producción.
       *
       * El backend deberá consultar los precios reales
       * desde MySQL utilizando producto_id / variante_id
       * y calcular nuevamente el total.
       */
      const data = {
        cliente_nombre: form.nombre.trim(),
        cliente_telefono: form.telefono.trim(),
        metodo_entrega: form.metodoEntrega,
        direccion:
          form.metodoEntrega === "delivery"
            ? {
                distrito: form.distrito.trim(),
                direccion: form.direccion.trim(),
                referencia: form.referencia.trim() || null,
              }
            : null,

        metodo_pago: STORE_CONFIG.payment.method,

        productos: itemsPedido.map(
          (item) => ({
            producto_id: item.id,
            variante_id: item.varianteId ?? null,
            nombre: item.nombre,
            cantidad: Number( item.cantidad ),
            precio: Number(item.precio),
            color: item.color ?? null,
            talla: item.talla ?? null,
          })
        ),
        subtotal,
        delivery_cost: deliveryCost,
        total: totalPedido,
      };

      const respuesta = await crearPedido(data);

      if (!respuesta?.pedidoId) {
        throw new Error(
          "No se recibió el identificador del pedido."
        );
      }

      setMensajeExito(
        "Pedido registrado correctamente."
      );

      /*
       * CheckoutPanel no toca localStorage.
       * CatalogClient es el propietario del carrito
       * y debe limpiarlo.
       */
      onPedidoCreado?.();

      router.push( `/pedido/${respuesta.pedidoId}` );
    } catch (error) {
      console.error( "Error al crear pedido:", error );
      setMensajeError(  error?.message || "No pudimos registrar tu pedido. Inténtalo nuevamente." );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-100
        overflow-y-auto
        bg-black/45
        px-3
        py-4
        backdrop-blur-sm
        sm:px-4
        sm:py-6
      "
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
      onMouseDown={(event) => {
        if ( event.target === event.currentTarget && !cargando) {
          onClose();
        }
      }}
    >
      <div
        className="
          mx-auto
          flex
          max-h-[calc(100dvh-2rem)]
          w-full
          max-w-2xl
          flex-col
          overflow-hidden
          rounded-2xl
          bg-jomi-white
          shadow-2xl
          sm:max-h-[90vh]
          sm:rounded-3xl
        "
      >
        {/* HEADER */}
        <header
          className="
            flex
            shrink-0
            items-center
            justify-between
            border-b
            border-jomi-border
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-jomi-secondary">
              JOMI Store
            </p>

            <h2
              id="checkout-title"
              className="mt-1 text-xl font-semibold text-jomi-black sm:text-2xl"
            >
              Confirmar pedido
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={cargando}
            aria-label="Cerrar checkout"
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              bg-jomi-soft
              text-jomi-black
              transition
              hover:bg-jomi-primary/10
              hover:text-jomi-primary
              disabled:pointer-events-none
            "
          >
            <X size={20} />
          </button>
        </header>

        {/* CONTENIDO */}
        <div
          className="
            flex-1
            space-y-8
            overflow-y-auto
            px-5
            py-6
            sm:px-6
          "
        >
          {/* RESUMEN PRODUCTOS */}
          <section
            aria-labelledby="order-summary-title"
          >
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-full
                  bg-jomi-primary/10
                  text-jomi-primary
                "
              >
                <ShoppingBag size={19} />
              </div>

              <div>
                <h3
                  id="order-summary-title"
                  className="font-semibold text-jomi-black"
                >
                  Tu pedido
                </h3>

                <p className="text-xs text-black/50">
                  {itemsPedido.reduce(
                    (totalItems, item) => totalItems + Number( item.cantidad || 0 ), 0
                  )}{" "}
                  productos
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                max-h-56
                space-y-1
                overflow-y-auto
                rounded-2xl
                border
                border-jomi-border
                bg-white
                p-2
              "
            >
              {itemsPedido.map((item) => {
                const itemSubtotal = Number(item.precio || 0) * Number( item.cantidad || 0 );

                return (
                  <div
                    key={
                      item.varianteId
                        ? `${item.id}-${item.varianteId}`
                        : item.id
                    }
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                      rounded-xl
                      px-3
                      py-3
                    "
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-jomi-black">
                        {item.nombre}
                      </p>

                      <div className="mt-1 flex flex-wrap gap-x-2 text-xs text-black/50">
                        <span>
                          Cantidad:{" "}
                          {item.cantidad}
                        </span>

                        {item.talla && (
                          <span>
                            Talla:{" "}
                            {Array.isArray( item.talla )
                              ? item.talla.join(
                                  " / "
                                )
                              : item.talla}
                          </span>
                        )}
                      </div>
                    </div>

                    <span className="shrink-0 text-sm font-semibold text-jomi-black">
                      {
                        STORE_CONFIG.currency
                          .symbol
                      }{" "}
                      {itemSubtotal.toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ENTREGA */}
          <DeliverySelector
            value={form.metodoEntrega}
            onChange={
              cambiarMetodoEntrega
            }
          />

          {/* CLIENTE */}
          <CustomerForm
            form={form}
            errors={errors}
            onChange={actualizarCampo}
          />

          {/* CONTRAENTREGA */}
          <section
            className="
              rounded-2xl
              border
              border-jomi-secondary/20
              bg-jomi-secondary/8
              p-4
              sm:p-5
            "
          >
            <div className="flex items-start gap-3">
              <div
                className="
                  flex
                  h-10
                  w-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-jomi-secondary/15
                  text-jomi-secondary
                "
              >
                <Banknote size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-jomi-black">
                  { STORE_CONFIG.payment.label }
                </h3>

                <p className="mt-1 text-sm leading-6 text-black/60">
                  { STORE_CONFIG.payment.description }
                </p>
              </div>
            </div>
          </section>

          {/* ERRORES */}
          {mensajeError && (
            <div
              role="alert"
              className="
                rounded-xl
                border
                border-jomi-sale/20
                bg-jomi-sale/5
                px-4
                py-3
                text-sm
                font-medium
                text-jomi-sale
              "
            >
              {mensajeError}
            </div>
          )}

          {mensajeExito && (
            <div
              role="status"
              className="
                rounded-xl
                border
                border-jomi-secondary/25
                bg-jomi-secondary/10
                px-4
                py-3
                text-sm
                font-medium
                text-jomi-secondary
              "
            >
              {mensajeExito}
            </div>
          )}
        </div>

        {/* FOOTER */}
        <footer
          className="
            shrink-0
            border-t
            border-jomi-border
            bg-jomi-white
            px-5
            py-4
            sm:px-6
            sm:py-5
          "
        >
          <div className="mb-4 space-y-2">
            <div className="flex justify-between gap-4 text-sm text-black/60">
              <span>Subtotal</span>

              <span>
                {
                  STORE_CONFIG.currency
                    .symbol
                }{" "}
                {subtotal.toFixed(2)}
              </span>
            </div>

            {form.metodoEntrega ===
              "delivery" && (
              <div className="flex justify-between gap-4 text-sm text-black/60">
                <span>Delivery</span>

                <span className="text-right text-xs">
                  Por confirmar
                </span>
              </div>
            )}

            <div
              className="
                flex
                items-end
                justify-between
                gap-4
                border-t
                border-jomi-border
                pt-3
              "
            >
              <span className="font-semibold text-jomi-black">
                Total productos
              </span>

              <span className="text-xl font-bold text-jomi-black">
                { STORE_CONFIG.currency.symbol }{" "} {totalPedido.toFixed(2)}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={confirmarPedido}
            disabled={ cargando || itemsPedido.length === 0 }
            className="
              flex
              min-h-12
              w-full
              items-center
              justify-center
              rounded-xl
              bg-jomi-primary
              px-5
              py-3
              text-sm
              font-bold
              uppercase
              tracking-widest
              text-jomi-white
              transition-all
              hover:bg-jomi-secondary
              active:scale-[0.99]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {cargando
              ? "Registrando pedido..."
              : "Confirmar pedido"}
          </button>

          <p className="mt-3 text-center text-[11px] leading-5 text-black/45">
            No realizarás ningún pago en este momento.
          </p>
        </footer>
      </div>
    </div>
  );
}
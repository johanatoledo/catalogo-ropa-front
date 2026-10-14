import { ShoppingBag } from "lucide-react";

export default function CartBar({ carrito = [], onOpenCheckout, }) {
  const cantidadProductos = carrito.reduce( (total, item) => total + Number(item.cantidad || 0), 0 );

  const total = carrito.reduce(
    (acumulado, item) =>
      acumulado +
      Number(item.precio || 0) *
        Number(item.cantidad || 0), 0
  );

  if (carrito.length === 0) {
    return null;
  }

  return (
    <aside
      aria-label="Resumen del carrito"
      className="
        fixed
        bottom-4
        left-1/2
        z-50
        w-[calc(100%-1.5rem)]
        max-w-2xl
        -translate-x-1/2
        rounded-2xl
        border
        border-jomi-primary/10
        bg-jomi-white/95
        p-3
        shadow-xl
        backdrop-blur-xl
        sm:bottom-6
        sm:p-4
      "
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-11
              w-11
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-jomi-primary/10
              text-jomi-primary
            "
          >
            <ShoppingBag size={21} />
          </div>

          <div className="min-w-0">
            <p className="text-xs font-medium text-black/55 sm:text-sm">
              {cantidadProductos}{" "}
              {cantidadProductos === 1
                ? "producto"
                : "productos"}
            </p>

            <p className="text-base font-semibold text-jomi-black sm:text-lg">
              S/ {total.toFixed(2)}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenCheckout}
          className="
            shrink-0
            rounded-xl
            bg-jomi-primary
            px-4
            py-3
            text-xs
            font-bold
            uppercase
            tracking-wider
            text-jomi-white
            transition
            hover:bg-jomi-secondary
            active:scale-[0.98]
            sm:px-5
          "
        >
          Ver pedido
        </button>
      </div>
    </aside>
  );
}
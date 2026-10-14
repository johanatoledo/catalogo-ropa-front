"use client";

import {
  MapPin,
  Store,
  Truck,
} from "lucide-react";

import { STORE_CONFIG } from "@/config/store";

export default function DeliverySelector({
  value,
  onChange,
}) {
  const delivery =
    STORE_CONFIG.delivery.methods.delivery;

  const pickup =
    STORE_CONFIG.delivery.methods.pickup;

  const opciones = [
    {
      ...delivery,
      icon: Truck,
    },
    {
      ...pickup,
      icon: Store,
    },
  ];

  return (
    <fieldset>
      <legend className="text-lg font-semibold text-jomi-black">
        Método de entrega
      </legend>

      <p className="mt-1 text-sm leading-6 text-black/55">
        Selecciona cómo quieres recibir tu pedido.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {opciones.map(
          ({
            id,
            label,
            description,
            icon: Icon,
          }) => {
            const activo = value === id;

            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                aria-pressed={activo}
                className={`
                  relative
                  rounded-2xl
                  border
                  p-4
                  text-left
                  transition-all
                  duration-200
                  ${
                    activo
                      ? `
                        border-jomi-primary
                        bg-jomi-primary/5
                        shadow-sm
                      `
                      : `
                        border-jomi-border
                        bg-jomi-white
                        hover:border-jomi-primary/40
                        hover:bg-jomi-soft
                      `
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-full
                      ${
                        activo
                          ? "bg-jomi-primary text-jomi-white"
                          : "bg-jomi-soft text-black/55"
                      }
                    `}
                  >
                    <Icon size={19} />
                  </div>

                  <div>
                    <p
                      className={`
                        font-semibold
                        ${
                          activo
                            ? "text-jomi-primary"
                            : "text-jomi-black"
                        }
                      `}
                    >
                      {label}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-black/55">
                      {description}
                    </p>
                  </div>
                </div>
              </button>
            );
          }
        )}
      </div>

      {value === "delivery" && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-3
            rounded-xl
            bg-jomi-secondary/10
            px-4
            py-3
          "
        >
          <MapPin
            size={18}
            className="mt-0.5 shrink-0 text-jomi-secondary"
          />

          <p className="text-xs leading-5 text-black/65">
            El costo y disponibilidad del delivery se confirmarán de acuerdo
            con el distrito indicado antes del despacho.
          </p>
        </div>
      )}
    </fieldset>
  );
}
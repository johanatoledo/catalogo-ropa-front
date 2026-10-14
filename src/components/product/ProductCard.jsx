"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { Check, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";


function normalizarOpciones(valor) {
  if (!valor) return [];

  if (Array.isArray(valor)) {
    return valor
      .flatMap((item) =>
        String(item)
          .split(/[\/,•|]/)
          .map((opcion) => opcion.trim())
      )
      .filter(Boolean);
  }

  return String(valor)
    .split(/[\/,•|]/)
    .map((opcion) => opcion.trim())
    .filter(Boolean);
}

export default function ProductCard({
  producto,
  moneda = "S/",
  seleccionado = false,
  onSeleccionar,
  onEliminarSeleccion,
}) {
  const { nombre, precio, imagen, imagenHover, color, talla, badge } = producto;

  const colores = useMemo(() => normalizarOpciones(color), [color]);
  const tallas = useMemo(() => normalizarOpciones(talla), [talla]);

  const [colorSeleccionado, setColorSeleccionado] = useState(
    colores.length === 1 ? colores[0] : ""
  );

  const [tallaSeleccionada, setTallaSeleccionada] = useState(
    tallas.length === 1 ? tallas[0] : ""
  );

  const [cantidad, setCantidad] = useState(1);
  const [errorSeleccion, setErrorSeleccion] = useState("");

  const precioNumerico = Number(precio || 0);
  const total = precioNumerico * cantidad;

  const badgeNormalizado = String(badge || "").trim().toUpperCase();
  const esOferta = badgeNormalizado === "OFERTA";

  const disminuirCantidad = () => {
    setCantidad((actual) => Math.max(1, actual - 1));
  };

  const aumentarCantidad = () => {
    setCantidad((actual) => Math.min(10, actual + 1));
  };

  const seleccionarColor = (opcion) => {
    setColorSeleccionado((actual) => (actual === opcion ? "" : opcion));
    setErrorSeleccion("");
  };

  const seleccionarTalla = (opcion) => {
    setTallaSeleccionada((actual) => (actual === opcion ? "" : opcion));
    setErrorSeleccion("");
  };

  const seleccionarProducto = () => {
    if (colores.length > 0 && !colorSeleccionado) {
      setErrorSeleccion("Selecciona un color antes de comprar.");
      return;
    }

    if (tallas.length > 0 && !tallaSeleccionada) {
      setErrorSeleccion("Selecciona una talla antes de comprar.");
      return;
    }

    setErrorSeleccion("");

    onSeleccionar({
      producto,
      color: colorSeleccionado,
      talla: tallaSeleccionada,
      cantidad,
      total,
    });
  };

  const quitarProducto = () => {
    onEliminarSeleccion(producto.id);
    setErrorSeleccion("");
  };

  return (
    <article className="group relative flex w-[78vw] max-w-70 shrink-0 snap-start flex-col bg-white select-none sm:w-full sm:max-w-none sm:shrink">
      <div className="relative aspect-3/4 w-full overflow-hidden bg-jomi-soft">
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
          className={`jomi-image transition-all duration-700 ease-out group-hover:scale-105 ${imagenHover ? "md:group-hover:opacity-0" : ""}`}
        />

        {imagenHover && (
          <Image
            src={imagenHover}
            alt={`${nombre} - segunda vista`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
            className="jomi-image pointer-events-none opacity-0 transition-all duration-700 ease-out md:group-hover:scale-105 md:group-hover:opacity-100"
          />
        )}

        {badge && (
          <span className={`absolute left-3 top-3 z-10 px-2.5 py-1.5 text-[0.5rem] font-semibold uppercase tracking-[0.15em] text-white backdrop-blur-sm ${esOferta ? "bg-jomi-red/95" : "bg-jomi-black/80"}`}>
            {badge}
          </span>
        )}

        {seleccionado && (
          <span className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full bg-jomi-primary px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm">
            <Check size={12} />
            Seleccionado
          </span>
        )}
      </div>

      <div className="flex min-h-64 flex-col px-1 pb-3 pt-4">
        <h3 className="line-clamp-2 min-h-10 text-sm font-medium uppercase leading-5 tracking-wide text-jomi-black">
          {nombre}
        </h3>

        {colores.length > 0 && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black">
              Color
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {colores.map((opcion) => {
                const activo = colorSeleccionado === opcion;

                return (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => seleccionarColor(opcion)}
                    aria-pressed={activo}
                    disabled={seleccionado}
                    className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${activo ? "border-jomi-primary bg-jomi-primary/10 text-jomi-primary" : "border-jomi-border bg-white text-black/60 hover:border-jomi-primary/50"}`}
                  >
                    {activo && <Check size={11} />}
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {tallas.length > 0 && (
          <div className="mt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-black">
              Talla
            </p>

            <div className="mt-2 flex flex-wrap gap-2">
              {tallas.map((opcion) => {
                const activo = tallaSeleccionada === opcion;

                return (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => seleccionarTalla(opcion)}
                    aria-pressed={activo}
                    disabled={seleccionado}
                    className={`flex h-9 min-w-10 items-center justify-center border px-3 text-[11px] font-semibold uppercase transition-colors disabled:cursor-not-allowed disabled:opacity-60 ${activo ? "border-jomi-primary bg-jomi-primary text-jomi-cian" : "border-jomi-border bg-white text-black/60 hover:border-jomi-primary hover:text-black-chic"}`}
                  >
                    {opcion}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {errorSeleccion && (
          <p role="alert" className="mt-3 text-xs font-medium text-jomi-red">
            *{errorSeleccion}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex h-10 items-center overflow-hidden rounded-xl border border-jomi-border bg-white">
            <button
              type="button"
              onClick={disminuirCantidad}
              disabled={cantidad <= 1 || seleccionado}
              aria-label="Disminuir cantidad"
              className="flex h-full w-9 items-center justify-center text-black/60 transition-colors hover:bg-jomi-soft hover:text-jomi-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Minus size={14} />
            </button>

            <span className="min-w-8 text-center text-xs font-semibold text-jomi-black">
              {cantidad}
            </span>

            <button
              type="button"
              onClick={aumentarCantidad}
              disabled={cantidad >= 10 || seleccionado}
              aria-label="Aumentar cantidad"
              className="flex h-full w-9 items-center justify-center text-black/60 transition-colors hover:bg-jomi-soft hover:text-jomi-primary disabled:cursor-not-allowed disabled:opacity-30"
            >
              <Plus size={14} />
            </button>
          </div>

          <span className="text-sm font-bold text-jomi-primary">
            {moneda} {total.toFixed(2)}
          </span>
        </div>

        {seleccionado ? (
          <button
            type="button"
            onClick={quitarProducto}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-jomi-red px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-jomi-red transition-all hover:bg-jomi-red hover:text-white active:scale-[0.99]"
          >
            <Trash2 size={16} />
            Quitar selección
          </button>
        ) : (
          <button
            type="button"
            onClick={seleccionarProducto}
            className="mt-3 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-jomi-primary px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black-chic transition-all hover:bg-sandstone hover:text-jomi-cian active:scale-[0.99]"
          >
            <ShoppingBag size={16} className="text-lila-jomi" />
            Comprar
          </button>
        )}
      </div>
    </article>
  );
}
"use client";

import Image from "next/image";
import { Plus, Trash2, Check } from "lucide-react";

export default function ProductCard({
  producto,
  cantidad = 0,
  moneda = "S/",
  onAgregar,
  onEliminar,
}) {
  const estaEnCarrito = cantidad > 0;

  const { id, nombre, precio, imagen, imagenHover, color, talla, badge, } = producto;

  const coloresTexto = Array.isArray(color)
    ? color.join(" • ")
    : color;

  const tallasTexto = Array.isArray(talla)
    ? talla.join(" / ")
    : talla;

  return (
    <article className=" group relative flex w-[78vw] max-w-70 shrink-0 snap-start flex-col bg-white select-none sm:w-full sm:max-w-none sm:shrink ">
      {/* IMAGEN */}
      <div className="relative aspect-3/4 w-full overflow-hidden bg-gray-100">

        {/* Imagen principal */}
        <Image
          src={imagen}
          alt={nombre}
          fill
          sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
          className={`  jomi-image transition-all  duration-700 ease-out  group-hover:scale-105
            ${
              imagenHover
                ? "group-hover:opacity-0"
                : ""
            }
          `}
        />

        {/* Imagen hover */}
        {imagenHover && (
          <Image
            src={imagenHover}
            alt={`${nombre} - segunda vista`}
            fill
            sizes="(max-width: 640px) 78vw, (max-width: 1024px) 50vw, 25vw"
            className="  jomi-image opacity-0  transition-all  duration-700  ease-out  group-hover:scale-105  group-hover:opacity-100 "
          />
        )}

        {/* Badge */}
        {badge && (
          <span
            className={` absolute left-3 top-3 z-10 px-2.5 py-1.5 text-[0.5rem] font-medium uppercase tracking-[0.15em] text-white backdrop-blur-sm
              ${
                badge.toUpperCase() === "OFERTA"
                  ? "bg-jomi-red/95"
                  : "bg-black/80"
              }
            `}
          >
            {badge}
          </span>
        )}

        {/* Cantidad */}
        {estaEnCarrito && (
          <span
            className="absolute right-3 top-3 z-10 flex items-center gap-1 rounded-full  bg-emerald-600 px-2.5 py-1.5 text-[10px] font-bold text-white shadow-sm " >
            <Check size={12} />
            {cantidad}
          </span>
        )}

        {/* Acción */}
        <div
          className="  absolute inset-x-0 bottom-0  flex justify-end bg-linear-to-t from-black/40 to-transparent p-3 opacity-100 transition-opacity duration-300 md:opacity-0 md:group-hover:opacity-100 ">
          {estaEnCarrito ? (
            <button
              type="button"
              onClick={() => onEliminar(id)}
              className=" flex items-center  gap-1.5 bg-red-600/90  px-3.5 py-2.5 text-xs font-medium text-white backdrop-blur-md transition-colors hover:bg-red-600 ">
              <Trash2 size={13} />

              <span>Quitar</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onAgregar(producto)}
              className=" flex  items-center gap-1.5 bg-white/95 px-3.5 py-2.5 text-xs font-semibold uppercase tracking-wider text-black backdrop-blur-md  transition-all hover:bg-lila-jomi hover:text-white ">
              <Plus size={13} />

              <span>Agregar</span>
            </button>
          )}
        </div>
      </div>

      {/* INFORMACIÓN */}
      <div className="flex min-h-33 flex-col gap-1.5 px-1 pb-3 pt-4">

        <h3 className=" line-clamp-2  min-h-10  text-sm font-medium uppercase leading-5 tracking-wide text-black ">
          {nombre}
        </h3>

        <div className=" flex  min-h-4.5 items-center justify-between gap-2 text-xs  font-light  text-gray-500 ">
          <span className="truncate">
            {coloresTexto || ""}
          </span>

          {tallasTexto && (
            <span className="shrink-0 uppercase">
              {tallasTexto}
            </span>
          )}
        </div>

        <div className="mt-auto flex items-baseline gap-2 pt-2">
          <span className="font-bold tracking-tight text-red">
            {moneda} {Number(precio).toFixed(2)}
          </span>
        </div>
      </div>
    </article>
  );
}
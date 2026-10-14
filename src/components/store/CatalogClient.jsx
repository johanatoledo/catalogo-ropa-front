"use client";

import { useMemo, useState } from "react";
import { MessageCircle, ShoppingBag, Trash2 } from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import { abrirCompraMultipleWhatsApp } from "@/lib/whatsapp";


const ALL_CATEGORIES = "Todos";

export default function CatalogClient({ productos = [] }) {
  const [categoriaActiva, setCategoriaActiva] = useState(ALL_CATEGORIES);
  const [selecciones, setSelecciones] = useState([]);

  const categorias = useMemo(() => {
    const categoriasDisponibles = productos
      .map((producto) => producto.categoria?.trim())
      .filter(Boolean);

    return [ALL_CATEGORIES, ...new Set(categoriasDisponibles)];
  }, [productos]);

  const productosFiltrados = useMemo(() => {
    if (categoriaActiva === ALL_CATEGORIES) {
      return productos;
    }

    return productos.filter((producto) => producto.categoria === categoriaActiva);
  }, [categoriaActiva, productos]);

  const totalSeleccionado = useMemo(() => {
    return selecciones.reduce((acumulado, item) => acumulado + Number(item.total || 0), 0);
  }, [selecciones]);

  const agregarSeleccion = (seleccion) => {
    setSelecciones((actuales) => {
      const existe = actuales.some((item) => item.producto.id === seleccion.producto.id);

      if (existe) {
        return actuales.map((item) =>
          item.producto.id === seleccion.producto.id ? seleccion : item
        );
      }

      return [...actuales, seleccion];
    });
  };

  const eliminarSeleccion = (productoId) => {
    setSelecciones((actuales) =>
      actuales.filter((item) => item.producto.id !== productoId)
    );
  };

  const limpiarSeleccion = () => {
    setSelecciones([]);
  };

  const enviarPedidoWhatsApp = () => {
    if (selecciones.length === 0) return;

    abrirCompraMultipleWhatsApp(selecciones);
  };

  if (!productos.length) {
    return (
      <section className="mt-10 rounded-2xl border border-jomi-border bg-white px-6 py-12 text-center">
        <p className="text-sm font-medium text-black/55">
          No hay productos disponibles en este momento.
        </p>
      </section>
    );
  }

  return (
    <>
      <div className="mt-8 flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {categorias.map((categoria) => {
          const activa = categoriaActiva === categoria;

          return (
            <button
              key={categoria}
              type="button"
              onClick={() => setCategoriaActiva(categoria)}
              aria-pressed={activa}
              className={`jomi-category-button shrink-0 ${activa ? "jomi-category-button-active" : "jomi-category-button-inactive"}`}
            >
              {categoria}
            </button>
          );
        })}
      </div>

      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-5 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-4">
        {productosFiltrados.map((producto) => {
          const seleccionado = selecciones.some(
            (item) => item.producto.id === producto.id
          );

          return (
            <ProductCard
              key={producto.id}
              producto={producto}
              seleccionado={seleccionado}
              onSeleccionar={agregarSeleccion}
              onEliminarSeleccion={eliminarSeleccion}
            />
          );
        })}
      </div>

      {productosFiltrados.length === 0 && (
        <div className="mt-10 rounded-2xl border border-jomi-border bg-white px-6 py-12 text-center">
          <p className="text-sm font-medium text-black/55">
            No hay productos disponibles en esta categoría.
          </p>
        </div>
      )}

      {selecciones.length > 0 && (
        <aside className="fixed bottom-4 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-2xl -translate-x-1/2 rounded-2xl border border-jomi-primary/15 bg-white-chic/80 p-3 shadow-2xl backdrop-blur-xl sm:bottom-6 sm:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-jomi-primary/10 text-jomi-primary">
                <ShoppingBag size={20} />
              </div>

              <div className="min-w-0 ">
                <p className="text-xs font-medium text-black/55">
                  {selecciones.length} {selecciones.length === 1 ? "producto seleccionado" : "productos seleccionados"}
                </p>

                <p className="text-base font-bold text-jomi-black">
                  S/ {totalSeleccionado.toFixed(2)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-2">
              <button
                type="button"
                onClick={limpiarSeleccion}
                aria-label="Eliminar todas las selecciones"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-jomi-border text-black/50 transition hover:border-jomi-red hover:text-jomi-red"
              >
                <Trash2 size={17} className="text-jomi-red hover:text-jomi-red/50"/>
              </button>

              <button
                type="button"
                onClick={enviarPedidoWhatsApp}
                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-white-chic  hover:bg-sandstone px-4 py-2 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-jomi-secondary"
              >
                  {/* Icono SVG de WhatsApp */}
                 <svg
                  className="w-6 h-6 fill-current text-jomi-green"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  >
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
               </svg>
                <span className="hidden sm:inline  text-lila-jomi">Enviar pedido</span>
                <span className="sm:hidden text-lila-jomi">Enviar</span>
              </button>
            </div>
          </div>
        </aside>
      )}
    </>
  );
}
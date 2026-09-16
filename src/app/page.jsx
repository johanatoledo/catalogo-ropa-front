"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import CartBar from "@/components/CartBar";
import CheckoutPanel from "@/components/CheckoutPanel";
import { productos } from "@/data/productos";

export default function HomeMenuPage() {
  const [carrito, setCarrito] = useState([]);
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  const [checkoutAbierto, setCheckoutAbierto] = useState(false);

  useEffect(() => {
    const carritoGuardado = localStorage.getItem("carrito");

    if (carritoGuardado) {
      setCarrito(JSON.parse(carritoGuardado));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const categorias = [
    "Todos",
    ...new Set(productos.map((p) => p.categoria)),
  ];

  const productosFiltrados =
    categoriaActiva === "Todos"
      ? productos
      : productos.filter(
          (producto) => producto.categoria === categoriaActiva
        );

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((item) => item.id === producto.id);

      if (existe) {
        return prev.map((item) =>
          item.id === producto.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }

      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const eliminarProducto = (id) => {
    setCarrito((prev) =>
      prev.filter((item) => item.id !== id)
    );
  };

  const limpiarCarrito = () => {
    setCarrito([]);
    setCheckoutAbierto(false);
  };

  const obtenerCantidad = (id) => {
    const item = carrito.find(
      (producto) => producto.id === id
    );

    return item ? item.cantidad : 0;
  };

  return (
    <main className="min-h-screen bg-white-chic pb-40">
      <Navbar />

      <section className="mx-auto w-full max-w-10xl px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <div className="text-center">
          <h1 className="font-title text-5xl text-black-chic font-bold">
            Nuestro Catalogo
          </h1>
        </div>

       <div className="mt-8 flex flex-wrap justify-center gap-3">
           {categorias.map((categoria) => {
            const activa = categoriaActiva === categoria;

             return (
              <button
               key={categoria}
               onClick={() => setCategoriaActiva(categoria)}
               className={`jomi-category-button ${
               activa
               ? "jomi-category-button-active"
               : "jomi-category-button-inactive"
             }`}
          >
            {categoria}
         </button>
        );
      })}
     </div>

        <div className=" mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto overscroll-x-contain pb-4 sm:grid sm:grid-cols-2 sm:overflow-visible sm:pb-0 lg:grid-cols-3 xl:grid-cols-4 ">
          {productosFiltrados.map((producto) => (
            <ProductCard
              key={producto.id}
              producto={producto}
              cantidad={obtenerCantidad(producto.id)}
              onAgregar={agregarProducto}
              onEliminar={eliminarProducto}
            />
          ))}
        </div>
      </section>

      <CartBar
        carrito={carrito}
        onOpenCheckout={() =>
          setCheckoutAbierto(true)
        }
      />

      {checkoutAbierto && (
        <CheckoutPanel
          carrito={carrito}
          total={total}
          onClose={() =>
            setCheckoutAbierto(false)
          }
          onPedidoCreado={limpiarCarrito}
        />
      )}
    </main>
  );
}
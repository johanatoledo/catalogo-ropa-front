import { STORE_CONFIG } from "@/config/store";

function obtenerTelefonoWhatsApp() {
  const telefono = String(STORE_CONFIG.contact.whatsapp || "").replace(/\D/g, "");

  if (!telefono) {
    throw new Error("El número de WhatsApp de la tienda no está configurado.");
  }

  return telefono;
}

export function crearMensajeCompraWhatsApp({
  producto,
  color,
  talla,
  cantidad = 1,
}) {
  if (!producto) {
    throw new Error("El producto es obligatorio.");
  }

  const precio = Number(producto.precio || 0);
  const cantidadNormalizada = Math.max(1, Number(cantidad) || 1);
  const total = precio * cantidadNormalizada;

  const lineas = [
    `¡Hola ${STORE_CONFIG.name}! 👋`,
    "",
    "Me interesa comprar la siguiente prenda:",
    "",
    `Producto: ${producto.nombre}`,
  ];

  if (color) {
    lineas.push(`Color: ${color}`);
  }

  if (talla) {
    lineas.push(`Talla: ${talla}`);
  }

  lineas.push(
    `Cantidad: ${cantidadNormalizada}`,
    `Precio unitario: ${STORE_CONFIG.currency.symbol} ${precio.toFixed(2)}`,
    `Total: ${STORE_CONFIG.currency.symbol} ${total.toFixed(2)}`,
    "",
    "¿Me confirman disponibilidad y coordinamos la entrega?"
  );

  return lineas.join("\n");
}

export function crearUrlWhatsAppCompra(datosCompra) {
  const telefono = obtenerTelefonoWhatsApp();
  const mensaje = crearMensajeCompraWhatsApp(datosCompra);

  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

export function abrirCompraWhatsApp(datosCompra) {
  if (typeof window === "undefined") return;

  const url = crearUrlWhatsAppCompra(datosCompra);

  window.open(url, "_blank", "noopener,noreferrer");
}

export function crearMensajeCompraMultipleWhatsApp(selecciones = []) {
  if (!Array.isArray(selecciones) || selecciones.length === 0) {
    throw new Error("Debes seleccionar al menos un producto.");
  }

  const lineas = [
    `¡Hola ${STORE_CONFIG.name}! 👋`,
    "",
    "Me interesa realizar el siguiente pedido:",
    "",
  ];

  let totalPedido = 0;

  selecciones.forEach((item, index) => {
    const precio = Number(item.producto?.precio || 0);
    const cantidad = Math.max(1, Number(item.cantidad) || 1);
    const subtotal = precio * cantidad;

    totalPedido += subtotal;

    lineas.push(`${index + 1}. ${item.producto.nombre}`);

    if (item.color) {
      lineas.push(`Color: ${item.color}`);
    }

    if (item.talla) {
      lineas.push(`Talla: ${item.talla}`);
    }

    lineas.push(
      `Cantidad: ${cantidad}`,
      `Precio unitario: ${STORE_CONFIG.currency.symbol} ${precio.toFixed(2)}`,
      `Subtotal: ${STORE_CONFIG.currency.symbol} ${subtotal.toFixed(2)}`,
      ""
    );
  });

  lineas.push(
    `Total del pedido: ${STORE_CONFIG.currency.symbol} ${totalPedido.toFixed(2)}`,
    "",
    "¿Me confirman disponibilidad y coordinamos la entrega?"
  );

  return lineas.join("\n");
}

export function crearUrlCompraMultipleWhatsApp(selecciones) {
  const telefono = obtenerTelefonoWhatsApp();
  const mensaje = crearMensajeCompraMultipleWhatsApp(selecciones);

  return `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
}

export function abrirCompraMultipleWhatsApp(selecciones) {
  if (typeof window === "undefined") return;

  const url = crearUrlCompraMultipleWhatsApp(selecciones);

  window.open(url, "_blank", "noopener,noreferrer");
}
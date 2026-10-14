const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:4004";
const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  "Bypass-Tunnel-Reminder": "true",
};


async function parseJsonSafe(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}


async function manejarRespuesta( response, mensajeError = "Ocurrió un error inesperado") {
  const data = await parseJsonSafe(response);

  if (!response.ok) {
    const mensaje = data?.message || data?.error || mensajeError;
    const error = new Error(mensaje);

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

/**
 * Crea un nuevo pedido.
 *
 * El payload esperado para JOMI Store será aproximadamente:
 *
 * {
 *   cliente_nombre,
 *   cliente_telefono,
 *   metodo_entrega,
 *   direccion,
 *   metodo_pago,
 *   productos,
 *   subtotal,
 *   delivery_cost,
 *   total
 * }
 *
 * IMPORTANTE:
 * Los precios y totales recibidos desde el frontend
 * deberán recalcularse en el backend utilizando MySQL.
 */
export async function crearPedido(data) {
  const response = await fetch( `${API_URL}/api/pedidos`,
    {
      method: "POST",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(data),
    }
  );

  return manejarRespuesta( response, "No se pudo crear el pedido." );
}


export async function obtenerPedido(id) {
  if (!id) {
    throw new Error(
      "Se requiere el identificador del pedido."
    );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent(id)}`,
    {
      method: "GET",
      headers: {
        "Bypass-Tunnel-Reminder": "true",
      },
      cache: "no-store",
    }
  );

  return manejarRespuesta( response, "No se pudo obtener el pedido." );
}


export async function obtenerPedidosAdmin() {
  const response = await fetch( `${API_URL}/api/pedidos`,
    {
      method: "GET",
      headers: { "Bypass-Tunnel-Reminder": "true", },
      cache: "no-store",
    }
  );

  return manejarRespuesta( response, "No se pudieron obtener los pedidos." );
}

/**
 * Actualiza el estado general de un pedido.
 *
 * Ejemplos:
 *
 * pendiente
 * confirmado
 * preparando
 * listo
 * enviado
 * entregado
 * cancelado
 */
export async function actualizarEstadoPedido( id, estado) {
  if (!id) {
    throw new Error( "Se requiere el identificador del pedido." );
  }

  if (!estado) {
    throw new Error( "Se requiere el nuevo estado del pedido." );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent( id )}/estado`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ estado, }),
    }
  );

  return manejarRespuesta( response, "No se pudo actualizar el estado del pedido." );
}

/**
 * Marca un pedido como entregado.
 *
 * Se conserva como función específica porque puede
 * ser útil desde el panel administrativo.
 */
export async function marcarPedidoEntregado(id) {
  if (!id) {
    throw new Error( "Se requiere el identificador del pedido." );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent( id )}/entregar`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
    }
  );

  return manejarRespuesta( response, "No se pudo marcar el pedido como entregado." );
}

/**
 * Marca como pagado un pedido contraentrega.
 *
 * En JOMI Store el cliente NO paga previamente.
 *
 * El administrador podrá marcar el pago como realizado
 * cuando corresponda.
 */
export async function confirmarPagoPedido(id) {
  if (!id) {
    throw new Error( "Se requiere el identificador del pedido." );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent( id )}/pago`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ estado_pago: "pagado", }),
    }
  );

  return manejarRespuesta( response, "No se pudo confirmar el pago del pedido.");
}

/**
 * Actualiza la información de entrega de un pedido.
 
 * Ejemplo:
 *
 * {
 *   metodo_entrega: "delivery",
 *   distrito: "Miraflores",
 *   direccion: "Av. Example 123",
 *   referencia: "Frente al parque"
 * }
 */
export async function actualizarEntregaPedido( id, entrega ) {
  if (!id) {
    throw new Error( "Se requiere el identificador del pedido." );
  }

  if (!entrega || typeof entrega !== "object" ) {
    throw new Error( "Los datos de entrega no son válidos." );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent( id )}/entrega`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify(entrega),
    }
  );

  return manejarRespuesta( response, "No se pudo actualizar la información de entrega." );
}

/**
 * Cancela un pedido.
 *
 * Esto será útil desde el panel administrativo.
 */
export async function cancelarPedido( id, motivo = null) {
  if (!id) {
    throw new Error( "Se requiere el identificador del pedido." );
  }

  const response = await fetch( `${API_URL}/api/pedidos/${encodeURIComponent( id )}/cancelar`,
    {
      method: "PATCH",
      headers: DEFAULT_HEADERS,
      body: JSON.stringify({ motivo, }),
    }
  );

  return manejarRespuesta( response, "No se pudo cancelar el pedido." );
}
"use client";

export default function CustomerForm({
  form,
  errors = {},
  onChange,
}) {
  const handleChange = (event) => {
    const { name, value } = event.target;

    onChange(name, value);
  };

  const esDelivery = form.metodoEntrega === "delivery";

  return (
    <section aria-labelledby="customer-data-title">
      <div>
        <h3
          id="customer-data-title"
          className="text-lg font-semibold text-jomi-black"
        >
          Datos de contacto
        </h3>

        <p className="mt-1 text-sm leading-6 text-black/55">
          Utilizaremos estos datos para identificar tu pedido y coordinar la
          entrega.
        </p>
      </div>

      <div className="mt-5 space-y-5">
        {/* Nombre */}
        <div>
          <label
            htmlFor="clienteNombre"
            className="text-sm font-semibold text-jomi-black"
          >
            Nombre completo
            <span
              aria-hidden="true"
              className="ml-1 text-jomi-sale"
            >
              *
            </span>
          </label>

          <input
            id="clienteNombre"
            name="nombre"
            type="text"
            autoComplete="name"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Ejemplo: María López"
            aria-invalid={Boolean(errors.nombre)}
            aria-describedby={
              errors.nombre ? "clienteNombre-error" : undefined
            }
            className="
              jomi-input
              mt-2
            "
          />

          {errors.nombre && (
            <p
              id="clienteNombre-error"
              role="alert"
              className="mt-2 text-xs font-semibold text-jomi-sale"
            >
              {errors.nombre}
            </p>
          )}
        </div>

        {/* Teléfono */}
        <div>
          <label
            htmlFor="clienteTelefono"
            className="text-sm font-semibold text-jomi-black"
          >
            Teléfono / WhatsApp
            <span
              aria-hidden="true"
              className="ml-1 text-jomi-sale"
            >
              *
            </span>
          </label>

          <input
            id="clienteTelefono"
            name="telefono"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={form.telefono}
            onChange={handleChange}
            placeholder="Ejemplo: 987 654 321"
            aria-invalid={Boolean(errors.telefono)}
            aria-describedby={
              errors.telefono ? "clienteTelefono-error" : undefined
            }
            className="
              jomi-input
              mt-2
            "
          />

          {errors.telefono && (
            <p
              id="clienteTelefono-error"
              role="alert"
              className="mt-2 text-xs font-semibold text-jomi-sale"
            >
              {errors.telefono}
            </p>
          )}
        </div>

        {/* Campos exclusivos para delivery */}
        {esDelivery && (
          <>
            <div>
              <label
                htmlFor="clienteDistrito"
                className="text-sm font-semibold text-jomi-black"
              >
                Distrito
                <span
                  aria-hidden="true"
                  className="ml-1 text-jomi-sale"
                >
                  *
                </span>
              </label>

              <input
                id="clienteDistrito"
                name="distrito"
                type="text"
                autoComplete="address-level2"
                value={form.distrito}
                onChange={handleChange}
                placeholder="Ejemplo: Miraflores"
                aria-invalid={Boolean(errors.distrito)}
                aria-describedby={
                  errors.distrito ? "clienteDistrito-error" : undefined
                }
                className="
                  jomi-input
                  mt-2
                "
              />

              {errors.distrito && (
                <p
                  id="clienteDistrito-error"
                  role="alert"
                  className="mt-2 text-xs font-semibold text-jomi-sale"
                >
                  {errors.distrito}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="clienteDireccion"
                className="text-sm font-semibold text-jomi-black"
              >
                Dirección
                <span
                  aria-hidden="true"
                  className="ml-1 text-jomi-sale"
                >
                  *
                </span>
              </label>

              <input
                id="clienteDireccion"
                name="direccion"
                type="text"
                autoComplete="street-address"
                value={form.direccion}
                onChange={handleChange}
                placeholder="Av., calle, número, departamento..."
                aria-invalid={Boolean(errors.direccion)}
                aria-describedby={
                  errors.direccion ? "clienteDireccion-error" : undefined
                }
                className="
                  jomi-input
                  mt-2
                "
              />

              {errors.direccion && (
                <p
                  id="clienteDireccion-error"
                  role="alert"
                  className="mt-2 text-xs font-semibold text-jomi-sale"
                >
                  {errors.direccion}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="clienteReferencia"
                className="text-sm font-semibold text-jomi-black"
              >
                Referencia
                <span className="ml-1 font-normal text-black/40">
                  (opcional)
                </span>
              </label>

              <textarea
                id="clienteReferencia"
                name="referencia"
                rows={3}
                value={form.referencia}
                onChange={handleChange}
                placeholder="Ejemplo: Frente al parque, edificio de puerta negra..."
                className="
                  jomi-input
                  mt-2
                  resize-none
                "
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
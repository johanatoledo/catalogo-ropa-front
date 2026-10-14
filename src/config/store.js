export const STORE_CONFIG = {
  name: "JOMI Store",
  locale: "es-PE",
  currency: {
    code: "PEN",
    symbol: "S/",
  },

  contact: {
    whatsapp: "51932297805",
    whatsappMessage:
      "¡Hola! Me gustaría obtener información sobre las prendas del catálogo de JOMI Store.",
  },

  payment: {
    method: "cash_on_delivery",
    label: "Pago contraentrega",
    description:
      "Paga tu pedido al momento de recibirlo. No necesitas realizar ningún pago por adelantado.",
  },

  delivery: {
    defaultMethod: "delivery",

    methods: {
      delivery: {
        id: "delivery",
        label: "Delivery",
        description:
          "Recibe tu pedido en la dirección que indiques.",
      },

      pickup: {
        id: "pickup",
        label: "Recojo coordinado",
        description:
          "Coordina directamente con JOMI Store el lugar y horario de recojo.",
      },
    },

    /*
     * Temporalmente no calculamos una tarifa automática.
     * El costo de delivery se confirmará de acuerdo al distrito.
     *
     * Posteriormente esta información deberá venir desde MySQL,
     * utilizando zonas y tarifas configurables desde el panel.
     */
    calculateDeliveryCost: false,
  },
};

export const CART_STORAGE_KEY = "jomi-store-cart";
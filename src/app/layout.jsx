
import "./globals.css";



export const metadata = {
  metadataBase: new URL("https://jomi-store.toledanadev.com/"),

  title: {
    default: "Jomi Store | Ropa modesta para la familia",
    template: "%s | JomiStore",
  },

  description:
    "Tienda mayorista de Ropa para damas, caballeros y niños.",

  keywords: [
    "ropa de damas",
    "ropa de caballeros",
    "ropa de niños",
    "zapatos de damas",
    "zapatos de caballeros",
    "zapatos de niños",
    "vestidos de damas",
    "maxifaldas",
    "maxivestidos",
    "faldas en tendencia",
    "camisas para damas",
    
  ],

  authors: [
    {
      name: "ToledanaDev",
      url: "https://www.toledanadev.com",
    },
  ],

  creator: "ToledanaDev",
  publisher: "ToledanaDev",

  
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  alternates: {
    canonical: "https://jomi-store.toledanadev.com/",
  },

  openGraph: {
    title: "Jomi Store | Ropa para Damas, Caballeros y Niños",
    description:
      "Vendemos ropa y zapatos  para damas, caballeros y niños a precios mayor y detal",
    url: "https://jomi-store.toledanadev.com",
    siteName: "Jomi Store",
    locale: "es_VE",
    type: "website",
    images: [
      {
        url: "/branding/logo-jomi-store.webp",
        width: 1200,
        height: 630,
        alt: "Jomi Store- Ropa para Damas, Caballeros y niños",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Jomi Store | Ropa para Damas, Caballeros y  niñOS",
    description:
      "Vendemos ropa y zapatos  para damas, caballeros y niños a precios mayor y detal",
    images: ["/branding/logo-jomi-store.webp"],
  },

  icons: {
    icon: "/branding/logo-jomi-store.webp",
    shortcut: "/branding/logo-jomi-store.webp",
    apple: "/branding/logo-jomi-store.webp",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" >
      <body>{children}</body>
    </html>
  );
}
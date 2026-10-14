
import "./globals.css";


export const metadata = {
  charset: "utf-8",
  viewport: "width=device-width, initial-scale=1",  
  title: "Jomi Store",
  description: "Catalogo digital Jomi Store",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" >
      <body>{children}</body>
    </html>
  );
}
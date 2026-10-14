import Navbar from "@/components/layout/Navbar";
import CatalogClient from "@/components/store/CatalogClient";
import { productos } from "@/data/productos";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-jomi-white">
      <Navbar />

      <section className="jomi-container py-8 sm:py-10 lg:py-12">
        <header className="mx-auto max-w-2xl text-center">
        
          <h1 className="mt-2 font-title-jomi text-3xl font-semibold tracking-tight text-jomi-black sm:text-4xl lg:text-5xl">
            Nuestro catálogo
          </h1>

        </header>

        <CatalogClient productos={productos} />
      </section>
    </main>
  );
}
import React from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      
      {/* flex-grow asegura que el Footer siempre empuje hacia abajo, incluso si la página tiene poco contenido */}
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          {children}
        </div>
      </div>

      <Footer />
    </>
  );
}
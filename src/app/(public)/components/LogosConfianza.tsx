// 🚀 Server Component puro. Letras claras, sin opacidad excesiva y máximo font-semibold.
import React from "react";

export default function LogosConfianza() {
  return (
    <section className="py-12 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <p className="text-sm font-semibold text-slate-700 uppercase tracking-widest mb-6">
          Respaldados por tecnología de clase mundial
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 grayscale">
          {/* Tipografía semibold, nada de font-black */}
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">FORTINET</h3>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">CISCO</h3>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">FLUKE NETWORKS</h3>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">MIKROTIK</h3>
        </div>
      </div>
    </section>
  );
}
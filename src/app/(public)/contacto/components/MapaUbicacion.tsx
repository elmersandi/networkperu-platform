export default function MapaUbicacion() {
  return (
    // 1. "h-[350px]": Altura fija para celular.
    // 2. "lg:h-[450px]": Altura fija para PC.
    // Con esto, NO hay forma de que se pierda o colapse.
    <div className="w-full h-[350px] lg:h-[450px] bg-gray-200 border border-gray-200 shadow-sm rounded-xl overflow-hidden">
      <iframe
        src="https://maps.google.com/maps?q=Calle%20Abtao%201350%2CIquitos%2CPeru&t=&z=15&ie=UTF8&iwloc=&output=embed"
        style={{ border: 0 }}
        allowFullScreen={false}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Ubicación Networks Perú"
        className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
      ></iframe>
    </div>
  );
}
import { useState, useEffect } from "react";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react";

// Inicializa con tu Public Key
initMercadoPago("APP_USR-98a878b5-6b5d-4b2e-994a-244b1b907b3a");

const Checkout = () => {
  const [preferenceId, setPreferenceId] = useState(null);

  // Función que pide el ID a tu backend
  const obtenerPreferenceId = async () => {
    try {
      // 1. Hacemos el pedido a NUESTRO backend (no a Mercado Pago directo)
      const response = await fetch("https://flip-f.vercel.app/api/create_preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Aquí envías qué está comprando el usuario para que el backend arme la preferencia
        body: JSON.stringify({
          title: "Mi producto",
          quantity: 1,
          price: 100, 
        }),
      });

      // 2. Recibimos el ID desde nuestro backend
      const data = await response.json();
      
      // 3. Guardamos el ID en el estado para que el botón se muestre
      if (data.id) {
        setPreferenceId(data.id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Puedes pedir el ID apenas carga la página...
  useEffect(() => {
    obtenerPreferenceId();
  }, []);

  // ...O pedirlo cuando el usuario hace clic en un botón "Comprar" previo.


};

export default Checkout;

// SDK de Mercado Pago
import { MercadoPagoConfig, Preference } from 'mercadopago';

import express from 'express';

const app = express(); // <--- FALTABA ESTO
app.use(express.json()); // Para que el servidor entienda datos JSON

// Agrega credenciales
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-4362448524403585-012312-44b39113d058bab2fb2cd158cc3a4738-1359462085' });


app.post("/create-preference", (req, res) => {


  new Preference(client).create({
  body: {
    items: [
      {
        title: 'Mi producto',
        quantity: 1,
        unit_price: 2000
      }
    ],
  }
})
.then((data) => {
  console.log(data);
// Object data contains all information about our Preference
  res.status(200).json({
    preference_id: data.id,
    preference_url: data.init_point,
  })
})
.catch(() => {
  res.status(500).json({ "error": "error creating preference" })
});
});

app.listen(8080, () => {
  console.log("The server is now running on Port 8080");
});



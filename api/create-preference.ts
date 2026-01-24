// import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';

// initMercadoPago('APP_USR-98a878b5-6b5d-4b2e-994a-244b1b907b3a');



import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import { MercadoPagoConfig, Preference } from 'mercadopago';



const app = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());

// Agrega credenciales
const client = new MercadoPagoConfig({ 
    accessToken: process.env.MP_ACCESS_TOKEN || '' 
});

// Definimos la estructura de lo que esperamos recibir del carrito
interface CartItem {
    title: string;
    quantity: number;
    price: number | string;
}

// Interfaz para el cuerpo de la solicitud
interface CreatePreferenceRequest {
    items: CartItem[];
}

app.post("/create-preference", async (req: Request<{}, {}, CreatePreferenceRequest>, res: Response) => {

console.log("Cuerpo recibido:", req.body); // <-- Esto imprimirá en tu terminal lo que enviaste desde Postman

    try {
        const { items } = req.body;

        // Validamos que existan productos
        if (!items || items.length === 0) {
            return res.status(400).json({ error: "No hay productos en el carrito" });
        }

        const preference = new Preference(client);
        
        // Creamos la preferencia con datos tipados y dinámicos
const result = await preference.create({
    body: {
        items: items.map(item => ({
            title: item.title,
            quantity: Number(item.quantity),
            unit_price: Number(item.price),
            currency_id: 'ARS' 
        })),
        back_urls: {
                    success: "https://flip-f.vercel.app/#/mis-cursos",
                    failure: "https://flip-f.vercel.app/#/checkout",
                    pending: "https://flip-f.vercel.app/#/checkout"
        },
        auto_return: "approved", // Solo funciona si 'success' está bien definido
    }
});
        // Respondemos con el ID para el componente Wallet de React
        res.status(200).json({
            preference_id: result.id,
            preference_url: result.init_point,
        });

} catch (error: any) {
    // Esto te dirá en la consola si es un problema de token, de campos, etc.
    console.error("Error detallado de MP:", error.message || error);
    if (error.response) {
        console.error("Detalles del cuerpo del error:", error.response);
    }
    res.status(500).json({ "error": "error creating preference", "details": error.message });
}
});

const PORT: number = 8080;
app.listen(PORT, () => {
    console.log(`The server is now running on Port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Cargar variables de entorno desde .env.local ANTES de importar los handlers
dotenv.config({ path: '.env.local' });

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Importar handlers dinámicamente para asegurar que process.env ya tiene las variables
const startServer = async () => {
    const { default: createPreferenceHandler } = await import('./create-preference');
    const { default: processPaymentHandler } = await import('./process-payment');
    const { default: checkPaymentStatusHandler } = await import('./check-payment-status');
    const { default: webhookHandler } = await import('./webhook');

    // Mount handlers
    app.all('/api/create-preference', (req, res) => createPreferenceHandler(req as any, res as any));
    app.all('/api/process-payment', (req, res) => processPaymentHandler(req as any, res as any));
    app.all('/api/check-payment-status', (req, res) => checkPaymentStatusHandler(req as any, res as any));
    app.post('/api/webhook', (req, res) => webhookHandler(req as any, res as any));

    // Fallback for direct root access testing
    app.post('/create-preference', (req, res) => createPreferenceHandler(req as any, res as any));
    app.post('/process_payment', (req, res) => processPaymentHandler(req as any, res as any));
    app.post('/webhook', (req, res) => webhookHandler(req as any, res as any));

    app.listen(port, () => {
        console.log(`> Local API Server running at http://localhost:${port}`);
        console.log(`  - /api/create-preference`);
        console.log(`  - /api/process-payment`);
        console.log(`  - /api/check-payment-status`);
        console.log(`  - /api/webhook`);
    });
};

startServer().catch(console.error);

import express, { Request, Response } from 'express';
import QRCode from 'qrcode';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

interface GenerateRequest {
    ssid: string;
    password?: string;
    encryption?: 'WPA' | 'WEP' | 'nopass';
    hidden?: boolean;
}

app.post('/api/generate', async (req: Request, res: Response): Promise<void> => {
    try {
        const { ssid, password, encryption = 'WPA', hidden = false } = req.body as GenerateRequest;

        if (!ssid) {
            res.status(400).json({ error: 'SSID is required' });
            return;
        }

        // WIFI:T:WPA;S:mynetwork;P:mypass;;
        const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password || ''};H:${hidden};;`;

        const qrCodeUrl = await QRCode.toDataURL(wifiString);

        res.json({ qrCodeUrl });
    } catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

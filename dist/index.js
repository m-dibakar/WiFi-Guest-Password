"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const qrcode_1 = __importDefault(require("qrcode"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
app.use(express_1.default.json());
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.post('/api/generate', async (req, res) => {
    try {
        const { ssid, password, encryption = 'WPA', hidden = false } = req.body;
        if (!ssid) {
            res.status(400).json({ error: 'SSID is required' });
            return;
        }
        // WIFI:T:WPA;S:mynetwork;P:mypass;;
        const wifiString = `WIFI:T:${encryption};S:${ssid};P:${password || ''};H:${hidden};;`;
        const qrCodeUrl = await qrcode_1.default.toDataURL(wifiString);
        res.json({ qrCodeUrl });
    }
    catch (error) {
        console.error('Error generating QR code:', error);
        res.status(500).json({ error: 'Failed to generate QR code' });
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

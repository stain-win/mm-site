import {QrCodeCorrectionLevel, QrCodeOutputFormat} from '../../types/qrcode.type';

export const QR_CONFIG_DEFAULT = {
    content: 'https://miroslavmitrovic.rs',
    size: 256,
    errorCorrection: QrCodeCorrectionLevel.Medium,
    outputFormat: QrCodeOutputFormat.vector,
    border: 2,
    scale: 8,
    colors: {
        backgroundColor: '#ffffff',
        lightColor: '#ffffff',
        darkColor: '#000000',
    },
    versionRange: {
        verMin: 2,
        verMax: 40,
    },
    maskPattern: -1,
    boostECL: true,
};

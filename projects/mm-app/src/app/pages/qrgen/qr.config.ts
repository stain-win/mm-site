import {QrCodeCorrectionLevel, QrCodeOutputFormat} from '../../types/qrcode.type';

export const QR_CONFIG_DEFAULT = {
    content: 'https://miroslavmitrovic.rs',
    size: 5,
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
        verMin: 1,
        verMax: 40,
    },
    maskPattern: -1,
    boostECC: true,
};

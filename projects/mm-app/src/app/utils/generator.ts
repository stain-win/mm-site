import {QrCodeCorrectionLevel, QrCodeObj} from '@mm-lib';
import {Ecc, QrCode} from './qrcode';

export function toSvgString (qr: QrCode, border: number, lightColor: string, darkColor: string): string {
    if (border < 0) {
        throw new Error('Border must be non-negative');
    }
    const parts: Array<string> = [];
    for (let y = 0; y < qr.size; y++) {
        for (let x = 0; x < qr.size; x++) {
            if (qr.getModule(x, y)) {
                parts.push(`M${x + border},${y + border}h1v1h-1z`);
            }
        }
    }
    return `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 ${qr.size + border * 2} ${qr.size + border * 2}" stroke="none">
	<rect width="100%" height="100%" fill="${lightColor}"/>
	<path d="${parts.join(' ')}" fill="${darkColor}"/>
</svg>
`;
}

export function getInputErrorCorrectionLevel (qrObj: QrCodeObj): Ecc {
    if (qrObj.errorCorrection === QrCodeCorrectionLevel.Low) {
        return Ecc.LOW;
    }
    else if (qrObj.errorCorrection === QrCodeCorrectionLevel.Medium) {
        return Ecc.MEDIUM;
    }
    else if (qrObj.errorCorrection === QrCodeCorrectionLevel.Quartile) {
        return Ecc.QUARTILE;
    }
    else if (qrObj.errorCorrection === QrCodeCorrectionLevel.High) {
        return Ecc.HIGH;
    }
    return Ecc.LOW;
}

export function drawCanvas (qr: QrCode,
                            scale: number,
                            border: number,
                            lightColor: string,
                            darkColor: string,
                            canvas: HTMLCanvasElement): void {
    if (scale <= 0 || border < 0) {
        throw new Error('Value out of range');
    }
    const width: number = (qr.size + border * 2) * scale;
    canvas.width = width;
    canvas.height = width;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    for (let y = -border; y < qr.size + border; y++) {
        for (let x = -border; x < qr.size + border; x++) {
            ctx.fillStyle = qr.getModule(x, y) ? darkColor : lightColor;
            ctx.fillRect((x + border) * scale, (y + border) * scale, scale, scale);
        }
    }
}

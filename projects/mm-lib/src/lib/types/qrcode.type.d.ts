export declare enum QrCodeCorrectionLevel {
    Low = 0,
    Medium = 1,
    Quartile = 2,
    High = 3
}
export declare enum QrCodeOutputFormat {
    vector = 0,
    bitmap = 1
}
export interface QrCodeColor {
    backgroundColor: string;
    lightColor: string;
    darkColor: string;
}
export interface QrCodeVersionRange {
    verMin: number;
    verMax: number;
}
export interface QrCodeObj {
    content: string;
    size: number;
    errorCorrection: QrCodeCorrectionLevel;
    outputFormat: number;
    border: number;
    scale: number;
    colors: QrCodeColor;
    versionRange: QrCodeVersionRange;
    maskPattern: number;
    boostECL: boolean;
}
export interface QrCodeState {
    qr: QrCodeObj;
}
//# sourceMappingURL=qrcode.type.d.ts.map
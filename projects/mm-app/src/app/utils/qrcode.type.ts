export enum QrCodeCorrectionLevel {
  Low = 'low',
  Medium = 'medium',
  Quartile = 'quartile',
  High = 'high',
}

export enum QrCodeOutputFormat {
  vector,
  bitmap,
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
  boostECC: boolean;
}

export interface QrCodeState {
  qr: QrCodeObj;
}

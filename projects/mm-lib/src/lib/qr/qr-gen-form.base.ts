export interface QrGenField {
    label: string;
    type: QrGenFieldType;
    placeholder?: string;
    validators: Record<string, string | boolean>;
    options?: Record<string, string>[];
}

export enum QrGenFieldType {
    Input = 'input',
    InputPhoneInternational = 'inputPhoneInternational',
    InputPhone = 'inputPhone',
    Password = 'password',
    Textarea = 'text',
    Select = 'select',
    Checkbox = 'checkbox',
    RadioButton = 'radio',
}
export interface QrGenFormBase {
    submit: string;
}

export interface QrGenFormUrlType extends QrGenFormBase {
    content: string;
}

export interface QrGenFormVCard extends QrGenFormBase {
    firstName: string;
    lastName: string;
    contact: string;
    contact1: string;
    contact2: string;
    email: string;
    company: string;
    street: string;
    city: string;
    zip: string;
    state: string;
    country: string;
    website: string;
}

export interface QrGenFormWifi extends QrGenFormBase {
    ssid: string;
    password: string;
    hidden: boolean;
    encryption: QrGenFormWifiEncryption;
}

export enum QrGenFormWifiEncryption {
    WEP = 'WEP',
    WPA = 'WPA',
    WPA2 = 'WPA2',
    None = 'None',
}

export interface QrGenFormSms extends QrGenFormBase {
    number: string;
    message: string;
}

export interface QrGenFormEmail extends QrGenFormBase {
    email: string;
    subject: string;
    message: string;
}

export type QrGenForm = QrGenFormUrlType | QrGenFormVCard | QrGenFormWifi | QrGenFormSms | QrGenFormEmail;
export enum QR_GEN_FORM_TYPE {
    URL = 'Url',
    VCard = 'VCard',
    Wifi = 'Wifi',
    SMS = 'SMS',
    Email = 'Email',
}

export enum QR_CODE_DOWNLOAD_FORMAT {
    PNG = 'png',
    SVG = 'svg',
}

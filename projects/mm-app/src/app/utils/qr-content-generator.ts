export function generateWifiContent (ssid: string, password: string, hidden: boolean, encryption: string): string {
    return `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden.toString()};;`;
}

export function generateEmailContent (email: string, subject: string, body: string): string {
    return `mailto:${email}?subject=${subject}&body=${body}`;
}

export function generateSmsContent (number_p: string, message: string): string {
    return `sms:${number_p}?body=${message}`;
}

export function generateUrlContent (url: string): string {
    return url;
}

export function generateTextContent (text: string): string {
    return text;
}

export function generateVCardContent (firstName: string, lastName: string,
                                      phone1: string, phone2: string, email: string,
                                      company: string, street: string, city: string,
                                      zip: string, state: string, country: string,
                                      website: string): string {
    return `BEGIN:VCARD
VERSION:3.0
N:${lastName};${firstName}
FN:${firstName} ${lastName}
ORG:${company}
TEL;WORK:${phone1}
TEL;HOME:${phone2}
ADR;WORK:;;${company};
ADR:;;${street};${city};${state};${zip};${country};
EMAIL;INTERNET:${email}
URL:${website}
END:VCARD`;
}

export function toBoolean (value: string): boolean {
    const boolRegex = new RegExp('^true$', 'i');
    return boolRegex.test(value);
}

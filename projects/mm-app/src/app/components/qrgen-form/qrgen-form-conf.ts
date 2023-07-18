import {QrGenField, QrGenFieldType} from '@mm-lib/qr';

export const urlFormConf: Record<string, QrGenField> = {
    url: {
        label: 'URL',
        type: QrGenFieldType.Input,
        placeholder: 'https://example.com',
        validators: {
            required: true,
        },
    },
};

export const vCardFormConf: Record<string, QrGenField> = {
    firstName: {
        label: 'First Name',
        type: QrGenFieldType.Input,
        placeholder: 'John',
        validators: {
            required: true,
        },
    },
    lastName: {
        label: 'Last Name',
        type: QrGenFieldType.Input,
        placeholder: 'Doe',
        validators: {
            required: true,
        },
    },
    contact: {
        label: 'Contact',
        type: QrGenFieldType.InputPhone,
        placeholder: '+1 123 456 7890',
        validators: {
            // TODO: add phone number validator
        },
    },
    contact1: {
        label: 'Contact',
        type: QrGenFieldType.InputPhone,
        placeholder: '+1 123 456 7890',
        validators: {
            // TODO: add phone number validator
        },
    },
    email: {
        label: 'Email',
        type: QrGenFieldType.Input,
        placeholder: 'email@address.com',
        validators: {
            email: true,
        },
    },
    company: {
        label: 'Company',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    street: {
        label: 'Street',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    city: {
        label: 'City',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    zip: {
        label: 'ZIP',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    state: {
        label: 'State',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    country: {
        label: 'Country',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    website: {
        label: 'Website',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
};

export const wifiFormConf: Record<string, QrGenField>  = {
    ssid: {
        label: 'SSID',
        type: QrGenFieldType.Input,
        placeholder: 'Network Name',
        validators: {
            required: true,
        },
    },
    password: {
        label: 'Password',
        type: QrGenFieldType.Password,
        placeholder: 'Password',
        validators: {
            required: true,
        },
    },
    hidden: {
        label: 'Hidden',
        type: QrGenFieldType.Checkbox,
        placeholder: undefined,
        validators: {
            required: false,
        },
    },
    encryption: {
        label: 'Encryption',
        type: QrGenFieldType.RadioButton,
        options: [
            { label: 'WPA2', value: 'WPA2' },
            { label: 'WEP', value: 'WEP' },
            { label: 'WPA', value: 'WPA' },
            { label: 'None', value: 'None' },
        ],
        validators: {
            required: true,
        },
    },
};

export const smsFormConf: Record<string, QrGenField> = {
    number: {
        label: 'Number',
        type: QrGenFieldType.InputPhone,
        placeholder: '+1 123 456 7890',
        validators: {
            required: true,
        },
    },
    message: {
        label: 'Message',
        type: QrGenFieldType.Textarea,
        placeholder: 'Type Message Here',
        validators: {
            required: true,
        },
    },
};

export const emailFormConf: Record<string, QrGenField> = {
    email: {
        label: 'Email',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: true,
        },
    },
    subject: {
        label: 'Subject',
        type: QrGenFieldType.Input,
        placeholder: '',
        validators: {
            required: false,
        },
    },
    message: {
        label: 'Message',
        type: QrGenFieldType.Textarea,
        placeholder: 'Type Message Here',
        validators: {
            required: false,
        },
    },
};

import {Injectable} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {QrGenField, QrGenFieldType} from '@mm-lib/qr';

@Injectable({
    providedIn: 'root',
})
export class QrgenFormService {
    toForm (formConfig: Record<string, QrGenField>): FormGroup {
        const fields: Record<string, FormControl> = {};
        for (const [label, field] of Object.entries(formConfig)) {
            const placeholder = field.type !== QrGenFieldType.RadioButton ?
                field.placeholder : (typeof field.options !== 'undefined' ? field.options[0]['value'] : '');
            fields[label] = new FormControl( field.type !== QrGenFieldType.Checkbox ? placeholder : Boolean(placeholder), field.validators);
        }
        return new FormGroup(fields);
    }
}

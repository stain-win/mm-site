import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QrGenField, QrGenFieldType} from '@mm-lib/qr';
import {TuiCountryIsoCode} from '@taiga-ui/i18n';

@Component({
    selector: 'mm-qrgen-form-field',
    templateUrl: './qrgen-form-field.component.html',
    styleUrls: ['./qrgen-form-field.component.scss'],
})
export class QrgenFormFieldComponent implements OnInit {

    get isValid (): boolean {
        return this.formGroup.get(this.field.label)?.valid as boolean;
    }

    protected readonly QrGenFieldType = QrGenFieldType;

    field: QrGenField = {} as QrGenField;
    fieldName = '';

    @Input() fieldRecord: [string, QrGenField] | undefined;

    @Input()
    public formGroup!: FormGroup;

    public countries: TuiCountryIsoCode[] = Object.values(TuiCountryIsoCode).sort();

    ngOnInit (): void {
        this.field = this.fieldRecord ? this.fieldRecord[1] : {} as QrGenField;
        this.fieldName = this.fieldRecord ? this.fieldRecord[0] : '';
    }
}

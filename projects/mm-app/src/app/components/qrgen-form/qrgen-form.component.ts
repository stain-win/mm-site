import {Component, EventEmitter, Inject, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {QrCodeObj} from '@mm-lib';
import {QrGenField, QR_CODE_OPTIONS, QR_GEN_FORM_TYPE} from '@mm-lib/qr';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {mapValues} from 'lodash';
import {debounceTime, distinctUntilChanged, map, takeUntil, tap} from 'rxjs';

import {EntriesOf, EntryOf} from '../../types/utils';
import {
    generateEmailContent, generateSmsContent,
    generateUrlContent,
    generateVCardContent,
    generateWifiContent,
} from '../../utils/qr-content-generator';
import {QrgenFormService} from './qrgen-form.service';

@Component({
    selector: 'mm-qrgen-form',
    templateUrl: './qrgen-form.component.html',
    styleUrls: ['./qrgen-form.component.scss'],
    providers: [TuiDestroyService, QrgenFormService],
})
export class QrgenFormComponent implements OnInit, OnChanges {
    @Input() public formConfig: Record<string, QrGenField> = {};
    @Input() public formType = QR_GEN_FORM_TYPE.URL;

    @Output() qrGenData = new EventEmitter<QrCodeObj>();

    public qrGenForm!: FormGroup;
    public qrGenFormFields: EntryOf<Record<string, QrGenField>>[] | undefined;

    constructor (
        private fb: FormBuilder,
        protected qrgenFormService: QrgenFormService,
        @Inject(QR_CODE_OPTIONS) public qrCode: QrCodeObj,
        @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    ) {
    }

    ngOnInit (): void {
    }
    ngOnChanges (changes: SimpleChanges): void {
        this.qrGenFormFields = this.objEntries<typeof this.formConfig>(this.formConfig);
        this.qrGenForm = this.qrgenFormService.toForm(this.formConfig);

        this.qrGenData.emit({ ...this.qrCode, content: this.generateQrCodeContent(this.qrGenForm.getRawValue())});
        this.qrGenForm.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            map((val: Record<string, string>) => {
                return mapValues(val, (v: string | boolean) => typeof v === 'string' ? v.trim() : v);
            }),
            tap(val => {
                const qrCodeContent = this.generateQrCodeContent(val);
                const qrConfig = { ...this.qrCode};
                if (this.formType === QR_GEN_FORM_TYPE.VCard) {
                    qrConfig.size = 8;
                }
                this.qrGenData.emit({ ...this.qrCode, content: qrCodeContent});
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }

    private objEntries = <T extends {}>(obj: T) => Object.entries(obj) as EntriesOf<T>;
    private generateQrCodeContent (val: Record<string, string | boolean>): string {
        switch (this.formType) {
            case QR_GEN_FORM_TYPE.URL:
                // @ts-ignore
                return generateUrlContent(...Object.values(val));
            case QR_GEN_FORM_TYPE.Wifi:
                // @ts-ignore
                return generateWifiContent(...Object.values(val));
            case QR_GEN_FORM_TYPE.VCard:
                // @ts-ignore
                return generateVCardContent(...Object.values(val));
            case QR_GEN_FORM_TYPE.Email:
                // @ts-ignore
                return generateEmailContent(...Object.values(val));
            case QR_GEN_FORM_TYPE.SMS:
                // @ts-ignore
                return generateSmsContent(...Object.values(val));
            default:
                // @ts-ignore
                return generateUrlContent(...Object.values(val));
        }
    }
}

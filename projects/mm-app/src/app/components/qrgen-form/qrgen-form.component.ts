import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Inject,
    Input,
    OnChanges,
    Output,
    SimpleChanges,
} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {QrCodeObj} from '@mm-lib';
import {QrGenField, QR_CODE_OPTIONS, QR_GEN_FORM_TYPE} from '@mm-lib/qr';
import {TuiDestroyService} from '@taiga-ui/cdk';
import { mapValues } from 'lodash-es';

import {debounceTime, distinctUntilChanged, map, Subject, switchMap, takeUntil, tap} from 'rxjs';

import {EntriesOf, EntryOf, SpreadParamsOfType} from '../../types/utils';
import {
    generateEmailContent, generateSmsContent,
    generateUrlContent,
    generateVCardContent,
    generateWifiContent,
} from '../../utils/qr-content-generator';
import {defaultFormConf} from './qrgen-form-conf';
import {QrgenFormService} from './qrgen-form.service';
import {QrGenFormWifi} from '../../../../../mm-lib/src/lib/qr';

@Component({
    selector: 'mm-qrgen-form',
    templateUrl: './qrgen-form.component.html',
    styleUrls: ['./qrgen-form.component.scss'],
    providers: [TuiDestroyService, QrgenFormService],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QrgenFormComponent implements OnChanges {

    private formChange = new Subject<boolean>();
    @Input() public formConfig: Record<string, QrGenField> = defaultFormConf;
    @Input() public formType = QR_GEN_FORM_TYPE.URL;

    @Output() qrGenData = new EventEmitter<QrCodeObj>();

    public qrGenForm: FormGroup;
    public qrGenFormFields: EntryOf<Record<string, QrGenField>>[] | undefined;

    constructor (
        protected qrgenFormService: QrgenFormService,
        @Inject(QR_CODE_OPTIONS) public qrCode: QrCodeObj,
        @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    ) {
        this.qrGenForm = this.qrgenFormService.toForm(this.formConfig);
    }

    ngOnChanges (changes: SimpleChanges): void {
        this.qrGenFormFields = this.objEntries<typeof this.formConfig>(changes['formConfig'].currentValue);
        this.qrGenForm = this.qrgenFormService.toForm(changes['formConfig'].currentValue);
        this.qrGenData.emit({...this.qrCode, content: this.generateQrCodeContent(this.qrGenForm.getRawValue())});
        this.formChange.pipe(
            switchMap(_ => this.qrGenForm.valueChanges.pipe(
                    distinctUntilChanged(),
                    debounceTime(200),
                    map((val: Record<string, string>) => {
                        return mapValues(val, (v: string | boolean) => typeof v === 'string' ? v.trim() : v);
                    }),
                    tap(val => {
                        const qrCodeContent = this.generateQrCodeContent(val);
                        const qrConfig = {...this.qrCode};
                        if (changes['formType'].currentValue === QR_GEN_FORM_TYPE.VCard) {
                            qrConfig.size = 8;
                        }
                        this.qrGenData.emit({...this.qrCode, content: qrCodeContent});
                    }),
                ),
            ),
            takeUntil(this.destroy$),
        ).subscribe();
        this.formChange.next(true);
    }

    private objEntries = <T extends {}>(obj: T) => Object.entries(obj) as EntriesOf<T>;

    private generateQrCodeContent (val: Record<string, string | boolean>): string {
        const args = Object.values(val);
        switch (this.formType) {
            case QR_GEN_FORM_TYPE.URL:
                return generateUrlContent(args[0] as string);
            case QR_GEN_FORM_TYPE.Wifi:
                return generateWifiContent(...args as SpreadParamsOfType<typeof generateWifiContent>);
            case QR_GEN_FORM_TYPE.VCard:
                return generateVCardContent(...args as SpreadParamsOfType<typeof generateVCardContent>);
            case QR_GEN_FORM_TYPE.Email:
                return generateEmailContent(...args as SpreadParamsOfType<typeof generateEmailContent>);
            case QR_GEN_FORM_TYPE.SMS:
                return generateSmsContent(...args as SpreadParamsOfType<typeof generateSmsContent>);
            default:
                return generateUrlContent(args[0] as string);
        }
    }
}

import {AfterContentInit, ChangeDetectionStrategy, Component, ElementRef, Inject, NgZone, OnInit} from '@angular/core';
import {UntypedFormBuilder, UntypedFormGroup} from '@angular/forms';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {debounceTime, distinctUntilChanged, filter, map, takeUntil, tap} from 'rxjs';
import {drawCanvas, getInputErrorCorrectionLevel, toSvgString} from '../../utils/generator';
import {Ecc, QrCode, QrSegment} from '../../utils/qrcode';
import {QrCodeCorrectionLevel, QrCodeObj, QrCodeOutputFormat} from '../../utils/qrcode.type';

@Component({
    selector: 'mm-qrgen',
    templateUrl: './qrgen.component.html',
    styleUrls: ['./qrgen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiDestroyService],
})
export class QrgenComponent implements OnInit, AfterContentInit {
    private qrData = {
        content: 'https://miroslavmitrovic.rs',
        size: 5,
        errorCorrection: QrCodeCorrectionLevel.Medium,
        outputFormat: QrCodeOutputFormat.vector,
        border: 2,
        scale: 8,
        colors: {
            backgroundColor: '#ffffff',
            lightColor: '#ffffff',
            darkColor: '#000000',
        },
        versionRange: {
            verMin: 1,
            verMax: 40,
        },
        maskPattern: -1,
        boostECC: true,
    };
    public qrGenForm: UntypedFormGroup = this.fb.group({});

    public svg: any;
    public canvas: any;

    constructor (
        public container: ElementRef,
        private zone: NgZone,
        private fb: UntypedFormBuilder,
        @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    ) {
    }

    ngOnInit (): void {
        this._buildForm();
        this.qrGenForm.valueChanges.pipe(
            distinctUntilChanged(),
            debounceTime(300),
            map((val) => val.qrCodeValue.trim()),
            filter((val: string) => val.length > 0),
            tap(val => {
                this.qrData.content = val;
                this._drawCode(this.qrData);
            }),
            takeUntil(this.destroy$),
        ).subscribe();
    }

    ngAfterContentInit (): void {
        this.svg = this.container.nativeElement.querySelector('#qrcode-svg');
        this._drawCode(this.qrData);
    }

    private _drawCode (qr: QrCodeObj): void {
        const qrCode = QrCode.encodeText(qr.content, Ecc.QUARTILE);
        const segQr = QrSegment.makeSegments(qr.content);
        const qrCode1 = QrCode.encodeSegments(
            segQr,
            getInputErrorCorrectionLevel(qr),
            qr.versionRange?.verMin,
            qr.versionRange?.verMax,
            qr.maskPattern,
            qr.boostECC);

        switch (qr.outputFormat) {
            case QrCodeOutputFormat.vector:
            default:
                this._drawSvg(qrCode1, qr);
                break;
            case QrCodeOutputFormat.bitmap:
                this._drawCanvas(qrCode1, qr);
                break;
        }
    }

    private _buildForm (): void {
        this.qrGenForm.addControl('qrCodeValue', this.fb.control(''));
    }

    private _drawSvg (qrCode: QrCode, qr: QrCodeObj): void {
        const code = toSvgString(qrCode, qr.border as number, qr.colors?.lightColor as string, qr.colors?.darkColor as string);
        const viewBox: string = (/ viewBox="([^"]*)"/.exec(code) as RegExpExecArray)[1];
        const pathD: string = (/ d="([^"]*)"/.exec(code) as RegExpExecArray)[1];
        this.zone.runOutsideAngular(() => {
            this.svg.setAttribute('viewBox', viewBox);
            (this.svg.querySelector('path') as Element).setAttribute('d', pathD);
            (this.svg.querySelector('rect') as Element).setAttribute('fill', qr.colors?.lightColor as string);
            (this.svg.querySelector('path') as Element).setAttribute('fill', qr.colors?.darkColor as string);
        });
    }

    private _drawCanvas (qrCode: QrCode, qr: QrCodeObj): void {
        this.zone.runOutsideAngular(() => {
            drawCanvas(qrCode,
                qr?.scale as number,
                qr.border as number,
                qr.colors?.lightColor as string,
                qr.colors?.darkColor as string,
                this.canvas);
        });
    }
}

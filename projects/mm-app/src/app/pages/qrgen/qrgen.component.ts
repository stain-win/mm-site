import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    Inject,
    NgZone,
} from '@angular/core';
import {QrCodeObj, QrCodeOutputFormat} from '@mm-lib';
import {QR_CODE_DOWNLOAD_FORMAT, QR_CODE_OPTIONS, QR_GEN_FORM_TYPE} from '@mm-lib/qr';
import {TuiDestroyService} from '@taiga-ui/cdk';
import {animationFrameScheduler, observeOn, of, takeUntil, tap} from 'rxjs';
import {
    emailFormConf,
    smsFormConf,
    urlFormConf,
    vCardFormConf,
    wifiFormConf,
} from '../../components/qrgen-form/qrgen-form-conf';
import {QrgeneratorService} from '../../services/qrgenerator.service';
import {drawCanvas, getInputErrorCorrectionLevel, toSvgString} from '../../utils/generator';
import { QrCode, QrSegment} from '../../utils/qrcode';

@Component({
    selector: 'mm-qrgen',
    templateUrl: './qrgen.component.html',
    styleUrls: ['./qrgen.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [TuiDestroyService, QrgeneratorService],
})
export class QrgenComponent implements AfterViewInit {
    protected readonly QR_CODE_DOWNLOAD_FORMAT = QR_CODE_DOWNLOAD_FORMAT;

    public svg: any;
    public canvas: any;
    public formType = QR_GEN_FORM_TYPE.URL;
    public formConfig = urlFormConf;

    constructor (
        public container: ElementRef,
        protected qrgeneratorService: QrgeneratorService,
        private zone: NgZone,
        @Inject(QR_CODE_OPTIONS) public qrCode: QrCodeObj,
        @Inject(TuiDestroyService) private readonly destroy$: TuiDestroyService,
    ) {
    }

    setQrGenFormType (option: QR_GEN_FORM_TYPE): void {
        this.formType = option;
        switch (option) {
            case QR_GEN_FORM_TYPE.URL:
                this.formConfig = urlFormConf;
                break;
            case QR_GEN_FORM_TYPE.Wifi:
                this.formConfig = wifiFormConf;
                break;
            case QR_GEN_FORM_TYPE.VCard:
                this.formConfig = vCardFormConf;
                break;
            case QR_GEN_FORM_TYPE.SMS:
                this.formConfig = smsFormConf;
                break;
            case QR_GEN_FORM_TYPE.Email:
                this.formConfig = emailFormConf;
                break;
            default:
                this.formConfig = urlFormConf;
        }
    }

    drawCode ($event: QrCodeObj): void {
        of($event).pipe(
            tap(qr => this.qrCode = qr),
            observeOn(animationFrameScheduler),
            takeUntil(this.destroy$),
        ).subscribe( qr => this._drawCode(qr));
    }

    ngAfterViewInit (): void {
        this.svg = (this.container.nativeElement as HTMLElement).querySelector('#qrcode-svg');
    }

    downloadCode ($event: MouseEvent, format: QR_CODE_DOWNLOAD_FORMAT): void {
        switch (format) {
            case QR_CODE_DOWNLOAD_FORMAT.SVG:
                this.qrgeneratorService.downloadQrSVG(this.qrCode).subscribe();
                break;
            case QR_CODE_DOWNLOAD_FORMAT.PNG:
            default:
                this.qrgeneratorService.downloadQrPng(this.qrCode).subscribe();
                break;
        }
    }

    private _drawCode (qr: QrCodeObj): void {
        const segQr = QrSegment.makeSegments(qr.content);
        const qrCode1 = QrCode.encodeSegments(
            segQr,
            getInputErrorCorrectionLevel(qr),
            qr.versionRange?.verMin,
            qr.versionRange?.verMax,
            qr.maskPattern,
            qr.boostECL);

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

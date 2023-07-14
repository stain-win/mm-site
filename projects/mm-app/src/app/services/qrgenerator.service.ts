import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {QrCodeObj} from '@mm-lib';
import {Observable, tap} from 'rxjs';
import {environment} from '../../environments/environment';

@Injectable({
    providedIn: 'root',
})
export class QrgeneratorService {
    protected _baseUrl = 'qr/';
    protected _serviceUrl = environment.qrApiUrl;
    constructor (protected _http: HttpClient) {
    }

    public downloadQrPng (data: QrCodeObj): Observable<any> {
        return this._http.post(`${this._serviceUrl}${this._baseUrl}img`,
            {
                qr_content: encodeURI(data.content),
                bg_color: data.colors.backgroundColor,
                color: data.colors.darkColor,
                size: data.size,
                err_level: data.errorCorrection,
            },
            {
                responseType: 'blob',
            }).pipe(
            tap( fileData => {
                const downloadURL = window.URL.createObjectURL(fileData);
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = 'qrcode.png';
                link.click();
            }),
        );
    }

    public downloadQrSVG (data: QrCodeObj): Observable<any> {
        return this._http.post(`${this._serviceUrl}${this._baseUrl}svg`,
            {
                qr_content: encodeURI(data.content),
                bg_color: data.colors.backgroundColor,
                color: data.colors.darkColor,
                size: data.size,
            },
            {
                responseType: 'blob',
            }).pipe(
            tap( fileData => {
                const downloadURL = window.URL.createObjectURL(fileData);
                const link = document.createElement('a');
                link.href = downloadURL;
                link.download = 'qrcode.svg';
                link.click();
            }),
        );
    }
}

import {Component, EventEmitter, Output} from '@angular/core';
import {QR_GEN_FORM_TYPE} from '../../types/qr-gen-form.base';

@Component({
  selector: 'mm-qrgen-navigation',
  templateUrl: './qrgen-navigation.component.html',
  styleUrls: ['./qrgen-navigation.component.scss'],
})
export class QrgenNavigationComponent {
    activeItemIndex = 0;

    options: QR_GEN_FORM_TYPE[] = [
        QR_GEN_FORM_TYPE.URL,
        QR_GEN_FORM_TYPE.SMS,
        QR_GEN_FORM_TYPE.Email,
        QR_GEN_FORM_TYPE.Wifi,
        QR_GEN_FORM_TYPE.VCard,
    ];

    @Output() itemClick = new EventEmitter<QR_GEN_FORM_TYPE>();

    onClick (item: QR_GEN_FORM_TYPE): void {
        this.itemClick.emit(item as QR_GEN_FORM_TYPE);
    }

}

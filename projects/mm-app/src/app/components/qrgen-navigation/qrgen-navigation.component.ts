import {ChangeDetectionStrategy, Component, EventEmitter, Output} from '@angular/core';
import {QR_GEN_FORM_TYPE} from '@mm-lib/qr';

@Component({
    selector: 'mm-qrgen-navigation',
    templateUrl: './qrgen-navigation.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
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

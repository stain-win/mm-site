import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {TuiButtonModule} from '@taiga-ui/core';
import {QrgenFormModule} from '../../components/qrgen-form/qrgen-form.module';
import {QrgenNavigationModule} from '../../components/qrgen-navigation/qrgen-navigation.module';
import {QrgenRoutingModule} from './qrgen-routing.module';
import {QrgenComponent} from './qrgen.component';

@NgModule({
    declarations: [
        QrgenComponent,
    ],
    imports: [
        CommonModule,
        QrgenFormModule,
        QrgenNavigationModule,
        QrgenRoutingModule,
        TuiButtonModule,
        HttpClientModule,
    ],
    exports: [
        QrgenComponent,
    ],
})
export class QrgenModule {
}

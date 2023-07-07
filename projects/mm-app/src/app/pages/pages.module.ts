import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiButtonModule} from '@taiga-ui/core';
import {TuiInputModule, TuiTextAreaModule} from '@taiga-ui/kit';
import {QrgenFormModule} from '../components/qrgen-form/qrgen-form.module';
import {QrgenNavigationModule} from '../components/qrgen-navigation/qrgen-navigation.module';
import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';
import {QrgenComponent} from './qrgen/qrgen.component';


@NgModule({
    declarations: [
        PagesComponent,
        QrgenComponent,
    ],
    exports: [
        PagesComponent,
    ],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ReactiveFormsModule,
        TuiTextAreaModule,
        TuiInputModule,
        QrgenFormModule,
        QrgenNavigationModule,
        TuiButtonModule,
        HttpClientModule,
    ],
})
export class PagesModule {
}

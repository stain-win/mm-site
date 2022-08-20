import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiInputModule, TuiTextAreaModule} from '@taiga-ui/kit';
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
    ],
})
export class PagesModule {
}

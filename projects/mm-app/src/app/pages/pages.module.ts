import {NgModule} from '@angular/core';
import {PagesRoutingModule} from './pages-routing.module';
import {PagesComponent} from './pages.component';

@NgModule({
    declarations: [
        PagesComponent,
    ],
    exports: [
        PagesComponent,
    ],
    imports: [
        PagesRoutingModule,
    ],
})
export class PagesModule {
}

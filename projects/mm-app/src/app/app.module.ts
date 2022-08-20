import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TuiRootModule} from '@taiga-ui/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PagesModule} from './pages/pages.module';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        NoopAnimationsModule,
        AppRoutingModule,
        PagesModule,
        TuiRootModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}

import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {BootstrapModule, QR_GENERATOR_ENGINE} from '@mm-lib';
import {TuiAlertModule, TuiModeModule, TuiRootModule, TuiThemeNightModule} from '@taiga-ui/core';
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
        BootstrapModule.forRoot({
            grGeneratorEngine: QR_GENERATOR_ENGINE.Client,
        }),
        PagesModule,
        TuiAlertModule,
        TuiModeModule,
        TuiRootModule,
        TuiThemeNightModule,
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule {
}

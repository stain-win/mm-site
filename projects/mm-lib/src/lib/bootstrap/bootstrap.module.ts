import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule, Optional, SkipSelf} from '@angular/core';
import {TuiAlertService} from '@taiga-ui/core';
import {BootstrapConfig, BOOTSTRAP_CONFIG} from './configs/bootstrap.config';
import {interceptorProviders} from './interceptors';


@NgModule({
    declarations: [],
    imports: [
        CommonModule,
    ],
    providers: [
        interceptorProviders,
        TuiAlertService,
    ],
    exports: [
        CommonModule,
    ],
})
export class BootstrapModule {
    static forRoot (config: BootstrapConfig): ModuleWithProviders<BootstrapModule> {
        return {
            ngModule: BootstrapModule,
            providers: [
                {
                    provide: BOOTSTRAP_CONFIG,
                    useValue: config,
                },
            ],
        };
    }

    constructor (@Optional() @SkipSelf() parentModule: BootstrapModule) {
        if (parentModule) {
            throw new Error('BootstrapModule is already loaded. Import it in the AppModule only');
        }
    }
}

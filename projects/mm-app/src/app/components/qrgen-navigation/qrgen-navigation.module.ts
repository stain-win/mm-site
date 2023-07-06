import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {TuiTabsModule} from '@taiga-ui/kit';
import { QrgenNavigationComponent } from './qrgen-navigation.component';



@NgModule({
    declarations: [
        QrgenNavigationComponent,
    ],
    imports: [
        CommonModule,
        TuiTabsModule,
    ],
    exports: [
        QrgenNavigationComponent,
    ],
})
export class QrgenNavigationModule { }

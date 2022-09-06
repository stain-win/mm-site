import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {WebglRoutingModule} from './webgl-routing.module';
import { WebglComponent } from './webgl.component';


@NgModule({
    declarations: [
    WebglComponent,
  ],
    imports: [
        CommonModule,
        WebglRoutingModule,
    ],
})
export class WebglModule {
}

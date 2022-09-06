import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WebglComponent } from './webgl.component';

const routes: Routes = [
    {
        path: '',
        component: WebglComponent,
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WebglRoutingModule { }

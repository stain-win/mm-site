import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {PagesComponent} from './pages.component';


const routes: Routes = [
    {
        path: '',
        component: PagesComponent,
    },
    {
        path: 'webgl',
        loadChildren: () => import('./webgl/webgl.module').then(m => m.WebglModule),
    },
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {}

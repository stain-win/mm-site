import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


const routes: Routes = [
    {
        path: '',
        loadChildren: () => import('./qrgen/qrgen.module').then(m => m.QrgenModule),
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

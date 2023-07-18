import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {QrgenComponent} from './qrgen.component';

const routes: Routes = [
    {
        path: '',
        component: QrgenComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class QrgenRoutingModule {}

import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiAutoFocusModule} from '@taiga-ui/cdk';
import {TuiGroupModule} from '@taiga-ui/core';
import {
    TuiCheckboxLabeledModule,
    TuiInputModule,
    TuiInputPasswordModule, TuiInputPhoneInternationalModule, TuiInputPhoneModule,
    TuiRadioBlockModule, TuiTextareaModule,
} from '@taiga-ui/kit';
import { QrgenFormFieldComponent } from './qrgen-form-field/qrgen-form-field/qrgen-form-field.component';
import {QrgenFormComponent} from './qrgen-form.component';


@NgModule({
    declarations: [
        QrgenFormComponent,
        QrgenFormFieldComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TuiInputModule,
        TuiCheckboxLabeledModule,
        TuiInputPasswordModule,
        TuiGroupModule,
        TuiRadioBlockModule,
        TuiInputPhoneInternationalModule,
        TuiInputPhoneModule,
        TuiAutoFocusModule,
        TuiTextareaModule,
    ],
    exports: [
        QrgenFormComponent,
        QrgenFormFieldComponent,
    ],
})
export class QrgenFormModule {
}

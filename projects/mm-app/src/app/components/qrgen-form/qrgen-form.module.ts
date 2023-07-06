import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {TuiGroupModule} from '@taiga-ui/core';
import {
    TuiCheckboxLabeledModule,
    TuiInputModule,
    TuiInputPasswordModule, TuiInputPhoneInternationalModule,
    TuiRadioBlockModule,
    TuiTextAreaModule,
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
        TuiTextAreaModule,
        TuiInputPasswordModule,
        TuiGroupModule,
        TuiRadioBlockModule,
        TuiInputPhoneInternationalModule,
    ],
    exports: [
        QrgenFormComponent,
        QrgenFormFieldComponent,
    ],
})
export class QrgenFormModule {
}

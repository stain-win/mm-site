import {ChangeDetectionStrategy, Component} from '@angular/core';

@Component({
    selector: 'mm-root',
    templateUrl: './app.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    title = 'miroslavmitrovic.rs';
}

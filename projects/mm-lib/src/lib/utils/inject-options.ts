import {InjectionToken} from '@angular/core';

export function createInjectOptions<T> (defaults: T): InjectionToken<T> {
    return new InjectionToken<T>(``, {
        factory: () => defaults,
    });
}

import {InjectionToken} from '@angular/core';

export enum QR_GENERATOR_ENGINE {
    Client = 'client',
    Server = 'server',
}
export interface BootstrapConfig {
    grGeneratorEngine: QR_GENERATOR_ENGINE;
}

export const BOOTSTRAP_CONFIG = new InjectionToken<BootstrapConfig>('BootstrapConfig');

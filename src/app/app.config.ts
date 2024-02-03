import {ApplicationConfig, importProvidersFrom} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideNoopAnimations} from "@angular/platform-browser/animations";
import {provideHttpClient} from "@angular/common/http";
import {MAT_COLOR_FORMATS, NGX_MAT_COLOR_FORMATS} from "@angular-material-components/color-picker";

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideNoopAnimations(),
    provideHttpClient(),
    importProvidersFrom(AbortController),
    {provide: MAT_COLOR_FORMATS, useValue: {display: {colorInput: "hex"}}}
  ]
};

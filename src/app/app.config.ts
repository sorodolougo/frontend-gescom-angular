import { ApplicationConfig, provideBrowserGlobalErrorListeners,  } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { icons } from './icons-provider';
import { provideNzIcons } from 'ng-zorro-antd/icon';
import { fr_FR, provideNzI18n } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './core/interceptors/error.interceptor';

registerLocaleData(fr);

export const appConfig: ApplicationConfig = {
  providers: [
  // provideExperimentalZonelessChangeDetection(), // V21+ Gérer automatiquement par defaut //Il met à jour l'écran uniquement là où un Signal a changé de valeur
    provideBrowserGlobalErrorListeners(),
    // FIX PRO : On injecte l'option pour robotiser le passage des paramètres d'URL (ex: :id) vers les Inputs
    provideRouter(
      routes, 
      withComponentInputBinding() 
    ),
    provideRouter(routes),
    provideNzIcons(icons),
    provideNzI18n(fr_FR),
    provideHttpClient(
      withInterceptors([errorInterceptor]) 
    ),
  ],
};
function provideExperimentalZonelessChangeDetection(): import("@angular/core").Provider | import("@angular/core").EnvironmentProviders {
  throw new Error('Function not implemented.');
}


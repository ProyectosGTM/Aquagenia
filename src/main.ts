import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

// Configuración de la clave de licencia con config
import config from 'devextreme/core/config';
import { licenseKey } from './devextreme-license';

// Configuración de la licencia
config({
  licenseKey: licenseKey,
});

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch(err => console.error(err));

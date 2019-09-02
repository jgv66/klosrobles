import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { IonicStorageModule } from '@ionic/storage';
import { DatosService } from './services/datos.service';
import { HttpClientModule } from '@angular/common/http';
import { ComponentsModule } from './components/components.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

import { NgxChartsModule } from '@swimlane/ngx-charts';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { NoopAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [AppComponent ],
  entryComponents: [],
  imports:  [ BrowserModule,
              IonicModule.forRoot(),
              AppRoutingModule,
              HttpClientModule,
              IonicStorageModule.forRoot(),
              ComponentsModule,
              NgxChartsModule,
              // BrowserModule,
              // BrowserAnimationsModule,
              // NoopAnimationsModule,
              ServiceWorkerModule.register('ngsw-worker.js',
              { enabled: environment.production })
            ],
  providers: [StatusBar,
              SplashScreen,
              DatosService,
              UniqueDeviceID,
              { provide: RouteReuseStrategy, useClass: IonicRouteStrategy } ],
  bootstrap: [ AppComponent ]
})
export class AppModule {}

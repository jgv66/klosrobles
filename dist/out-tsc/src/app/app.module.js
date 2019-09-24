import * as tslib_1 from "tslib";
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
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = tslib_1.__decorate([
        NgModule({
            declarations: [AppComponent],
            entryComponents: [],
            imports: [BrowserModule,
                IonicModule.forRoot(),
                AppRoutingModule,
                HttpClientModule,
                IonicStorageModule.forRoot(),
                ComponentsModule,
                NgxChartsModule,
                ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
            ],
            providers: [StatusBar,
                SplashScreen,
                DatosService,
                UniqueDeviceID,
                { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
            bootstrap: [AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
export { AppModule };
//# sourceMappingURL=app.module.js.map
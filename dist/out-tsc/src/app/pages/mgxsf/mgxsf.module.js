import * as tslib_1 from "tslib";
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MgxsfPage } from './mgxsf.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { DocumentosPage } from '../documentos/documentos.page';
import { DocumentosPageModule } from '../documentos/documentos.module';
var routes = [
    {
        path: '',
        component: MgxsfPage
    }
];
var MgxsfPageModule = /** @class */ (function () {
    function MgxsfPageModule() {
    }
    MgxsfPageModule = tslib_1.__decorate([
        NgModule({
            entryComponents: [PeriodosComponent, NotasPage, DocumentosPage],
            imports: [
                CommonModule,
                FormsModule,
                IonicModule,
                ComponentsModule,
                NotasPageModule,
                DocumentosPageModule,
                RouterModule.forChild(routes)
            ],
            declarations: [MgxsfPage]
        })
    ], MgxsfPageModule);
    return MgxsfPageModule;
}());
export { MgxsfPageModule };
//# sourceMappingURL=mgxsf.module.js.map
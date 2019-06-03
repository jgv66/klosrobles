import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SuperfamPage } from './superfam.page';
import { ComponentsModule } from '../../components/components.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { VistasPage } from '../../components/vistas/vistas.page';
import { VistasPageModule } from '../../components/vistas/vistas.module';

const routes: Routes = [
  {
    path: '',
    component: SuperfamPage
  }
];

@NgModule({
  entryComponents: [ PeriodosComponent, NotasPage, VistasPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NotasPageModule,
    VistasPageModule
  ],
  declarations: [SuperfamPage]
})
export class SuperfamPageModule {}

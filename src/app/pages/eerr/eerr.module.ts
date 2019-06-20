import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EerrPage } from './eerr.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

const routes: Routes = [
  {
    path: '',
    component: EerrPage
  }
];

@NgModule({
  entryComponents: [ NotasPage, PeriodosComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NotasPageModule
  ],
  declarations: [EerrPage]
})
export class EerrPageModule {}

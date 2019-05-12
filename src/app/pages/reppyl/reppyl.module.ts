import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReppylPage } from './reppyl.page';
import { ComponentsModule } from '../../components/components.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';

const routes: Routes = [
  {
    path: '',
    component: ReppylPage
  }
];

@NgModule({
  entryComponents: [ PeriodosComponent, NotasPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NotasPageModule
  ],
  declarations: [ReppylPage]
})
export class ReppylPageModule {}

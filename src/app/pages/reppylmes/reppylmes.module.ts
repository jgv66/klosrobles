import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReppylmesPage } from './reppylmes.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { VistasPage } from '../../components/vistas/vistas.page';
import { VistasPageModule } from '../../components/vistas/vistas.module';
const routes: Routes = [
  {
    path: '',
    component: ReppylmesPage
  }
];

@NgModule({
  entryComponents: [ NotasPage, VistasPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    NotasPageModule,
    VistasPageModule  ],
  declarations: [ReppylmesPage]
})
export class ReppylmesPageModule {}

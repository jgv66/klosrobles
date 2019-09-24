import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MgxsfPage } from './mgxsf.page';

import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { DocumentosPage } from '../documentos/documentos.page';
import { DocumentosPageModule } from '../documentos/documentos.module';

const routes: Routes = [
  {
    path: '',
    component: MgxsfPage
  }
];

@NgModule({
  entryComponents: [ PeriodosComponent, NotasPage, DocumentosPage ],
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
export class MgxsfPageModule {}

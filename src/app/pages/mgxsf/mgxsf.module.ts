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

const routes: Routes = [
  {
    path: '',
    component: MgxsfPage
  }
];

@NgModule({
  entryComponents: [ PeriodosComponent, NotasPage ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    NotasPageModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MgxsfPage]
})
export class MgxsfPageModule {}

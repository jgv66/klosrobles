import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { PptoPage } from './ppto.page';
import { ComponentsModule } from '../../components/components.module';
import { NotasPage } from '../notas/notas.page';
import { NotasPageModule } from '../notas/notas.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

const routes: Routes = [
  {
    path: '',
    component: PptoPage
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
    NgxChartsModule,
    NotasPageModule ],
  declarations: [PptoPage]
})
export class PptoPageModule {}

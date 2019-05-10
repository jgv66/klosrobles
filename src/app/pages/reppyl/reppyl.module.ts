import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReppylPage } from './reppyl.page';
import { ComponentsModule } from '../../components/components.module';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

const routes: Routes = [
  {
    path: '',
    component: ReppylPage
  }
];

@NgModule({
  entryComponents: [ PeriodosComponent ],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule
  ],
  declarations: [ReppylPage]
})
export class ReppylPageModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PeriodosComponent } from './periodos/periodos.component';

@NgModule({
  declarations: [ HeaderComponent, PeriodosComponent ],
  exports:      [ HeaderComponent, PeriodosComponent ],  /* esto se escribe para exportar */
  imports:      [ CommonModule, IonicModule ]
})
export class ComponentsModule { }

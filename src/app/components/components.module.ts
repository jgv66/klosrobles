import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { DoblealtoComponent } from './doblealto/doblealto.component';
import { DobletextComponent } from './dobletext/dobletext.component';

@NgModule({
  declarations: [ HeaderComponent, PeriodosComponent, DoblealtoComponent, DobletextComponent ],
  exports:      [ HeaderComponent, PeriodosComponent, DoblealtoComponent, DobletextComponent ],  /* esto se escribe para exportar */
  imports:      [ CommonModule, IonicModule ]
})
export class ComponentsModule { }

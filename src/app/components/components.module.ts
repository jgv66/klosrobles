import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { DoblealtoComponent } from './doblealto/doblealto.component';
import { DobletextComponent } from './dobletext/dobletext.component';
import { ItemComponent } from './item/item.component';

@NgModule({
  declarations: [ HeaderComponent, PeriodosComponent, DoblealtoComponent, DobletextComponent, ItemComponent ],
  exports:      [ HeaderComponent, PeriodosComponent, DoblealtoComponent, DobletextComponent, ItemComponent ],
  imports:      [ CommonModule, IonicModule ]
})
export class ComponentsModule { }

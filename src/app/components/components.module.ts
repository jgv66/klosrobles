import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { HeaderComponent } from './header/header.component';
import { PeriodosComponent } from './periodos/periodos.component';
import { ItemComponent } from './item/item.component';
import { ItemmgComponent } from './itemmg/itemmg.component';
import { ItempylComponent } from './itempyl/itempyl.component';
import { ItempptoComponent } from './itemppto/itemppto.component';

@NgModule({
  declarations: [ HeaderComponent, PeriodosComponent, ItemComponent, ItemmgComponent, ItempylComponent, ItempptoComponent ],
  exports:      [ HeaderComponent, PeriodosComponent, ItemComponent, ItemmgComponent, ItempylComponent, ItempptoComponent ],
  imports:      [ CommonModule, IonicModule ]
})
export class ComponentsModule { }

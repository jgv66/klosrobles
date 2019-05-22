import { Component, OnInit } from '@angular/core';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-periodos',
  templateUrl: './periodos.component.html',
  styleUrls: ['./periodos.component.scss'],
})
export class PeriodosComponent implements OnInit {

  meses = [];

  constructor(  private popoverCtrl: PopoverController,
                private funciones: FuncionesService ) {
      this.meses = this.funciones.losMeses();
   }

  ngOnInit() {}

  onClick( mes ) {
    this.popoverCtrl.dismiss({ mes });
  }
}

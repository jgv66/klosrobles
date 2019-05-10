import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
      for (let index = 0; index < 12; index++) {
        this.meses.push( this.funciones.nombreMes( index + 1 ) );
      }
   }

  ngOnInit() {}

  onClick( mes ) {
    this.popoverCtrl.dismiss({ mes });
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-indicador',
  templateUrl: './indicador.page.html',
  styleUrls: ['./indicador.page.scss'],
})
export class IndicadorPage implements OnInit {

  ind       = '';
  nombre    = undefined;
  hoy       = new Date();
  mes       = this.hoy.getMonth() + 1;
  periodo   = this.hoy.getFullYear();
  series    = [];

  constructor(  private params: ActivatedRoute,
                private funciones: FuncionesService,
                private datos: DatosService ) {
    // parametro
    this.ind = this.params.snapshot.paramMap.get('dato');
  }

  ngOnInit() {
    this.datos.showLoading();
    this.datos.valorPeriodo( this.periodo.toString(), this.ind )
      .subscribe( ( data: any ) => {
        this.nombre = data.nombre;
        this.series = data.serie;
        this.datos.loading.dismiss();
    });
  }

}

import { Component, OnInit, ViewChild } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { Router } from '@angular/router';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

@Component({
  selector: 'app-eerr',
  templateUrl: './eerr.page.html',
  styleUrls: ['./eerr.page.scss'],
})
export class EerrPage implements OnInit {
  //
  @ViewChild( IonSegment ) segmento: IonSegment;

  valorSegmento = '';
  ldelMes       = true;
  //
  empresa   = '01';
  hoy       = new Date();
  mes       = this.hoy.getMonth();
  periodo   = this.hoy.getFullYear();
  meses     = [];
  nombreMes = '';
  //
  actualSobreAnterior = this.periodo.toString() + '/' + (this.periodo - 1).toString();
  //
  textoAcumulado = '';
  //
  rows      = [];
  ingoper   = []; acumingoper   = [];
  ingnooper = []; acumingnooper = [];
  ingnetos  = []; acumingnetos  = [];
  gastoper  = []; acumgastoper  = [];
  margbrut  = []; acummargbrut  = [];
  ogastoper = []; acumogastoper = [];
  gastadmin = []; acumgastadmin = [];
  gastventa = []; acumgastventa = [];
  convenios = []; acumconvenios = [];
  margopera = []; acummargopera = [];
  gastnoper = []; acumgastnoper = [];
  difcambio = []; acumdifcambio = [];
  deprecia  = []; acumdeprecia  = [];
  utiantimp = []; acumutiantimp = [];
  impuesto  = []; acumimpuesto  = [];
  utidesimp = []; acumutidesimp = [];

  // barra superior
  informe   = 'eerr';
  hayNotas  = undefined;
  nNotas    = 0;
  inmerse   = false;
  cargando  = false;

  constructor(private datos: DatosService,
              private funciones: FuncionesService,
              private router: Router,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController ) {
    this.nombreMes = this.funciones.nombreMes( this.mes );
  }

  ngOnInit() {
    this.segmento.value = 'Del Mes';
    this.valorSegmento  = 'Del Mes';
    this.cargaMes();
    this.cuantasNotas();
  }

  limpiaConceptos() {
    this.ingoper   = []; this.acumingoper   = [];
    this.ingnooper = []; this.acumingnooper = [];
    this.ingnetos  = []; this.acumingnetos  = [];
    this.gastoper  = []; this.acumgastoper  = [];
    this.margbrut  = []; this.acummargbrut  = [];
    this.ogastoper = []; this.acumogastoper = [];
    this.gastadmin = []; this.acumgastadmin = [];
    this.gastventa = []; this.acumgastventa = [];
    this.convenios = []; this.acumconvenios = [];
    this.margopera = []; this.acummargopera = [];
    this.gastnoper = []; this.acumgastnoper = [];
    this.difcambio = []; this.acumdifcambio = [];
    this.deprecia  = []; this.acumdeprecia  = [];
    this.utiantimp = []; this.acumutiantimp = [];
    this.impuesto  = []; this.acumimpuesto  = [];
    this.utidesimp = []; this.acumutidesimp = [];
  }

  cargaMes() {
    this.cargando = true;
    return this.datos.postDataSP( { sp:      '/ws_eerr',
                                    empresa: this.empresa,
                                    periodo: this.periodo.toString(),
                                    mes:     this.mes.toString() } )
      .subscribe( ( data: any ) => {
          // console.log(data);
          // const rs = data.datos;
          // this.cuentas = data.datos;
          this.cargaAcumulado();
          data.datos.forEach(element => {
            if ( [1, 2, 2.5 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 2.5 ) ? true : false ;
              this.ingoper.push( element );
            }
            if ( [3, 4 ].includes( element.orden ) ) {
              this.ingnooper.push( element );
            }
            if ( [4.2, 4.4 ].includes( element.orden ) ) {
              element.concolor = true;
              this.ingnetos.push( element );
            }
            if ( [5, 6, 7, 8, 9, 10, 10.1, 10.2, 11, 11.5 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 11.5 ) ? true : false ;
              this.gastoper.push( element );
            }
            if ( [12.1, 13.1 ].includes( element.orden ) ) {
              element.concolor = true;
              this.margbrut.push( element );
            }
            if ( [14, 15, 16, 17, 18, 19, 20, 21.2 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 21.2 ) ? true : false ;
              this.ogastoper.push( element );
            }
            if ( [22 ].includes( element.orden ) ) {
              this.gastadmin.push( element );
            }
            if ( [23, 24, 25, 26, 27, 28, 29, 30, 32, 32, 33, 34, 35, 36, 36.2 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 36.2 ) ? true : false ;
              this.gastventa.push( element );
            }
            if ( [37 ].includes( element.orden ) ) {
              this.convenios.push( element );
            }
            if ( [ 37.3, 37.31, 37.32, 37.34, 37.36, 37.38, 37.40 ].includes( element.orden ) ) {
              this.margopera.push( element );
            }
            if ( [38, 39, 40, 41, 42 ].includes( element.orden ) ) {
              this.gastnoper.push( element );
            }
            if ( [43 ].includes( element.orden ) ) {
              this.difcambio.push( element );
            }
            if ( [44.1 ].includes( element.orden ) ) {
              this.deprecia.push( element );
            }
            if ( [45.1, 46.1 ].includes( element.orden ) ) {
              element.concolor = true;
              this.utiantimp.push( element );
            }
            if ( [47 ].includes( element.orden ) ) {
              this.impuesto.push( element );
            }
            if ( [48.1, 48.2 ].includes( element.orden ) ) {
              element.concolor = true;
              this.utidesimp.push( element );
            }
          });
      });
  }

  cargaAcumulado() {
    return this.datos.postDataSP( { sp:      '/ws_eerr_acum',
                                    empresa: this.empresa,
                                    periodo: this.periodo.toString(),
                                    mes:     this.mes.toString() } )
      .subscribe( ( data: any ) => {
          // console.log(data);
          // const rs = data.datos;
          // this.acumulado = rs;
          data.datos.forEach(element => {
            if ( [1, 2, 2.5 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 2.5 ) ? true : false ;
              this.acumingoper.push( element );
            }
            if ( [3, 4 ].includes( element.orden ) ) {
              this.acumingnooper.push( element );
            }
            if ( [4.2, 4.4 ].includes( element.orden ) ) {
              element.concolor = true;
              this.acumingnetos.push( element );
            }
            if ( [5, 6, 7, 8, 9, 10, 10.2, 11, 11.5 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 11.5 ) ? true : false ;
              this.acumgastoper.push( element );
            }
            if ( [12.1, 13.1 ].includes( element.orden ) ) {
              element.concolor = true;
              this.acummargbrut.push( element );
            }
            if ( [14, 15, 16, 17, 18, 19, 20, 21.2 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 21.2 ) ? true : false ;
              this.acumogastoper.push( element );
            }
            if ( [22 ].includes( element.orden ) ) {
              this.acumgastadmin.push( element );
            }
            if ( [23, 24, 25, 26, 27, 28, 29, 30, 32, 32, 33, 34, 35, 36, 36.2 ].includes( element.orden ) ) {
              element.concolor = ( element.orden === 36.2 ) ? true : false ;
              this.acumgastventa.push( element );
            }
            if ( [37 ].includes( element.orden ) ) {
              this.acumconvenios.push( element );
            }
            if ( [ 37.3, 37.31, 37.32, 37.34, 37.36, 37.38, 37.40 ].includes( element.orden ) ) {
              this.acummargopera.push( element );
            }
            if ( [38, 39, 40, 41, 42 ].includes( element.orden ) ) {
              this.acumgastnoper.push( element );
            }
            if ( [43 ].includes( element.orden ) ) {
              this.acumdifcambio.push( element );
            }
            if ( [44.1 ].includes( element.orden ) ) {
              this.acumdeprecia.push( element );
            }
            if ( [45.1, 46.1 ].includes( element.orden ) ) {
              element.concolor = true;
              this.acumutiantimp.push( element );
            }
            if ( [47 ].includes( element.orden ) ) {
              this.acumimpuesto.push( element );
            }
            if ( [48.1, 48.2 ].includes( element.orden ) ) {
              element.concolor = true;
              this.acumutidesimp.push( element );
            }
          });
          this.cargando = false;
      });
  }

  async periodos( event ) {
    const popover = await this.popoverCtrl.create({
        component: PeriodosComponent,
        event,
        mode: 'ios'
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    if ( data !== undefined ) {
      this.limpiaConceptos();
      this.mes = data.mes ;
      this.nombreMes = this.funciones.nombreMes( this.mes );
      //
      this.cargaMes();
      this.cuantasNotas();
      //
    }
  }

  cuantasNotas() {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          periodo: this.periodo.toString(),
                                          mes:     this.mes.toString(),
                                          informe: this.informe } )
      .subscribe( ( data: any ) => {
          const rs = data.datos;
          this.nNotas   = ( rs[0].notas ) ? rs[0].notas : 0 ;
          this.hayNotas = ( rs[0].notas ) ? true : undefined;
      });
  }

  async notas() {
    const modal = await this.modalCtrl.create({
        component: NotasPage,
        componentProps: { periodo: this.periodo,
                          mes:     this.mes,
                          informe: this.informe,
                          empresa: this.empresa },
        mode: 'ios'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.cuantasNotas();
  }

  segmentChanged( event ) {
    this.valorSegmento = event.detail.value;
    this.ldelMes = ( this.valorSegmento === 'Del Mes' ? true : false );
    if ( this.ldelMes === true ) { 
      this.textoAcumulado = '';
    } else {
      this.textoAcumulado = 'Acumulado al mes de';
    }
  }

}

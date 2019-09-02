import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { calcBindingFlags } from '@angular/core/src/view/util';

@Component({
  selector: 'app-mgxsf',
  templateUrl: './mgxsf.page.html',
  styleUrls: ['./mgxsf.page.scss'],
})
export class MgxsfPage implements OnInit {
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
  // barra superior
  informe   = 'mgxsf';
  hayNotas  = undefined;
  nNotas    = 0;
  inmerse   = false;
  cargando  = false;
  marca     = '';
  //
  rows       = [];
  filas      = [];
  totTotal   = [];
  filasSG    = [];
  totSG      = [];
  filasTH    = [];
  totTH      = [];
  filasTOP10 = [];
  totTop10   = [];

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController,
               private popoverCtrl: PopoverController ) {
      this.meses     = this.funciones.losMeses();
      this.nombreMes = this.funciones.nombreMes( this.mes );
  }

  ngOnInit() {
    this.segmento.value = 'AMBAS';
    this.valorSegmento  = 'AMBAS';
    this.cargaMargen();
    this.cuantasNotas();
  }

  cuantasNotas() {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          informe: this.informe,
                                          empresa: this.empresa,
                                          periodo: this.periodo.toString() } )
      .subscribe( ( data: any ) => {
          const rs = data.datos;
          try {
            this.nNotas   = rs[0].notas;
            this.hayNotas = true;
          } catch (error) {
            this.nNotas   = 0 ;
            this.hayNotas = undefined;
          }
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
    // console.log(event.detail.value);
    switch ( this.valorSegmento ) {
      case 'SIEGEN':
        this.marca = '006';
        break;
      case 'THOMAS':
        this.marca = '001';
        break;
      case 'AMBOS':
        this.marca = '';
        break;
      default:
        this.marca = '';
        break;
    }
  }

  cambiaNro( numero ) {
    return ( numero - 100 ).toFixed(2).toString() + '%';
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
      //
      this.mes       = data.mes ;
      this.meses     = this.funciones.losMeses( this.mes );
      this.nombreMes = this.funciones.nombreMes( this.mes );
      this.cargaMargen();
      this.cuantasNotas();
        //
    }
  }

  cargaMargen() {
    this.cargando = true;
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   0 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData();
                                     });
  }

  distribuyeData() {
    //
    let x = [];
    this.filas = [];
    //
    this.rows.forEach( element => {
      // --------------------SUPERFAMILIAS
      x = this.filas.filter( fila => fila.key1 === element.key1 );
      if ( x.length === 0 ) {
        element = Object.assign( element, { clientes: [], show: false, key1: element.key1 });
        this.filas.push( element );
      }
    });
    // console.log( (new Date()).getTime() );
    this.cargando = false;
    //
    this.filas.sort( (a, b) => {
      if (a.contribucion < b.contribucion) {
        return 1;
      }
      if (a.contribucion > b.contribucion) {
        return -1;
      }
      return 0;
    });
    //
    this.filasSG = this.filas.filter( fila => fila.marca === '006' );
    this.filasTH = this.filas.filter( fila => fila.marca === '001' );
    //
    this.cargaTop10();
    this.cargaMargen1();
    // ---- totales
    this.totTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filas.forEach(element => {
      this.totTotal[0].vta_neta     += element.vta_neta;
      this.totTotal[0].costo        += element.costo;
      this.totTotal[0].contribucion += element.contribucion;
    });
    // siegen
    this.totSG = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasSG.forEach(element => {
      this.totSG[0].vta_neta     += element.vta_neta;
      this.totSG[0].costo        += element.costo;
      this.totSG[0].contribucion += element.contribucion;
    });
    // thomas
    this.totTH = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasTH.forEach(element => {
      this.totTH[0].vta_neta     += element.vta_neta;
      this.totTH[0].costo        += element.costo;
      this.totTH[0].contribucion += element.contribucion;
    });
  }

  cargaMargen1() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   1 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData1();
                                     });
  }
  distribuyeData1() {
    //
    let nPos = 0;
    // --------------------SUPERFAMILIAS+CLIENTES
    this.rows.forEach( element => {

      nPos = this.filas.findIndex( fila => fila.key1 === element.key1 );
      // console.log(nPos , element.key1);
      if ( nPos > -1 ) {
        element = Object.assign( element, { productos: [], show: false, key2: element.key2 });
        this.filas[nPos].clientes.push( element );
      }

    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filas.length; index++ ) {
      //
      this.filas[index].clientes.sort( (a, b) => {
        if (a.contribucion < b.contribucion) {
          return 1;
        }
        if (a.contribucion > b.contribucion) {
          return -1;
        }
        return 0;
      });
      //
    }
    this.cargaMargen2();
    //
  }

  cargaMargen2() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   2 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData2();
                                     });
  }
  distribuyeData2() {
    //
    let nPos = 0;
    let nPox = 0;
    // --------------------SUPERFAMILIAS+CLIENTES+PRODUCTOS
    this.rows.forEach( element => {

      nPos = this.filas.findIndex( fila => fila.key1 === element.key1 );
      if ( nPos > -1 ) {
        nPox = this.filas[nPos].clientes.findIndex( fila => fila.key2 === element.key2 );
        if ( nPox > -1 ) {
          element = Object.assign( element, { productos: [], show: false, key2: element.key2 });
          this.filas[nPos].clientes[nPox].productos.push( element );
        }
      }
    });
  }

  cargaTop10() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   10 } )
          .subscribe( (data: any) => { this.filasTOP10 = data.datos;
                                       this.totalestop10(); });
  }
  totalestop10() {
    this.totTop10 = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasTOP10.forEach(element => {
      this.totTop10[0].vta_neta     += element.vta_neta;
      this.totTop10[0].costo        += element.costo;
      this.totTop10[0].contribucion += element.contribucion;
    });
  }

}

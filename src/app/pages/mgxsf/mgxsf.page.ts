import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
import { calcBindingFlags } from '@angular/core/src/view/util';
import { DocumentosPage } from '../documentos/documentos.page';

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
  rowsCli    = [];
  //
  superfam   = [];
  sfTotal    = [];
  filasSG    = [];
  sfsgTotal  = [];
  filasTH    = [];
  sfthTotal  = [];
  //
  clientes   = [];
  cliTotal   = [];
  filasCliSG = [];
  clisgTotal = [];
  filasCliTH = [];
  clithTotal = [];
  //
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
    this.segmento.value = 'FAMILIA';
    this.valorSegmento  = 'FAMILIA';
    this.cargaMargenes();
    this.cuantasNotas();
  }

  OnOff( fila) {
    fila.show = !fila.show;
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
      case 'FAMILIA':
        this.marca = '';
        break;
      case 'CLIENTE':
        this.marca = '';
        break;
      default:
        this.marca = '';
        break;
    }
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
      this.cargaMargenes();
      this.cuantasNotas();
        //
    }
  }

  cargaMargenes() {
    this.cargando = true;
    // familias
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   0 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distDataSF();
                                     });
    // clientes
    this.datos.postDataSPSilent( {sp:      '/ws_mgxcli',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   0 } )
          .subscribe( (data: any) => { this.rowsCli = data.datos;
                                       this.distDataCli();
                                     });

  }

  distDataSF() {
    //
    let x = [];
    let nPos = 0;
    this.superfam = [];
    this.sfTotal  = [{vta_neta: 0, costo: 0, contribucion: 0}];
    // console.log(this.rows);
    this.rows.forEach( sfam => {
      // --------------------SUPERFAMILIAS
      if ( sfam.key1 && !sfam.key2 ) {
        sfam = Object.assign( sfam, { familias: [], show: false, key1: sfam.key1 });
        this.superfam.push( sfam );
        // totales
        this.sfTotal[0].vta_neta     += sfam.vta_neta;
        this.sfTotal[0].costo        += sfam.costo;
        this.sfTotal[0].contribucion += sfam.contribucion;
        //
      }
    });
    // ordenar por contribucion
    this.superfam.sort( (a, b) => {
      if (a.contribucion < b.contribucion) {
        return 1;
      }
      if (a.contribucion > b.contribucion) {
        return -1;
      }
      return 0;
    });
    // --------------------SUPERFAMILIAS+FAMILIAS
    nPos = -1;
    this.superfam.forEach( sfam => {
      ++nPos;
      x = this.rows.filter( row => row.key1 === sfam.key1  );
      // console.log(x);
      x.forEach( row => {
        if ( row.familia !== null && row.nombre_familia !== null ) {
          row = Object.assign( row, { productos: [], show: false, key2: row.key2 });
          this.superfam[nPos].familias.push( row );
        }
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.superfam.length; index++ ) {
      //
      this.superfam[index].familias.sort( (a, b) => {
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
    //
    this.cargando = false;
    //
    this.sfsgTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasSG   = this.superfam.filter( sfam => sfam.marca === '006' );
    this.filasSG.forEach( sfsg => {
      this.sfsgTotal[0].vta_neta     += sfsg.vta_neta;
      this.sfsgTotal[0].costo        += sfsg.costo;
      this.sfsgTotal[0].contribucion += sfsg.contribucion;
    });
    //
    this.sfthTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasTH = this.superfam.filter( sfam => sfam.marca === '001' );
    this.filasTH.forEach( sfth => {
      this.sfthTotal[0].vta_neta     += sfth.vta_neta;
      this.sfthTotal[0].costo        += sfth.costo;
      this.sfthTotal[0].contribucion += sfth.contribucion;
    });
    //
    this.cargaProductosSF();
  }
  cargaProductosSF() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   1 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distDataProd();
                                     });
  }
  distDataProd() {
    let x = [];
    let y = [];
    let nPos = -1;
    let xPos = -1;
    //
    this.superfam.forEach( sfam => {
      ++nPos;
      x = this.rows.filter( row => row.key1 === sfam.key1  );
      x.forEach( row => {
        if ( row.familia !== null && row.nombre_familia !== null ) {
          xPos = this.superfam[nPos].familias.findIndex( fam => fam.key1 === row.key1 && fam.key2 === row.key2 );
          this.superfam[nPos].familias[xPos].productos.push( row );
        }
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.superfam.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let indexF = 0; indexF < this.superfam[index].familias.length; indexF++ ) {
        //
        this.superfam[index].familias[indexF].productos.sort( (a, b) => {
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
      //
    }
    //
  }

  async inmersion( dato, caso) {
    console.log( dato );
    const modal = await this.modalCtrl.create({
      component: DocumentosPage,
      componentProps: { dato, caso, mes: this.mes },
      mode: 'ios'
    });
    await modal.present();
  }

  distDataCli() {
    //
    let x = [];
    let nPos = 0;
    let nPox = 0;
    this.clientes = [];
    this.cliTotal  = [{vta_neta: 0, costo: 0, contribucion: 0}];
    //
    this.rowsCli.forEach( cli => {
      // --------------------clientes
      nPos = this.clientes.findIndex( cliente => cliente.cliente === cli.cliente );
      if ( nPos < 0 ) {
        cli = Object.assign( cli, { marcas: [], show: false, key1: cli.key1 });
        this.clientes.push( cli );
      } else {
        this.clientes[nPos].vta_neta     += cli.vta_neta;
        this.clientes[nPos].costo        += cli.costo;
        this.clientes[nPos].contribucion += cli.contribucion;
      }
      // totales
      this.cliTotal[0].vta_neta     += cli.vta_neta;
      this.cliTotal[0].costo        += cli.costo;
      this.cliTotal[0].contribucion += cli.contribucion;
      //
    });
    // ordenar por contribucion
    this.clientes.sort( (a, b) => {
      if (a.contribucion < b.contribucion) {
        return 1;
      }
      if (a.contribucion > b.contribucion) {
        return -1;
      }
      return 0;
    });
    // clientes + marcas
    // nPos = -1;
    // this.clientes.forEach( cli => {
    //   ++nPos;
    //   this.rowsCli.forEach( row => {
    //     // --------------------clientes
    //     nPox = this.clientes[nPos].marcas.findIndex( mar => row.cliente === mar.cliente && row.marca === mar.marca );
    //     if ( nPox < 0 ) {
    //       row = Object.assign( row, { superfamilias: [], show: false, key2: cli.key2 });
    //       this.clientes[nPos].marcas.push( row );
    //     } else {
    //       this.clientes[nPos].marcas[nPox].vta_neta     += row.vta_neta;
    //       this.clientes[nPos].marcas[nPox].costo        += row.costo;
    //       this.clientes[nPos].marcas[nPox].contribucion += row.contribucion;
    //     }
    //     //
    //   });
    // });
    // tslint:disable-next-line: prefer-for-of
    // for ( let index = 0; index < this.clientes.length; index++ ) {
    //   //
    //   this.clientes[index].marcas.sort( (a, b) => {
    //     if (a.contribucion < b.contribucion) {
    //       return 1;
    //     }
    //     if (a.contribucion > b.contribucion) {
    //       return -1;
    //     }
    //     return 0;
    //   });
    // }
    // // --------------------SUPERFAMILIAS+FAMILIAS
    // nPos = -1;
    // this.superfam.forEach( sfam => {
    //   ++nPos;
    //   x = this.rows.filter( row => row.key1 === sfam.key1  );
    //   // console.log(x);
    //   x.forEach( row => {
    //     if ( row.familia !== null && row.nombre_familia !== null ) {
    //       row = Object.assign( row, { productos: [], show: false, key2: row.key2 });
    //       this.superfam[nPos].familias.push( row );
    //     }
    //   });
    // });
    // // tslint:disable-next-line: prefer-for-of
    // for ( let index = 0; index < this.superfam.length; index++ ) {
    //   //
    //   this.superfam[index].familias.sort( (a, b) => {
    //     if (a.contribucion < b.contribucion) {
    //       return 1;
    //     }
    //     if (a.contribucion > b.contribucion) {
    //       return -1;
    //     }
    //     return 0;
    //   });
    //
    // }
    //
    this.cargando = false;
    //
    this.clisgTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasCliSG   = this.clientes.filter( sfam => sfam.marca === '006' );
    this.filasCliSG.forEach( clisg => {
      this.clisgTotal[0].vta_neta     += clisg.vta_neta;
      this.clisgTotal[0].costo        += clisg.costo;
      this.clisgTotal[0].contribucion += clisg.contribucion;
    });
    //
    this.clithTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasCliTH = this.clientes.filter( sfam => sfam.marca === '001' );
    this.filasCliTH.forEach( clith => {
      this.clithTotal[0].vta_neta     += clith.vta_neta;
      this.clithTotal[0].costo        += clith.costo;
      this.clithTotal[0].contribucion += clith.contribucion;
    });
    //
    // this.cargaProductosCLI();
  }
  cargaProductosCLI() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxsf',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   1 } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distDataCliProd();
                                     });
  }
  distDataCliProd() {
    let x = [];
    let y = [];
    let nPos = -1;
    let xPos = -1;
    //
    this.superfam.forEach( sfam => {
      ++nPos;
      x = this.rows.filter( row => row.key1 === sfam.key1  );
      x.forEach( row => {
        if ( row.familia !== null && row.nombre_familia !== null ) {
          xPos = this.superfam[nPos].familias.findIndex( fam => fam.key1 === row.key1 && fam.key2 === row.key2 );
          this.superfam[nPos].familias[xPos].productos.push( row );
        }
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.superfam.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let indexF = 0; indexF < this.superfam[index].familias.length; indexF++ ) {
        //
        this.superfam[index].familias[indexF].productos.sort( (a, b) => {
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
      //
    }
    //
  }

}

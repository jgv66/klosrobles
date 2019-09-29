import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';
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
  rows        = [];
  rowsCli     = [];
  rowsCliProd = [];
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
  filasTOP20   = [];
  Top20Total   = [];
  TopOATotal   = [];
  filasTTH20   = [];
  TopTHTotal   = [];
  TopTHOATotal = [];
  filasTSG20   = [];
  TopSGTotal   = [];
  TopSGOATotal = [];

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
                                  nivel:   0 
                                 })
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distDataSF();
                                     });
    // clientes
    this.datos.postDataSPSilent( {sp:      '/ws_mgxcli',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   0 
                                 })
          .subscribe( (data: any) => { this.rowsCli = data.datos;
                                       this.distDataCli();
                                     });
    // top-20
    this.datos.postDataSPSilent( {sp:       '/ws_mgxcli',
                                  periodo:  this.periodo.toString(),
                                  empresa:  this.empresa,
                                  mes:      this.mes.toString(),
                                  nivel:    2,
                                  subnivel: ''
                                 })
          .subscribe( (data: any) => this.distDataTop20( data.datos ) );
    // top-20-Thomas
    this.datos.postDataSPSilent( {sp:       '/ws_mgxcli',
                                  periodo:  this.periodo.toString(),
                                  empresa:  this.empresa,
                                  mes:      this.mes.toString(),
                                  nivel:    2,
                                  subnivel: '001'
                                 })
          .subscribe( (data: any) => this.distDataTopTH( data.datos ) );
    // top-20-Siegen
    this.datos.postDataSPSilent( {sp:       '/ws_mgxcli',
                                  periodo:  this.periodo.toString(),
                                  empresa:  this.empresa,
                                  mes:      this.mes.toString(),
                                  nivel:    2,
                                  subnivel: '006'
                                 })
          .subscribe( (data: any) => this.distDataTopSG( data.datos ) );
  }
  // --------------------------------------------------------------------------------- FAMILIAS
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
      x = this.rows.filter( row => row.key1 === sfam.key1 );
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
  // --------------------------------------------------------------------------------- CLIENTES
  distDataCli() {
    //
    let x = [];
    let nPos = 0; let nPox = 0; let nPom = 0; let nPosf = 0;
    this.clientes = [];
    this.cliTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    //
    this.rowsCli.forEach( row => {
      // --------------------clientes
      nPos = this.clientes.findIndex( cli => cli.cliente === row.cliente );
      if ( nPos < 0 ) {
        this.clientes.push( { cliente: row.cliente, sigla: row.sigla,
                              vta_neta: 0, costo: 0, contribucion: 0,
                              marcas: [], show: false } );
      }
      nPos = this.clientes.findIndex( cli => cli.cliente === row.cliente );
      this.clientes[nPos].vta_neta     += row.vta_neta;
      this.clientes[nPos].costo        += row.costo;
      this.clientes[nPos].contribucion += row.contribucion;
      // totales
      this.cliTotal[0].vta_neta     += row.vta_neta;
      this.cliTotal[0].costo        += row.costo;
      this.cliTotal[0].contribucion += row.contribucion;
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
    // console.log(this.clientes);
    // ------------------------- clientes + marcas
    nPos = -1;
    this.clientes.forEach( cli => {
      ++nPos;
      x = this.rowsCli.filter( row => row.cliente === cli.cliente && row.marca !== '' );
      x.forEach( row => {
        // --------------------clientes
        nPox = this.clientes[nPos].marcas.findIndex( mar => row.marca === mar.marca );
        if ( nPox < 0 ) {
          this.clientes[nPos].marcas.push( { marca: row.marca, nombre_marca: row.nombre_marca,
                                             vta_neta: 0, costo: 0, contribucion: 0,
                                             superfamilias: [], show: false } );
        }
        nPox = this.clientes[nPos].marcas.findIndex( mar => row.marca === mar.marca );
        this.clientes[nPos].marcas[nPox].vta_neta     += row.vta_neta;
        this.clientes[nPos].marcas[nPox].costo        += row.costo;
        this.clientes[nPos].marcas[nPox].contribucion += row.contribucion;
        //
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.clientes.length; index++ ) {
      //
      this.clientes[index].marcas.sort( (a, b) => {
        if (a.contribucion < b.contribucion) {
          return 1;
        }
        if (a.contribucion > b.contribucion) {
          return -1;
        }
        return 0;
      });
    }
    // ------------------------- clientes + marcas + superfamilias
    nPos = -1;
    this.clientes.forEach( cli => {
      ++nPos; nPom = -1;
      this.clientes[nPos].marcas.forEach( climar => {
        ++nPom;
        x = this.rowsCli.filter( (row) => row.cliente === cli.cliente && row.marca === climar.marca );
        x.forEach( row => {
          nPox = this.clientes[nPos].marcas[nPom].superfamilias.findIndex( sfam => row.super_familia === sfam.super_familia );
          if ( nPox < 0 ) {
            this.clientes[nPos].marcas[nPom].superfamilias.push( { super_familia: row.super_familia, nombre_superfam: row.nombre_superfam,
                                                                   vta_neta: 0, costo: 0, contribucion: 0,
                                                                   familias: [], show: false } );
          }
          nPox = this.clientes[nPos].marcas[nPom].superfamilias.findIndex( sfam => row.super_familia === sfam.super_familia );
          this.clientes[nPos].marcas[nPom].superfamilias[nPox].vta_neta     += row.vta_neta;
          this.clientes[nPos].marcas[nPom].superfamilias[nPox].costo        += row.costo;
          this.clientes[nPos].marcas[nPom].superfamilias[nPox].contribucion += row.contribucion;
          //
        });
        //
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.clientes.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.clientes[index].marcas.length; index2++ ) {
        //
        this.clientes[index].marcas[index2].superfamilias.sort( (a, b) => {
          if (a.contribucion < b.contribucion) {
            return 1;
          }
          if (a.contribucion > b.contribucion) {
            return -1;
          }
          return 0;
        });
      }
    }
    // ------------------------- clientes + marcas + superfamilias + familias
    nPos = -1;
    this.clientes.forEach( cli => {
      ++nPos; nPom = -1;
      this.clientes[nPos].marcas.forEach( climar => {
        ++nPom; nPosf = -1;
        this.clientes[nPos].marcas[nPom].superfamilias.forEach( climarsfam => {
          ++nPosf;
          x = this.rowsCli.filter( (row) => row.cliente === cli.cliente && row.marca === climar.marca && row.super_familia === climarsfam.super_familia );
          x.forEach( row => {
            nPox = this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias.findIndex( fam => row.familia === fam.familia );
            if ( nPox < 0 ) {
              this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias.push( { familia: row.familia, nombre_familia: row.nombre_familia,
                                                                                     vta_neta: 0, costo: 0, contribucion: 0,
                                                                                     productos: [], show: false } );
            }
            nPox = this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias.findIndex( fam => row.familia === fam.familia );
            this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPox].vta_neta     += row.vta_neta;
            this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPox].costo        += row.costo;
            this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPox].contribucion += row.contribucion;
            //
          });
        });
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.clientes.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.clientes[index].marcas.length; index2++ ) {
        // tslint:disable-next-line: prefer-for-of
        for ( let index3 = 0; index3 < this.clientes[index].marcas[index2].superfamilias.length; index3++ ) {
          //
          this.clientes[index].marcas[index2].superfamilias[index3].familias.sort( (a, b) => {
            if (a.contribucion < b.contribucion) {
              return 1;
            }
            if (a.contribucion > b.contribucion) {
              return -1;
            }
            return 0;
          });
        }
      }
    }
    //
    this.cargando = false;
    //
    this.filasCliTH = []; this.filasCliSG = [];
    this.clisgTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.clientes.forEach( cli => {
      cli.marcas.forEach( mar => {
        if ( mar.marca === '006' ) {
          this.filasCliSG.push( { cliente: cli.cliente, sigla: cli.sigla,
                                  vta_neta: mar.vta_neta, costo: mar.costo, contribucion: mar.contribucion,
                                  superfamilias: mar.superfamilias, show: false } );
        } else {
          this.filasCliTH.push( { cliente: cli.cliente, sigla: cli.cliente,
                                  vta_neta: mar.vta_neta, costo: mar.costo, contribucion: mar.contribucion,
                                  superfamilias: mar.superfamilias, show: false } );
        }
      });
    });
    this.filasCliSG.forEach( clisg => {
      this.clisgTotal[0].vta_neta     += clisg.vta_neta;
      this.clisgTotal[0].costo        += clisg.costo;
      this.clisgTotal[0].contribucion += clisg.contribucion;
    });
    // SG - ordenar por contribucion
    this.filasCliSG.sort( (a, b) => {
      if (a.contribucion < b.contribucion) {
        return 1;
      }
      if (a.contribucion > b.contribucion) {
        return -1;
      }
      return 0;
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliSG.length; index++ ) {
      //
      this.filasCliSG[index].superfamilias.sort( (a, b) => {
        if (a.contribucion < b.contribucion) {
          return 1;
        }
        if (a.contribucion > b.contribucion) {
          return -1;
        }
        return 0;
      });
    }
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliSG.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.filasCliSG[index].superfamilias.length; index2++ ) {
        //
        this.filasCliSG[index].superfamilias[index2].familias.sort( (a, b) => {
          if (a.contribucion < b.contribucion) {
            return 1;
          }
          if (a.contribucion > b.contribucion) {
            return -1;
          }
          return 0;
        });
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliSG.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.filasCliSG[index].superfamilias.length; index2++ ) {
        //
        this.filasCliSG[index].superfamilias[index2].familias.sort( (a, b) => {
          if (a.contribucion < b.contribucion) {
            return 1;
          }
          if (a.contribucion > b.contribucion) {
            return -1;
          }
          return 0;
        });
      }
    }
    //
    this.clithTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    this.filasCliTH.forEach( clith => {
      this.clithTotal[0].vta_neta     += clith.vta_neta;
      this.clithTotal[0].costo        += clith.costo;
      this.clithTotal[0].contribucion += clith.contribucion;
    });
    // SG - ordenar por contribucion
    this.filasCliTH.sort( (a, b) => {
      if (a.contribucion < b.contribucion) {
        return 1;
      }
      if (a.contribucion > b.contribucion) {
        return -1;
      }
      return 0;
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliTH.length; index++ ) {
      //
      this.filasCliTH[index].superfamilias.sort( (a, b) => {
        if (a.contribucion < b.contribucion) {
          return 1;
        }
        if (a.contribucion > b.contribucion) {
          return -1;
        }
        return 0;
      });
    }
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliTH.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.filasCliTH[index].superfamilias.length; index2++ ) {
        //
        this.filasCliTH[index].superfamilias[index2].familias.sort( (a, b) => {
          if (a.contribucion < b.contribucion) {
            return 1;
          }
          if (a.contribucion > b.contribucion) {
            return -1;
          }
          return 0;
        });
      }
    }
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.filasCliTH.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.filasCliTH[index].superfamilias.length; index2++ ) {
        //
        this.filasCliTH[index].superfamilias[index2].familias.sort( (a, b) => {
          if (a.contribucion < b.contribucion) {
            return 1;
          }
          if (a.contribucion > b.contribucion) {
            return -1;
          }
          return 0;
        });
      }
    }
    //
    this.cargaProductosCLI();
  }
  cargaProductosCLI() {
    this.datos.postDataSPSilent( {sp:      '/ws_mgxcli',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  mes:     this.mes.toString(),
                                  nivel:   1 } )
          .subscribe( (data: any) => { this.rowsCliProd = data.datos;
                                       this.distDataCliProd();
                                     });
  }
  distDataCliProd() {
    let x = [];
    let nPos = 0; let nPox = 0; let nPom = 0; let nPosf = 0; let nPofa = 0;
    // ------------------------- clientes + marcas + superfamilias + familias + productos
    nPos = -1;
    this.clientes.forEach( cli => {
      ++nPos; nPom = -1;
      this.clientes[nPos].marcas.forEach( climar => {
        ++nPom; nPosf = -1;
        this.clientes[nPos].marcas[nPom].superfamilias.forEach( climarsfam => {
          ++nPosf; nPofa = -1;
          this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias.forEach( climarsfamfam => {
            ++nPofa;
            x = this.rowsCliProd.filter( (row) => row.cliente === cli.cliente
                                               && row.marca === climar.marca
                                               && row.super_familia === climarsfam.super_familia
                                               && row.familia === climarsfamfam.familia );
            x.forEach( row => {
              nPox = this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos.findIndex( pro => row.producto === pro.producto );
              if ( nPox < 0 ) {
                this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos.push( { producto: row.producto, descripcion: row.descripcion,
                                                                                                        vta_neta: 0, costo: 0, contribucion: 0 } );
              }
              nPox = this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos.findIndex( pro => row.producto === pro.producto );
              this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos[nPox].vta_neta     += row.vta_neta;
              this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos[nPox].costo        += row.costo;
              this.clientes[nPos].marcas[nPom].superfamilias[nPosf].familias[nPofa].productos[nPox].contribucion += row.contribucion;
              //
            });
          });
        });
      });
    });
    // tslint:disable-next-line: prefer-for-of
    for ( let index = 0; index < this.clientes.length; index++ ) {
      // tslint:disable-next-line: prefer-for-of
      for ( let index2 = 0; index2 < this.clientes[index].marcas.length; index2++ ) {
        // tslint:disable-next-line: prefer-for-of
        for ( let index3 = 0; index3 < this.clientes[index].marcas[index2].superfamilias.length; index3++ ) {
          // tslint:disable-next-line: prefer-for-of
          for ( let index4 = 0; index4 < this.clientes[index].marcas[index2].superfamilias[index3].familias.length; index4++ ) {
            this.clientes[index].marcas[index2].superfamilias[index3].familias[index4].productos.sort( (a, b) => {
              if (a.contribucion < b.contribucion) {
                return 1;
              }
              if (a.contribucion > b.contribucion) {
                return -1;
              }
              return 0;
            });
          }
        }
      }
    }

  }
  // ---------------------------------------------------------------------------------- suma de totales por TOP-20
  distDataTop20( data ) {
    this.filasTOP20 = data;
    this.Top20Total = [{vta_neta: 0, costo: 0, contribucion: 0}];
    data.forEach( clisg => {
      this.Top20Total[0].vta_neta     += clisg.vta_neta;
      this.Top20Total[0].costo        += clisg.costo;
      this.Top20Total[0].contribucion += clisg.contribucion;
    });
  }
  distDataTopTH( data ) {
    this.filasTTH20 = data;
    this.TopTHTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    data.forEach( clisg => {
      this.TopTHTotal[0].vta_neta     += clisg.vta_neta;
      this.TopTHTotal[0].costo        += clisg.costo;
      this.TopTHTotal[0].contribucion += clisg.contribucion;
    });
  }
  distDataTopSG( data ) {
    this.filasTSG20 = data;
    this.TopSGTotal = [{vta_neta: 0, costo: 0, contribucion: 0}];
    data.forEach( clisg => {
      this.TopSGTotal[0].vta_neta     += clisg.vta_neta;
      this.TopSGTotal[0].costo        += clisg.costo;
      this.TopSGTotal[0].contribucion += clisg.contribucion;
    });
  }

  // ---------------------------------------------------------------------------------- inmersion
  async inmersion( dato, caso ) {
    const modal = await this.modalCtrl.create({
      component: DocumentosPage,
      componentProps: { dato, caso, mes: this.mes },
      mode: 'ios'
    });
    await modal.present();
  }

}

import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController } from '@ionic/angular';
import { VistasPage } from '../../components/vistas/vistas.page';
import { PeriodosComponent } from 'src/app/components/periodos/periodos.component';

declare var google ;

@Component({
  selector: 'app-reppylmes',
  templateUrl: './reppylmes.page.html',
  styleUrls: ['./reppylmes.page.scss'],
})
export class ReppylmesPage implements OnInit {
  //
  informe   = 'p&l_mes';
  //
  empresa   = '01';
  hoy       = new Date();
  mes       = this.hoy.getMonth() + 1;
  periodo   = this.hoy.getFullYear();
  meses     = [];
  nombreMes = '';
  //
  rows        = [];
  filas       = [];
  totales     = [];
  clientesgt  = [];
  cliente     = '';
  // barra superior
  hayNotas  = undefined;
  nNotas    = 0;
  vista = 'M';  // millon
  cargando = false;
  inmerse  = false;

  constructor(private datos: DatosService,
              private funciones: FuncionesService,
              private popoverCtrl: PopoverController ) {
    this.meses = this.funciones.losMeses( this.mes );
  }

  ngOnInit() {
    this.cargaEmpresas();
  }

  cargaEmpresas() {
    return this.datos.postDataSP( { sp: '/ws_pyl_clientesgt' } )
      .subscribe( ( data: any ) => {
          this.clientesgt = data.datos;
          this.cliente = data.datos[0].cliente ;
          this.cargaClienteMensual();
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
      //
      this.mes    = data.mes ;
      this.meses  = this.funciones.losMeses( this.mes );
      this.cargaClienteMensual();
      //
    }
  }

  async clientesGT( event ) {
    const popover = await this.popoverCtrl.create({
        component: VistasPage,
        componentProps: { clientesgt: this.clientesgt },
        event,
        mode: 'ios'
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    if ( data !== undefined ) {
      this.cliente = data.vista ;
      this.cargaClienteMensual();
    }
  }

  cargaClienteMensual() {
    this.cargando = true;
    this.datos.postDataSP( {  sp:       '/ws_pylmensual',
                              periodo:  this.periodo.toString(),
                              mes:      this.mes.toString(),
                              cliente:  this.cliente } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData();
                                     });
  }

  distribuyeData() {
    //
    let pos = 0;
    let x = [];
    let marca;
    this.filas   = [];
    this.totales = [];
    // solo estos conceptos serán desplegados en los graficos
    const data = [ 'Mes', 'G.OP', 'GNOP', 'MARG', 'NCV', 'REB', 'VTA' ];
    const eje = [];
    eje.push( data );
    for (let index = 0; index < this.mes; index++) {
      eje.push( [ this.funciones.nombreMes( index + 1 ).slice( 0, 5 ), 0, 0, 0, 0, 0, 0 ] );
    }
    // existen datos? falta preguntar
    this.rows.forEach( element => {
      x = this.filas.filter( fila => fila.concepto === element.concepto );
      // si no existe.. se agrega
      if ( x.length === 0 ) {
        this.filas.push( { concepto: element.concepto,
                           mini: element.mini,
                           show: false,
                           ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                           total: 0,
                           marcas: [ {  marca: '001',
                                        nombre_marca: 'THOMAS',
                                        ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                                        tot: 0 },
                                     {  marca: '006',
                                        nombre_marca: 'SIEGEN',
                                        ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                                        tot: 0 } ]
                        });
      }
    });
    // tslint:disable-next-line: prefer-for-of
    for (let indexf = 0; indexf < this.filas.length; indexf++) {
      // tslint:disable-next-line: prefer-for-of
      for (let indexr = 0; indexr < this.rows.length; indexr++) {
        if ( this.filas[indexf].mini === this.rows[indexr].mini ) {
          // console.log(this.filas[indexf].mini, this.rows[indexr], this.filas[indexf].concepto === this.rows[indexr].concepto );
          for ( let mm = 0; mm < 2; mm++ ) {
            if ( this.filas[indexf].marcas[mm].marca === this.rows[indexr].marca.trim() ) {
              this.filas[indexf].marcas[mm].tot += this.rows[indexr].monto ;
              this.filas[indexf].marcas[mm].ene += ( this.rows[indexr].mes === 1  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].feb += ( this.rows[indexr].mes === 2  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].mar += ( this.rows[indexr].mes === 3  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].abr += ( this.rows[indexr].mes === 4  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].may += ( this.rows[indexr].mes === 5  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].jun += ( this.rows[indexr].mes === 6  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].jul += ( this.rows[indexr].mes === 7  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].ago += ( this.rows[indexr].mes === 8  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].sep += ( this.rows[indexr].mes === 9  ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].oct += ( this.rows[indexr].mes === 10 ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].nov += ( this.rows[indexr].mes === 11 ) ? this.rows[indexr].monto : 0 ;
              this.filas[indexf].marcas[mm].dic += ( this.rows[indexr].mes === 12 ) ? this.rows[indexr].monto : 0 ;
            }
          }
        }
      }
    }

    //
    this.totales.push( {  concepto: 'Totales',
                          show: false,
                          ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                          tot: 0,
                          marcas: [ {  marca: '001',
                                       nombre_marca: 'THOMAS',
                                       ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                                       tot: 0 },
                                    {  marca: '006',
                                       nombre_marca: 'SIEGEN',
                                       ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                                       tot: 0 } ] } );
    //
    // sumar filas del mismo concepto
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.filas.length; index++) {
      // filtrar el concepto
      x = this.rows.filter( row => row.concepto === this.filas[index].concepto );
      // recorrer las filas del mismo concepto
      x.forEach( element => {
        //
        pos = data.indexOf( element.mini );
        // total de la fila
        this.filas[index].total += element.monto;
        //
        if ( element.mes === 1  && this.mes >= element.mes ) {
          this.filas[index].ene += element.monto;
          this.totales[0].ene   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].ene += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 2  && this.mes >= element.mes ) {
          this.filas[index].feb += element.monto;
          this.totales[0].feb   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].feb += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 3  && this.mes >= element.mes ) {
          this.filas[index].mar += element.monto;
          this.totales[0].mar   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].mar += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 4  && this.mes >= element.mes ) {
          this.filas[index].abr += element.monto;
          this.totales[0].abr   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].abr += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 5  && this.mes >= element.mes ) {
          this.filas[index].may += element.monto;
          this.totales[0].may   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].may += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 6  && this.mes >= element.mes ) {
          this.filas[index].jun += element.monto;
          this.totales[0].jun   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].jun += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 7  && this.mes >= element.mes ) {
          this.filas[index].jul += element.monto;
          this.totales[0].jul   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].jul += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 8  && this.mes >= element.mes ) {
          this.filas[index].ago += element.monto;
          this.totales[0].ago   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].ago += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 9  && this.mes >= element.mes ) {
          this.filas[index].sep += element.monto;
          this.totales[0].sep   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].sep += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 10 && this.mes >= element.mes ) {
          this.filas[index].oct += element.monto;
          this.totales[0].oct   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].oct += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 11 && this.mes >= element.mes ) {
          this.filas[index].nov += element.monto;
          this.totales[0].nov   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].nov += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 12 && this.mes >= element.mes ) {
          this.filas[index].dic += element.monto;
          this.totales[0].dic   += element.monto;
          this.totales[0].marcas[ (element.marca.trim() === '001') ? 0 : 1 ].dic += element.monto;
          if ( pos > 0 ) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
      });
    }
    // sumo el total de totales
    this.totales[0].tot = this.totales[0].ene + this.totales[0].feb + this.totales[0].mar + this.totales[0].abr +
                          this.totales[0].may + this.totales[0].jun + this.totales[0].jul + this.totales[0].ago +
                          this.totales[0].sep + this.totales[0].oct + this.totales[0].nov + this.totales[0].dic;
    this.totales[0].marcas[0].tot = this.totales[0].marcas[0].ene + this.totales[0].marcas[0].feb + this.totales[0].marcas[0].mar +
                                    this.totales[0].marcas[0].abr + this.totales[0].marcas[0].may + this.totales[0].marcas[0].jun +
                                    this.totales[0].marcas[0].jul + this.totales[0].marcas[0].ago + this.totales[0].marcas[0].sep +
                                    this.totales[0].marcas[0].oct + this.totales[0].marcas[0].nov + this.totales[0].marcas[0].dic;
    this.totales[0].marcas[1].tot = this.totales[0].marcas[1].ene + this.totales[0].marcas[1].feb + this.totales[0].marcas[1].mar +
                                    this.totales[0].marcas[1].abr + this.totales[0].marcas[1].may + this.totales[0].marcas[1].jun +
                                    this.totales[0].marcas[1].jul + this.totales[0].marcas[1].ago + this.totales[0].marcas[1].sep +
                                    this.totales[0].marcas[1].oct + this.totales[0].marcas[1].nov + this.totales[0].marcas[1].dic;
    // console.log(eje);
    // crear el grafico de lineas curvas
    // const dataline = google.visualization.arrayToDataTable(eje);
    // // Instantiate and draw our chart, passing in some options.
    // const idelemento  = document.getElementById('line_curve_chart');
    // const linechart   = new google.visualization.ColumnChart( idelemento );
    // linechart.draw(dataline, {  curveType: 'function',
    //                             legend: { position: 'bottom' },
    //                             width: '100%',
    //                             height: '100%',
    //                             chartArea: { left: '10', top: '10', bottom: '50', width: '100%', height: '100%' },
    //                             // chart: {
    //                             //         title: 'Company Performance',
    //                             //         subtitle: 'Sales, Expenses, and Profit: ' + this.periodo.toString(),
    //                             //       },
    //                             bars: 'vertical',
    //                             vAxis: {format: 'decimal'},
    //                           });
    this.cargando = false;
  }  // funcion

  OnOff( fila ) {
    // console.log( fila );
    if ( !this.inmerse ) {
      fila.show = !fila.show;
    }
  }

  clickporMarcas( marca ) {}

}  // fin



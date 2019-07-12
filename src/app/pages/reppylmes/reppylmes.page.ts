import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController } from '@ionic/angular';
import { VistasPage } from '../../components/vistas/vistas.page';

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

  constructor(private datos: DatosService,
              private funciones: FuncionesService,
              private popoverCtrl: PopoverController ) {
    this.meses = this.funciones.losMeses( this.mes );
    // console.log(this.mes);
  }

  ngOnInit() {
    this.cargaEmpresas();
  }

  cargaEmpresas() {
    return this.datos.postDataSP( { sp: '/ws_pyl_clientesgt' } )
      .subscribe( ( data: any ) => {
          this.clientesgt = data.datos;
      });
  }

  async vistas( event ) {
    const popover = await this.popoverCtrl.create({
        component: VistasPage,
        event,
        mode: 'ios'
    });
    await popover.present();

    const { data } = await popover.onWillDismiss();

    if ( data !== undefined ) {
      this.vista  = data.vista ;
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
    this.datos.postDataSP( {  sp:      '/ws_pylmensual',
                              periodo: this.periodo.toString(),
                              cliente: this.cliente } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData();
                                     });
  }

  distribuyeData() {
    //
    let pos = 0;
    let x = [];
    this.filas = [];
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
                           ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                           total: 0 } );
      }
    });
    //
    this.totales.push( {  concepto: 'Totales',
                          ene:  0, feb: 0, mar: 0, abr: 0, may: 0, jun: 0, jul: 0, ago: 0, sep: 0, oct: 0, nov: 0, dic: 0,
                          total: 0 } );
    //
    // sumar filas del mismo concepto
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.filas.length; index++) {
      // filtrar el concepto
      x = this.rows.filter( row => row.concepto === this.filas[index].concepto );
      // recorrer las filas del mismo concepto
      x.forEach(element => {
        //
        pos = data.indexOf( element.mini );
        // total de la fila
        this.filas[index].total += element.monto;
        //
        if ( element.mes === 1  && this.mes >= element.mes ) {
          this.filas[index].ene += element.monto;
          this.totales[0].ene   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 2  && this.mes >= element.mes ) { 
          this.filas[index].feb += element.monto;
          this.totales[0].feb   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 3  && this.mes >= element.mes ) {
          this.filas[index].mar += element.monto;
          this.totales[0].mar   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 4  && this.mes >= element.mes ) {
          this.filas[index].abr += element.monto;
          this.totales[0].abr   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 5  && this.mes >= element.mes ) {
          this.filas[index].may += element.monto;
          this.totales[0].may   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 6  && this.mes >= element.mes ) {
          this.filas[index].jun += element.monto;
          this.totales[0].jun   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 7  && this.mes >= element.mes ) {
          this.filas[index].jul += element.monto;
          this.totales[0].jul   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 8  && this.mes >= element.mes ) {
          this.filas[index].ago += element.monto;
          this.totales[0].ago   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 9  && this.mes >= element.mes ) {
          this.filas[index].sep += element.monto;
          this.totales[0].sep   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 10 && this.mes >= element.mes ) {
          this.filas[index].oct += element.monto;
          this.totales[0].oct   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 11 && this.mes >= element.mes ) {
          this.filas[index].nov += element.monto;
          this.totales[0].nov   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
        if ( element.mes === 12 && this.mes >= element.mes ) {
          this.filas[index].dic += element.monto;
          this.totales[0].dic   += element.monto;
          if ( pos > 0) {
            eje[element.mes][pos] = eje[element.mes][pos] + element.monto;
          }
        }
      });
    }
    // sumo el total de totales
    this.totales[0].total = this.totales[0].ene + this.totales[0].feb + this.totales[0].mar + this.totales[0].abr +
                            this.totales[0].may + this.totales[0].jun + this.totales[0].jul + this.totales[0].ago +
                            this.totales[0].sep + this.totales[0].oct + this.totales[0].nov + this.totales[0].dic;
    // console.log(eje);
    // crear el grafico de lineas curvas
    const dataline = google.visualization.arrayToDataTable(eje);
    // Instantiate and draw our chart, passing in some options.
    const idelemento  = document.getElementById('line_curve_chart');
    const linechart   = new google.visualization.ColumnChart( idelemento );
    linechart.draw(dataline, {  curveType: 'function',
                                legend: { position: 'bottom' },
                                width: '100%',
                                height: '100%',
                                chartArea: { left: '10', top: '10', bottom: '50', width: '100%', height: '100%' },
                                // chart: {
                                //         title: 'Company Performance',
                                //         subtitle: 'Sales, Expenses, and Profit: ' + this.periodo.toString(),
                                //       },
                                bars: 'vertical',
                                vAxis: {format: 'decimal'},
                              });
    this.cargando = false;
  }  // funcion

}  // fin



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

  clientesgt  = [];
  cliente     = '';
  // sumas
  sumas     = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumasp    = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // barra superior
  hayNotas  = undefined;
  nNotas    = 0;
  vista = 'M';  // millon

  constructor(private datos: DatosService,
              private funciones: FuncionesService,
              private popoverCtrl: PopoverController ) {
    this.meses = this.funciones.losMeses( ( this.mes <= 6 ) ? 6 : 12 );
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
      //this.tranData();
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
      // console.log( data );
      this.cliente = data.vista ;
      this.cargaClienteMensual();
      //
    }
  }

  cargaClienteMensual() {
    //
    this.datos.postDataSP( {  sp:      '/ws_pylmensual',
                              periodo: this.periodo.toString(),
                              cliente: this.cliente } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData();
                                       // this.tranData(); 
                                     });
  }

  distribuyeData() {
    // console.log(this.mes);
    let pos = 0;
    let x = [];
    this.filas = [];
    // tslint:disable-next-line: max-line-length
    // const data = [ 'Mes', 'ADM', 'B2B', 'CDOK', 'CFIJ', 'COST', 'CVAR', 'G.OP', 'GNOP', 'INOP', 'LOG', 'MARG', 'NCV', 'PROM', 'PUB', 'REB', 'SUP', 'VTA' ];
    const data = [ 'Mes', 'G.OP', 'GNOP', 'MARG', 'NCV', 'REB', 'VTA' ];
    let eje = [];
    eje.push( data );
    for (let index = 0; index < 6; index++) {
      // eje.push( [ this.funciones.nombreMes( index + 1 ).slice( 0, 5 ), 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ] );
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
    // sumar filas del mismo concepto
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.filas.length; index++) {
      x = this.rows.filter( row => row.concepto === this.filas[index].concepto );
      // recorrer las filas del mismo concepto
      x.forEach(element => {
        //
        pos = data.indexOf( element.mini );
        //
        if ( element.mes === 1  ) { this.filas[index].ene += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 2  ) { this.filas[index].feb += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 3  ) { this.filas[index].mar += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 4  ) { this.filas[index].abr += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 5  ) { this.filas[index].may += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 6  ) { this.filas[index].jun += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        /*
        if ( element.mes === 7  ) { this.filas[index].jul += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 8  ) { this.filas[index].ago += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 9  ) { this.filas[index].sep += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 10 ) { this.filas[index].oct += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 11 ) { this.filas[index].nov += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        if ( element.mes === 12 ) { this.filas[index].dic += element.monto; if ( pos > 0) { eje[ element.mes ][ pos ] += element.monto; } }
        */
      });
    }
    // console.log(this.filas);
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
                                chart: {
                                        title: 'Company Performance',
                                        subtitle: 'Sales, Expenses, and Profit: ' + this.periodo.toString(),
                                      },
                                bars: 'vertical',
                                vAxis: {format: 'decimal'},
                              });

  }  // funcion

}  // fin



import { Component, OnInit } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController } from '@ionic/angular';
import { PeriodosComponent } from 'src/app/components/periodos/periodos.component';
import { NotasPage } from '../notas/notas.page';

declare var google;

@Component({
  selector: 'app-reppyl',
  templateUrl: './reppyl.page.html',
  styleUrls: ['./reppyl.page.scss'],
})
export class ReppylPage implements OnInit {

  empresa   = '01';
  hoy       = new Date();
  mes       = this.hoy.getMonth();
  periodo   = this.hoy.getFullYear();
  meses     = [];
  nombreMes = '';
  //
  config    = {};
  columns   = [];
  rows      = [];
  marcas    = [];
  // sumas
  sumas     = [0, 0, 0, 0, 0, 0, 0, 0, 0];
  // barra superior
  millon    = false;
  hayNotas  = undefined;
  nNotas    = 0;

  constructor(private datos: DatosService,
              private funciones: FuncionesService,
              private popoverCtrl: PopoverController,
              private modalCtrl: ModalController ) {
    this.nombreMes = this.funciones.nombreMes( this.mes );
  }

  ngOnInit() {
    this.cargaMarcas();
    this.cuantasNotas();
  }

  cargaMarcas() {
    return this.datos.postDataSP( { sp:      '/ws_pylmarcas',
                                    periodo: this.periodo.toString(),
                                    mes:     this.mes.toString() } )
      .subscribe( data => {
          const rs = data['datos'];
          this.marcas = rs;
          // tslint:disable-next-line: prefer-for-of
          for ( let i = 0; i < this.marcas.length; i++ ) {
              //
              this.marcas[i].vta_neta          = this.marcas[i].vta_neta          / 1000000 ;
              this.marcas[i].costo_operacional = this.marcas[i].costo_operacional / 1000000 ;
              this.marcas[i].rebaja_de_precios = this.marcas[i].rebaja_de_precios / 1000000 ;
              this.marcas[i].margen_bruto      = this.marcas[i].margen_bruto      / 1000000 ;
              this.marcas[i].gasto_promotores  = this.marcas[i].gasto_promotores  / 1000000 ;
              this.marcas[i].cross_docking     = this.marcas[i].cross_docking     / 1000000 ;
              this.marcas[i].convenio_variable = this.marcas[i].convenio_variable / 1000000 ;
              this.marcas[i].convenio_fijo     = this.marcas[i].convenio_fijo     / 1000000 ;
              this.marcas[i].contribucion      = this.marcas[i].contribucion      / 1000000 ;
          }
          this.cargaDatos();
      });
  }

  cargaDatos() {
    //
    this.datos.postDataSP( {  sp:      '/ws_pyl',
                              periodo: this.periodo.toString(),
                              mes:     this.mes.toString() } )
      .subscribe( data => {
            const rs = data['datos'];
            this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
            //
            this.columns = [];
            this.rows    = rs;
            // tslint:disable-next-line: prefer-for-of
            for (let i = 0; i < this.rows.length; i++) {
              // totales
              this.sumas[0] += this.rows[i].vta_neta         ;
              this.sumas[1] += this.rows[i].costo_operacional;
              this.sumas[2] += this.rows[i].rebaja_de_precios;
              this.sumas[3] += this.rows[i].margen_bruto     ;
              this.sumas[4] += this.rows[i].gasto_promotores ;
              this.sumas[5] += this.rows[i].cross_docking    ;
              this.sumas[6] += this.rows[i].convenio_variable;
              this.sumas[7] += this.rows[i].convenio_fijo    ;
              this.sumas[8] += this.rows[i].contribucion     ;
              // datos
              this.rows[i].vta_neta          = this.rows[i].vta_neta          / 1000000 ;
              this.rows[i].costo_operacional = this.rows[i].costo_operacional / 1000000 ;
              this.rows[i].rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
              this.rows[i].margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
              this.rows[i].gasto_promotores  = this.rows[i].gasto_promotores  / 1000000 ;
              this.rows[i].cross_docking     = this.rows[i].cross_docking     / 1000000 ;
              this.rows[i].convenio_variable = this.rows[i].convenio_variable / 1000000 ;
              this.rows[i].convenio_fijo     = this.rows[i].convenio_fijo     / 1000000 ;
              this.rows[i].contribucion      = this.rows[i].contribucion      / 1000000 ;
              // agregar las marcas
              this.rows[i].marcas = this.marcas.filter( fila => fila.sigla === this.rows[i].sigla );
            }
            //
            this.sumas[0] = this.sumas[0] / 1000000;
            this.sumas[1] = this.sumas[1] / 1000000;
            this.sumas[2] = this.sumas[2] / 1000000;
            this.sumas[3] = this.sumas[3] / 1000000;
            this.sumas[4] = this.sumas[4] / 1000000;
            this.sumas[5] = this.sumas[5] / 1000000;
            this.sumas[6] = this.sumas[6] / 1000000;
            this.sumas[7] = this.sumas[7] / 1000000;
            this.sumas[8] = this.sumas[8] / 1000000;
            //
            this.columns = [ { name: 'Cliente'          },
                             { name: 'Vta. Neta'        },
                             { name: 'Costo Operacional'},
                             { name: 'Rebaja de Precios'},
                             { name: 'Margen Bruto'     },
                             { name: 'Gto. Promotores'  },
                             { name: 'Cross-Docking'    },
                             { name: 'Convenio Variable'},
                             { name: 'Convenio Fijo'    },
                             { name: 'Contribucion'     } ];
            // -------------------------------------------------------------- grafica contribucion
            const eje = [];
            this.rows.forEach( element => {
              if ( element.contribucion > 0 ) {
                eje.push( [ element.sigla, element.contribucion ] );
              }
            });
            // crear el grafico de pie
            const PieContribucion = new google.visualization.DataTable();
            //
            PieContribucion.addColumn('string', 'Cliente');
            PieContribucion.addColumn('number', 'Contribución');
            PieContribucion.addRows( eje );
            // Instantiate and draw our chart, passing in some options.
            const PieContrib1 = new google.visualization.PieChart(document.getElementById('pieChart1'));
            const options   = { title:  'Contribución',
                                width:  '100%',
                                height: '100%',
                                chartArea: { left:    '10',
                                             top:     '20',
                                             bottom:  '50',
                                             width:   '100%',
                                             height:  '100%' },
                              };
            PieContrib1.draw(PieContribucion, options );
            // -------------------------------------------------------------- grafica margen_bruto
            const ejem = [];
            this.rows.forEach( element => {
              if ( element.margen_bruto > 0 ) {
                ejem.push( [ element.sigla, element.margen_bruto ] );
              }
            });
            // ordenar
            ejem.sort( (a, b) => b[1] - a[1] );
            // crear el grafico de pie
            const PieMargenBruto = new google.visualization.DataTable();
            //
            PieMargenBruto.addColumn('string', 'Cliente');
            PieMargenBruto.addColumn('number', 'Margen Bruto');
            PieMargenBruto.addRows( ejem );
            // Instantiate and draw our chart, passing in some options.
            const PieMargenB = new google.visualization.PieChart(document.getElementById('pieChart2'));
            const optionsmb   = { title:  'Margen Bruto',
                                width:  '100%',
                                height: '100%',
                                chartArea: { left:    '10',
                                              top:     '20',
                                              bottom:  '50',
                                              width:   '100%',
                                              height:  '100%' },
                              };
            PieMargenB.draw(PieMargenBruto, optionsmb );
            // -------------------------------------------------------------- ventas
            const ejev = [];
            this.rows.forEach( element => {
              if ( element.rebaja_de_precios > 0 ) {
                ejev.push( [ element.sigla, element.rebaja_de_precios ] );
              }
            });
            // ordenar por rebajas
            ejev.sort( (a, b) => b[1] - a[1] );
            // crear el grafico de pie
            const PieVentas = new google.visualization.DataTable();
            //
            PieVentas.addColumn('string', 'Cliente');
            PieVentas.addColumn('number', 'Rebajas');
            PieVentas.addRows( ejev );
            // Instantiate and draw our chart, passing in some options.
            const PieVentas1 = new google.visualization.PieChart(document.getElementById('pieChart3'));
            const optionsv  = { title:  'Rebajas',
                                width:  '100%',
                                height: '100%',
                                chartArea: { left:    '10',
                                             top:     '20',
                                             bottom:  '50',
                                             width:   '100%',
                                             height:  '100%' },
                              };
            PieVentas1.draw(PieVentas, optionsv );
            // --------------------------------------------------------------

      });
  }

  OnOff( fila ) {
    fila.show = !fila.show;
  }

  OnOffTotal() {
    let i = 0;
    this.rows.forEach(element => {
      this.rows[i].show = !this.rows[i].show;
      ++i;
    });
  }

  millones() {
    //
    if ( this.millon === false ) {
      // marcas
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.marcas.length; i++ ) {
        //
        this.marcas[i].vta_neta          = this.marcas[i].vta_neta          * 1000000 ;
        this.marcas[i].costo_operacional = this.marcas[i].costo_operacional * 1000000 ;
        this.marcas[i].rebaja_de_precios = this.marcas[i].rebaja_de_precios * 1000000 ;
        this.marcas[i].margen_bruto      = this.marcas[i].margen_bruto      * 1000000 ;
        this.marcas[i].gasto_promotores  = this.marcas[i].gasto_promotores  * 1000000 ;
        this.marcas[i].cross_docking     = this.marcas[i].cross_docking     * 1000000 ;
        this.marcas[i].convenio_variable = this.marcas[i].convenio_variable * 1000000 ;
        this.marcas[i].convenio_fijo     = this.marcas[i].convenio_fijo     * 1000000 ;
        this.marcas[i].contribucion      = this.marcas[i].contribucion      * 1000000 ;
      }
      // filas
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // datos
        this.rows[i].vta_neta          = this.rows[i].vta_neta          * 1000000 ;
        this.rows[i].costo_operacional = this.rows[i].costo_operacional * 1000000 ;
        this.rows[i].rebaja_de_precios = this.rows[i].rebaja_de_precios * 1000000 ;
        this.rows[i].margen_bruto      = this.rows[i].margen_bruto      * 1000000 ;
        this.rows[i].gasto_promotores  = this.rows[i].gasto_promotores  * 1000000 ;
        this.rows[i].cross_docking     = this.rows[i].cross_docking     * 1000000 ;
        this.rows[i].convenio_variable = this.rows[i].convenio_variable * 1000000 ;
        this.rows[i].convenio_fijo     = this.rows[i].convenio_fijo     * 1000000 ;
        this.rows[i].contribucion      = this.rows[i].contribucion      * 1000000 ;
        // agregar las marcas
        this.rows[i].marcas = this.marcas.filter( fila => fila.sigla === this.rows[i].sigla );
      }
      // sumas
      this.sumas[0] = this.sumas[0] * 1000000;
      this.sumas[1] = this.sumas[1] * 1000000;
      this.sumas[2] = this.sumas[2] * 1000000;
      this.sumas[3] = this.sumas[3] * 1000000;
      this.sumas[4] = this.sumas[4] * 1000000;
      this.sumas[5] = this.sumas[5] * 1000000;
      this.sumas[6] = this.sumas[6] * 1000000;
      this.sumas[7] = this.sumas[7] * 1000000;
      this.sumas[8] = this.sumas[8] * 1000000;
      //
    } else {
      // marcas
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.marcas.length; i++ ) {
        //
        this.marcas[i].vta_neta          = this.marcas[i].vta_neta          / 1000000 ;
        this.marcas[i].costo_operacional = this.marcas[i].costo_operacional / 1000000 ;
        this.marcas[i].rebaja_de_precios = this.marcas[i].rebaja_de_precios / 1000000 ;
        this.marcas[i].margen_bruto      = this.marcas[i].margen_bruto      / 1000000 ;
        this.marcas[i].gasto_promotores  = this.marcas[i].gasto_promotores  / 1000000 ;
        this.marcas[i].cross_docking     = this.marcas[i].cross_docking     / 1000000 ;
        this.marcas[i].convenio_variable = this.marcas[i].convenio_variable / 1000000 ;
        this.marcas[i].convenio_fijo     = this.marcas[i].convenio_fijo     / 1000000 ;
        this.marcas[i].contribucion      = this.marcas[i].contribucion      / 1000000 ;
      }
      // filas
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // datos
        this.rows[i].vta_neta          = this.rows[i].vta_neta          / 1000000 ;
        this.rows[i].costo_operacional = this.rows[i].costo_operacional / 1000000 ;
        this.rows[i].rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
        this.rows[i].margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
        this.rows[i].gasto_promotores  = this.rows[i].gasto_promotores  / 1000000 ;
        this.rows[i].cross_docking     = this.rows[i].cross_docking     / 1000000 ;
        this.rows[i].convenio_variable = this.rows[i].convenio_variable / 1000000 ;
        this.rows[i].convenio_fijo     = this.rows[i].convenio_fijo     / 1000000 ;
        this.rows[i].contribucion      = this.rows[i].contribucion      / 1000000 ;
        // agregar las marcas
        this.rows[i].marcas = this.marcas.filter( fila => fila.sigla === this.rows[i].sigla );
      }
      // sumas
      this.sumas[0] = this.sumas[0] / 1000000;
      this.sumas[1] = this.sumas[1] / 1000000;
      this.sumas[2] = this.sumas[2] / 1000000;
      this.sumas[3] = this.sumas[3] / 1000000;
      this.sumas[4] = this.sumas[4] / 1000000;
      this.sumas[5] = this.sumas[5] / 1000000;
      this.sumas[6] = this.sumas[6] / 1000000;
      this.sumas[7] = this.sumas[7] / 1000000;
      this.sumas[8] = this.sumas[8] / 1000000;
      //
    }
    //
    this.millon = !this.millon;
    //
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
      this.mes = data.mes ;
      this.nombreMes = this.funciones.nombreMes( this.mes );
      this.millon    = false;
      //
      this.cargaMarcas();
      this.cuantasNotas();
      //
    }

  }

  cuantasNotas() {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          periodo: this.periodo.toString(),
                                          mes:     this.mes.toString() } )
      .subscribe( data => {
          const rs = data['datos'];
          this.nNotas   = ( rs[0].notas ) ? rs[0].notas : 0 ;
          this.hayNotas = ( rs[0].notas ) ? true : undefined;
      });
  }

  async notas() {
    const modal = await this.modalCtrl.create({
        component: NotasPage,
        componentProps: { periodo: this.periodo,
                          mes:     this.mes,
                          empresa: this.empresa },
        mode: 'ios'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();

    if ( data !== undefined ) {
      // console.log(data);
    }

  }


}

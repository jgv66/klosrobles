import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController } from '@ionic/angular';


import { NotasPage } from '../notas/notas.page';
import { VistasPage } from 'src/app/components/vistas/vistas.page';

declare var google;

@Component({
  selector: 'app-superfam',
  templateUrl: './superfam.page.html',
  styleUrls: ['./superfam.page.scss'],
})
export class SuperfamPage implements OnInit {
  //
  datosParam;
  //
  informe   = 'p&lfamilias';
  //
  hoy       = new Date();
  meses     = [];
  nombreMes = '';
  //
  rows      = [];
  familias  = [];
  // sumas
  sumas     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumasp    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // barra superior
  hayNotas  = undefined;
  nNotas    = 0;
  vista     = 'M%';  // millon

  constructor( private modalCtrl: ModalController,
               private popoverCtrl: PopoverController,
               private funciones: FuncionesService,
               private datos: DatosService ) {
    // rescatar datos
    this.datosParam = this.datos.getData(1);
    this.nombreMes  = this.funciones.nombreMes( this.datosParam.mes );
  }

  ngOnInit() {
    this.cargaFamilias();
    this.cuantasNotas();
  }

  OnOff( fila ) {
    fila.show = !fila.show;
  }

  OnOffTotal() {
    let i = 0;
    this.rows.forEach( () => {
      this.rows[i].show = !this.rows[i].show ;
      ++i;
    });
  }

  cargaFamilias() {
    return this.datos.postDataSP( { sp:      '/ws_pylmarcafam',
                                    empresa: this.datosParam.empresa,
                                    periodo: this.datosParam.periodo.toString(),
                                    mes:     this.datosParam.mes.toString(),
                                    cliente: this.datosParam.cliente,
                                    marca:   this.datosParam.marca })
      .subscribe( ( data: any ) => {
        // console.log(data);
          const rs = data.datos;
          this.rows = rs;
          this.cargaDatos();
      });
  }

  cargaDatos() {
    //
    this.datos.postDataSP( {  sp:      '/ws_pylmarfamcod',
                              empresa: this.datosParam.empresa,
                              periodo: this.datosParam.periodo.toString(),
                              mes:     this.datosParam.mes.toString(),
                              cliente: this.datosParam.cliente,
                              marca:   this.datosParam.marca })
        .subscribe( (data: any) => {
            const rs  = data.datos;
            this.familias = rs;
            this.tranData();  /* cambia el formato de los datos */
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
            const PieContrib1 = new google.visualization.PieChart(document.getElementById('pieChart11'));
            const options   = { title:  'Contribución Total',
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
            const PieMargenB = new google.visualization.PieChart(document.getElementById('pieChart22'));
            const optionsmb   = { title:  'Margen Bruto Total',
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
            const PieVentas1 = new google.visualization.PieChart(document.getElementById('pieChart33'));
            const optionsv  = { title:  'Rebajas Total',
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

  cuantasNotas() {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          periodo: this.datosParam.periodo.toString(),
                                          mes:     this.datosParam.mes.toString(),
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
      this.tranData();
      //
    }
  }

  tranData() {
    if        ( this.vista === 'F'  ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
          //
          this.familias[i].x_vta_neta          = this.familias[i].vta_neta          / 1000000 ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000 ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000 ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      / 1000000 ;
          this.familias[i].x_gasto_promotores  = this.familias[i].gasto_promotores  / 1000000 ;
          this.familias[i].x_cross_docking     = this.familias[i].cross_docking     / 1000000 ;
          this.familias[i].x_convenio_variable = this.familias[i].convenio_variable / 1000000 ;
          this.familias[i].x_convenio_fijo     = this.familias[i].convenio_fijo     / 1000000 ;
          this.familias[i].x_contribucion      = this.familias[i].contribucion      / 1000000 ;
      }
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
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          / 1000000 ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional / 1000000 ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
        this.rows[i].x_gasto_promotores  = this.rows[i].gasto_promotores  / 1000000 ;
        this.rows[i].x_cross_docking     = this.rows[i].cross_docking     / 1000000 ;
        this.rows[i].x_convenio_variable = this.rows[i].convenio_variable / 1000000 ;
        this.rows[i].x_convenio_fijo     = this.rows[i].convenio_fijo     / 1000000 ;
        this.rows[i].x_contribucion      = this.rows[i].contribucion      / 1000000 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.sigla === this.rows[i].sigla );
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
    } else if ( this.vista === 'M'  ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
        //
        this.familias[i].x_vta_neta          = this.familias[i].vta_neta           ;
        this.familias[i].x_costo_operacional = this.familias[i].costo_operacional  ;
        this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios  ;
        this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto       ;
        this.familias[i].x_gasto_promotores  = this.familias[i].gasto_promotores   ; 
        this.familias[i].x_cross_docking     = this.familias[i].cross_docking      ;
        this.familias[i].x_convenio_variable = this.familias[i].convenio_variable  ;
        this.familias[i].x_convenio_fijo     = this.familias[i].convenio_fijo      ;
        this.familias[i].x_contribucion      = this.familias[i].contribucion       ;
      }
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
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      ;
        this.rows[i].x_gasto_promotores  = this.rows[i].gasto_promotores  ;
        this.rows[i].x_cross_docking     = this.rows[i].cross_docking     ;
        this.rows[i].x_convenio_variable = this.rows[i].convenio_variable ;
        this.rows[i].x_convenio_fijo     = this.rows[i].convenio_fijo     ;
        this.rows[i].x_contribucion      = this.rows[i].contribucion      ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.sigla === this.rows[i].sigla );
      }
      //
    } else if ( this.vista === '%'  ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
        //
        this.familias[i].x_vta_neta          = this.familias[i].vta_neta           ;
        this.familias[i].x_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_gasto_promotores  = ( this.familias[i].gasto_promotores  / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_cross_docking     = ( this.familias[i].cross_docking     / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_convenio_variable = ( this.familias[i].convenio_variable / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_convenio_fijo     = ( this.familias[i].convenio_fijo     / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_contribucion      = ( this.familias[i].contribucion      / this.familias[i].vta_neta ) * 100 ;
      }
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
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          ;
        this.rows[i].x_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_gasto_promotores  = ( this.rows[i].gasto_promotores  / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_cross_docking     = ( this.rows[i].cross_docking     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_convenio_variable = ( this.rows[i].convenio_variable / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_convenio_fijo     = ( this.rows[i].convenio_fijo     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_contribucion      = ( this.rows[i].contribucion      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.sigla === this.rows[i].sigla );
      }
      //
      this.sumas[1] = ( this.sumas[1] / this.sumas[0] ) * 100;
      this.sumas[2] = ( this.sumas[2] / this.sumas[0] ) * 100;
      this.sumas[3] = ( this.sumas[3] / this.sumas[0] ) * 100;
      this.sumas[4] = ( this.sumas[4] / this.sumas[0] ) * 100;
      this.sumas[5] = ( this.sumas[5] / this.sumas[0] ) * 100;
      this.sumas[6] = ( this.sumas[6] / this.sumas[0] ) * 100;
      this.sumas[7] = ( this.sumas[7] / this.sumas[0] ) * 100;
      this.sumas[8] = ( this.sumas[8] / this.sumas[0] ) * 100;
      //
    } else if ( this.vista === 'F%' ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
          // valores
          this.familias[i].x_vta_neta          = this.familias[i].vta_neta          / 1000000 ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000 ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000 ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      / 1000000 ;
          this.familias[i].x_gasto_promotores  = this.familias[i].gasto_promotores  / 1000000 ;
          this.familias[i].x_cross_docking     = this.familias[i].cross_docking     / 1000000 ;
          this.familias[i].x_convenio_variable = this.familias[i].convenio_variable / 1000000 ;
          this.familias[i].x_convenio_fijo     = this.familias[i].convenio_fijo     / 1000000 ;
          this.familias[i].x_contribucion      = this.familias[i].contribucion      / 1000000 ;
          // porcentajes
          this.familias[i].p_vta_neta          =   this.familias[i].vta_neta ;
          this.familias[i].p_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_gasto_promotores  = ( this.familias[i].gasto_promotores  / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_cross_docking     = ( this.familias[i].cross_docking     / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_convenio_variable = ( this.familias[i].convenio_variable / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_convenio_fijo     = ( this.familias[i].convenio_fijo     / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_contribucion      = ( this.familias[i].contribucion      / this.familias[i].vta_neta ) * 100 ;
      }
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
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          / 1000000 ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional / 1000000 ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
        this.rows[i].x_gasto_promotores  = this.rows[i].gasto_promotores  / 1000000 ;
        this.rows[i].x_cross_docking     = this.rows[i].cross_docking     / 1000000 ;
        this.rows[i].x_convenio_variable = this.rows[i].convenio_variable / 1000000 ;
        this.rows[i].x_convenio_fijo     = this.rows[i].convenio_fijo     / 1000000 ;
        this.rows[i].x_contribucion      = this.rows[i].contribucion      / 1000000 ;
        // porcentajes
        this.rows[i].p_vta_neta          =   this.rows[i].vta_neta ;
        this.rows[i].p_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_gasto_promotores  = ( this.rows[i].gasto_promotores  / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_cross_docking     = ( this.rows[i].cross_docking     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_convenio_variable = ( this.rows[i].convenio_variable / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_convenio_fijo     = ( this.rows[i].convenio_fijo     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_contribucion      = ( this.rows[i].contribucion      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.sigla === this.rows[i].sigla );
        // tslint:disable-next-line: prefer-for-of
        for ( let j = 0; j < this.rows[i].familias.length; j++ ) {
          // porcentajes sobre total
          // tslint:disable-next-line: max-line-length
          this.rows[i].familias[j].p_vta_neta  = ( ( ( this.rows[i].familias[j].vta_neta * 1000000 ) / this.rows[i].vta_neta ) / 1000000 ) * 100 ;
        }
      }
      //
      this.sumas[0]  = this.sumas[0] / 1000000 ;
      this.sumas[1]  = this.sumas[1] / 1000000 ;
      this.sumas[2]  = this.sumas[2] / 1000000 ;
      this.sumas[3]  = this.sumas[3] / 1000000 ;
      this.sumas[4]  = this.sumas[4] / 1000000 ;
      this.sumas[5]  = this.sumas[5] / 1000000 ;
      this.sumas[6]  = this.sumas[6] / 1000000 ;
      this.sumas[7]  = this.sumas[7] / 1000000 ;
      this.sumas[8]  = this.sumas[8] / 1000000 ;
      // porcentajes
      this.sumasp[0] =   this.sumas[0];
      this.sumasp[1] = ( this.sumas[1] / this.sumas[0] ) * 100 ;
      this.sumasp[2] = ( this.sumas[2] / this.sumas[0] ) * 100 ;
      this.sumasp[3] = ( this.sumas[3] / this.sumas[0] ) * 100 ;
      this.sumasp[4] = ( this.sumas[4] / this.sumas[0] ) * 100 ;
      this.sumasp[5] = ( this.sumas[5] / this.sumas[0] ) * 100 ;
      this.sumasp[6] = ( this.sumas[6] / this.sumas[0] ) * 100 ;
      this.sumasp[7] = ( this.sumas[7] / this.sumas[0] ) * 100 ;
      this.sumasp[8] = ( this.sumas[8] / this.sumas[0] ) * 100 ;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // porcentajes sobre total
        this.rows[i].p_vta_neta  = ( (this.rows[i].vta_neta / 1000000) / this.sumas[0] ) * 100 ;
      }

    } else if ( this.vista === 'M%' ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
          // valores
          this.familias[i].x_vta_neta          = this.familias[i].vta_neta          ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      ;
          this.familias[i].x_gasto_promotores  = this.familias[i].gasto_promotores  ;
          this.familias[i].x_cross_docking     = this.familias[i].cross_docking     ;
          this.familias[i].x_convenio_variable = this.familias[i].convenio_variable ;
          this.familias[i].x_convenio_fijo     = this.familias[i].convenio_fijo     ;
          this.familias[i].x_contribucion      = this.familias[i].contribucion      ;
          // porcentajes
          this.familias[i].p_vta_neta          =   this.familias[i].vta_neta ;
          this.familias[i].p_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_gasto_promotores  = ( this.familias[i].gasto_promotores  / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_cross_docking     = ( this.familias[i].cross_docking     / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_convenio_variable = ( this.familias[i].convenio_variable / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_convenio_fijo     = ( this.familias[i].convenio_fijo     / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_contribucion      = ( this.familias[i].contribucion      / this.familias[i].vta_neta ) * 100 ;
      }
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
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      ;
        this.rows[i].x_gasto_promotores  = this.rows[i].gasto_promotores  ;
        this.rows[i].x_cross_docking     = this.rows[i].cross_docking     ;
        this.rows[i].x_convenio_variable = this.rows[i].convenio_variable ;
        this.rows[i].x_convenio_fijo     = this.rows[i].convenio_fijo     ;
        this.rows[i].x_contribucion      = this.rows[i].contribucion      ;
        // porcentajes
        this.rows[i].p_vta_neta          =   this.rows[i].vta_neta ;
        this.rows[i].p_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_gasto_promotores  = ( this.rows[i].gasto_promotores  / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_cross_docking     = ( this.rows[i].cross_docking     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_convenio_variable = ( this.rows[i].convenio_variable / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_convenio_fijo     = ( this.rows[i].convenio_fijo     / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_contribucion      = ( this.rows[i].contribucion      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.superfam === this.rows[i].superfam );
        // tslint:disable-next-line: prefer-for-of
        for ( let j = 0; j < this.rows[i].familias.length; j++ ) {
          // porcentajes sobre total
          this.rows[i].familias[j].p_vta_neta  = ( this.rows[i].familias[j].vta_neta / this.rows[i].vta_neta ) * 100 ;
        }
      }
      // porcentajes
      this.sumasp[0] =   this.sumas[0];
      this.sumasp[1] = ( this.sumas[1] / this.sumas[0] ) * 100 ;
      this.sumasp[2] = ( this.sumas[2] / this.sumas[0] ) * 100 ;
      this.sumasp[3] = ( this.sumas[3] / this.sumas[0] ) * 100 ;
      this.sumasp[4] = ( this.sumas[4] / this.sumas[0] ) * 100 ;
      this.sumasp[5] = ( this.sumas[5] / this.sumas[0] ) * 100 ;
      this.sumasp[6] = ( this.sumas[6] / this.sumas[0] ) * 100 ;
      this.sumasp[7] = ( this.sumas[7] / this.sumas[0] ) * 100 ;
      this.sumasp[8] = ( this.sumas[8] / this.sumas[0] ) * 100 ;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // porcentajes sobre total
        this.rows[i].p_vta_neta  = ( this.rows[i].vta_neta / this.sumas[0] ) * 100 ;
      }
    }
  }

}

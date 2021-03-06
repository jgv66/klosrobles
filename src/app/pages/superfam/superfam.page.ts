import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { PopoverController, ModalController } from '@ionic/angular';


import { NotasPage } from '../notas/notas.page';
import { VistasPage } from 'src/app/components/vistas/vistas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

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
  top10     = [];
  // sumas
  sumas     = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  sumasp    = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  // barra superior
  hayNotas  = undefined;
  nNotas    = 0;
  vista     = 'M%';  // millon
  cargando  = false;

  constructor( private modalCtrl: ModalController,
               private popoverCtrl: PopoverController,
               private funciones: FuncionesService,
               private datos: DatosService ) {
    // rescatar datos
    this.datosParam = this.datos.getData(1);
    this.nombreMes  = this.funciones.nombreMes( this.datos.getData(1).mes );
  }

  ngOnInit() {
    this.cargaFamilias( this.datosParam.empresa,
                        this.datosParam.periodo,
                        this.datosParam.mes,
                        this.datosParam.cliente,
                        this.datosParam.marca );
    this.cuantasNotas( this.datosParam.periodo,
                       this.datosParam.mes );
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

  cargaFamilias( emp, per, mes, cli, mar ) {
    this.cargando = true;
    return this.datos.postDataSPSilent( { sp:      '/ws_pylmarcafam',
                                          empresa: emp,
                                          periodo: per.toString(),
                                          mes:     mes.toString(),
                                          cliente: cli,
                                          marca:   mar })
      .subscribe( ( data: any ) => {
          console.log('ws_pylmarcafam',data);
          const rs = data.datos;
          this.rows = rs;
          this.cargaDatos( emp, per, mes, cli, mar );
      });
  }

  cargaDatos( emp, per, mes, cli, mar ) {
    //
    this.datos.postDataSPSilent( {  sp:      '/ws_pylmarfamcod',
                                    empresa: emp,
                                    periodo: per.toString(),
                                    mes:     mes.toString(),
                                    cliente: cli,
                                    marca:   mar })
        .subscribe( (data: any) => {
            console.log('ws_pylmarfamcod',data);
            const rs  = data.datos;
            this.familias = rs;
            this.tranData();  /* cambia el formato de los datos */
            // -------------------------------------------------------------- ventas/pie
            const ejev = [];
            this.familias.forEach( element => {
              if ( element.margen_bruto > 0 ) {
                ejev.push( [ element.descripcion, element.margen_bruto ] );
              }
            });
            // crear el grafico de pie
            const PieVentas = new google.visualization.DataTable();
            //
            PieVentas.addColumn('string', 'Producto');
            PieVentas.addColumn('number', 'Margen bruto');
            PieVentas.addRows( ejev.slice( 0, 10 ) );
            // Instantiate and draw our chart, passing in some options.
            const PieVentas1 = new google.visualization.PieChart(document.getElementById('pieChart33'));
            const optionsv  = { title:  'Top-10',
                                width:  '100%',
                                height: '100%',
                                chartArea: { left:    '10',
                                             top:     '20',
                                             bottom:  '50',
                                             width:   '100%',
                                             height:  '100%' },
                              };
            PieVentas1.draw(PieVentas, optionsv );
            // -------------------------------------------------------------------------
            this.cargando = false;
    });
    //
    this.datos.postDataSPSilent( {sp:      '/ws_pylmarfamcod',
                                  empresa: emp,
                                  periodo: per.toString(),
                                  mes:     mes.toString(),
                                  cliente: cli,
                                  marca:   mar,
                                  top10:   'si' })
        .subscribe( (data: any) => {
            const rs  = data.datos;
            this.top10 = rs;
            // console.log(rs);
            // -------------------------------------------------------------- ventas/lineas
            let eje    = [];
            let header = ['Mes'];
            let xmes   = mes;
            let xper   = per;
            let fila   = [];

            this.top10.forEach( element => {
                if ( per === element.periodo && mes === element.mes ) {
                  header.push( element.producto );
                }
            });
            console.log( header );
            eje.push( header );
            //
            for (let index = 0; index < 5; index++) {
              //
              fila = [ xper.toString() + '/' + xmes.toString() ];
              //
              this.top10.forEach( element => {
                if ( xper === element.periodo && xmes === element.mes ) {
                  fila.push( element.margen_bruto );
                }
              });
              eje.push( fila );
              //
              xper = ( xmes === 1 ) ?	xper-1 : xper    ;
              xmes = ( xmes === 1	) ? 12		 : xmes - 1;
              //
            }
            console.log( eje );
            // crear el grafico de barras/lineas
            const barrasLineas  = new google.visualization.arrayToDataTable( eje );
            // Instantiate and draw our chart, passing in some options.
            const barrasLineas1 = new google.visualization.ComboChart(document.getElementById('LinChart33'));
            var options = {
              title : 'Evolución Top-10 5 Ultimos meses',
              vAxis: {title: 'Ventas'},
              hAxis: {title: 'Mes'},
              seriesType: 'bars'
            };
            barrasLineas1.draw( barrasLineas, options );  
            // -------------------------------------------------------------------------
      });
  }

  cuantasNotas( per, mes ) {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          periodo: per.toString(),
                                          mes:     mes.toString(),
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
        componentProps: { periodo: this.datosParam.periodo,
                          mes:     this.datosParam.mes,
                          informe: this.informe,
                          empresa: this.datosParam.empresa },
        mode: 'ios'
    });
    await modal.present();

    const { data } = await modal.onWillDismiss();
    this.cuantasNotas( this.datosParam.periodo,
                       this.datosParam.mes );
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
          this.familias[i].x_cantidad          = this.familias[i].cantidad  ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000 ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000 ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      / 1000000 ;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // totales
        this.sumas[0] += this.rows[i].vta_neta ;
        this.sumas[4] += this.rows[i].cantidad ;
        this.sumas[1] += this.rows[i].costo_operacional;
        this.sumas[2] += this.rows[i].rebaja_de_precios;
        this.sumas[3] += this.rows[i].margen_bruto     ;
        // datos
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          / 1000000 ;
        this.rows[i].x_cantidad          = this.rows[i].cantidad ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional / 1000000 ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.super_familia === this.rows[i].super_familia );
      }
      //
      this.sumas[0] = this.sumas[0] / 1000000;
      this.sumas[4] = this.sumas[4] ;
      this.sumas[1] = this.sumas[1] / 1000000;
      this.sumas[2] = this.sumas[2] / 1000000;
      this.sumas[3] = this.sumas[3] / 1000000;
      //
    } else if ( this.vista === 'M'  ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
        //
        this.familias[i].x_vta_neta          = this.familias[i].vta_neta ;
        this.familias[i].x_cantidad          = this.familias[i].cantidad ;
        this.familias[i].x_costo_operacional = this.familias[i].costo_operacional  ;
        this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios  ;
        this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto       ;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // totales
        this.sumas[0] += this.rows[i].vta_neta ;
        this.sumas[4] += this.rows[i].cantidad ;
        this.sumas[1] += this.rows[i].costo_operacional;
        this.sumas[2] += this.rows[i].rebaja_de_precios;
        this.sumas[3] += this.rows[i].margen_bruto     ;
        // datos
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta ;
        this.rows[i].x_cantidad          = this.rows[i].cantidad ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.super_familia === this.rows[i].super_familia );
      }
      //
    } else if ( this.vista === '%'  ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
        //
        this.familias[i].x_vta_neta          = this.familias[i].vta_neta ;
        this.familias[i].x_cantidad          = this.familias[i].cantidad ;
        this.familias[i].x_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
        this.familias[i].x_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // totales
        this.sumas[0] += this.rows[i].vta_neta ;
        this.sumas[4] += this.rows[i].cantidad ;
        this.sumas[1] += this.rows[i].costo_operacional;
        this.sumas[2] += this.rows[i].rebaja_de_precios;
        this.sumas[3] += this.rows[i].margen_bruto     ;
        // datos
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta ;
        this.rows[i].x_cantidad          = this.rows[i].cantidad ;
        this.rows[i].x_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].x_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.super_familia === this.rows[i].super_familia );
      }
      //
      this.sumas[4] =   this.sumas[4] ;
      this.sumas[1] = ( this.sumas[1] / this.sumas[0] ) * 100;
      this.sumas[2] = ( this.sumas[2] / this.sumas[0] ) * 100;
      this.sumas[3] = ( this.sumas[3] / this.sumas[0] ) * 100;
      //
    } else if ( this.vista === 'F%' ) {
      //
      this.sumas = [0, 0, 0, 0, 0, 0, 0, 0, 0];
      // tslint:disable-next-line: prefer-for-of
      for ( let i = 0; i < this.familias.length; i++ ) {
          // valores
          this.familias[i].x_vta_neta          = this.familias[i].vta_neta          / 1000000 ;
          this.familias[i].x_cantidad          = this.familias[i].cantidad ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional / 1000000 ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios / 1000000 ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      / 1000000 ;
          // porcentajes
          this.familias[i].p_vta_neta          =   this.familias[i].vta_neta ;
          this.familias[i].p_cantidad          =   this.familias[i].cantidad ;
          this.familias[i].p_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // totales
        this.sumas[0] += this.rows[i].vta_neta ;
        this.sumas[4] += this.rows[i].cantidad ;
        this.sumas[1] += this.rows[i].costo_operacional;
        this.sumas[2] += this.rows[i].rebaja_de_precios;
        this.sumas[3] += this.rows[i].margen_bruto     ;
        // datos
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          / 1000000 ;
        this.rows[i].x_cantidad          = this.rows[i].cantidad ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional / 1000000 ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios / 1000000 ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      / 1000000 ;
        // porcentajes
        this.rows[i].p_vta_neta          =   this.rows[i].vta_neta ;
        this.rows[i].p_cantidad          =   this.rows[i].cantidad ;
        this.rows[i].p_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.super_familia === this.rows[i].super_familia );
        // tslint:disable-next-line: prefer-for-of
        for ( let j = 0; j < this.rows[i].familias.length; j++ ) {
          // porcentajes sobre total
          // tslint:disable-next-line: max-line-length
          this.rows[i].familias[j].p_vta_neta  = ( ( ( this.rows[i].familias[j].vta_neta * 1000000 ) / this.rows[i].vta_neta ) / 1000000 ) * 100 ;
        }
      }
      //
      this.sumas[0]  = this.sumas[0] / 1000000 ;
      this.sumas[4]  = this.sumas[4] ;
      this.sumas[1]  = this.sumas[1] / 1000000 ;
      this.sumas[2]  = this.sumas[2] / 1000000 ;
      this.sumas[3]  = this.sumas[3] / 1000000 ;
      // porcentajes
      this.sumasp[0] =   this.sumas[0] ;
      this.sumasp[4] =   this.sumas[4] ;
      this.sumasp[1] = ( this.sumas[1] / this.sumas[0] ) * 100 ;
      this.sumasp[2] = ( this.sumas[2] / this.sumas[0] ) * 100 ;
      this.sumasp[3] = ( this.sumas[3] / this.sumas[0] ) * 100 ;
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
          this.familias[i].x_cantidad          = this.familias[i].cantidad          ;
          this.familias[i].x_costo_operacional = this.familias[i].costo_operacional ;
          this.familias[i].x_rebaja_de_precios = this.familias[i].rebaja_de_precios ;
          this.familias[i].x_margen_bruto      = this.familias[i].margen_bruto      ;
          // porcentajes
          this.familias[i].p_vta_neta          =   this.familias[i].vta_neta ;
          this.familias[i].p_cantidad          =   this.familias[i].cantidad ;
          this.familias[i].p_costo_operacional = ( this.familias[i].costo_operacional / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_rebaja_de_precios = ( this.familias[i].rebaja_de_precios / this.familias[i].vta_neta ) * 100 ;
          this.familias[i].p_margen_bruto      = ( this.familias[i].margen_bruto      / this.familias[i].vta_neta ) * 100 ;
      }
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // totales
        this.sumas[0] += this.rows[i].vta_neta         ;
        this.sumas[1] += this.rows[i].costo_operacional;
        this.sumas[2] += this.rows[i].rebaja_de_precios;
        this.sumas[3] += this.rows[i].margen_bruto     ;
        this.sumas[4] += this.rows[i].cantidad         ;
        // datos
        this.rows[i].x_vta_neta          = this.rows[i].vta_neta          ;
        this.rows[i].x_cantidad          = this.rows[i].cantidad          ;
        this.rows[i].x_costo_operacional = this.rows[i].costo_operacional ;
        this.rows[i].x_rebaja_de_precios = this.rows[i].rebaja_de_precios ;
        this.rows[i].x_margen_bruto      = this.rows[i].margen_bruto      ;
        // porcentajes
        this.rows[i].p_vta_neta          =   this.rows[i].vta_neta ;
        this.rows[i].p_cantidad          =   this.rows[i].cantidad ;
        this.rows[i].p_costo_operacional = ( this.rows[i].costo_operacional / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_rebaja_de_precios = ( this.rows[i].rebaja_de_precios / this.rows[i].vta_neta ) * 100 ;
        this.rows[i].p_margen_bruto      = ( this.rows[i].margen_bruto      / this.rows[i].vta_neta ) * 100 ;
        // agregar las familias
        this.rows[i].familias = this.familias.filter( fila => fila.super_familia === this.rows[i].super_familia );
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
      this.sumasp[4] =   this.sumas[4] ;
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.rows.length; i++) {
        // porcentajes sobre total
        this.rows[i].p_vta_neta  = ( this.rows[i].vta_neta / this.sumas[0] ) * 100 ;
      }
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
      this.nombreMes = this.funciones.nombreMes( data.mes );
      //
      this.cargaFamilias( this.datosParam.empresa,
                          this.datosParam.periodo,
                          data.mes,
                          this.datosParam.cliente,
                          this.datosParam.marca );
      this.cuantasNotas( this.datosParam.periodo,
                         data.mes );
      //
    }
  }

}

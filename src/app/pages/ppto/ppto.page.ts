import { Component, OnInit, ViewChild } from '@angular/core';
import { PopoverController, ModalController, IonSegment } from '@ionic/angular';
import { DatosService } from '../../services/datos.service';
import { FuncionesService } from '../../services/funciones.service';
import { VistasPage } from '../../components/vistas/vistas.page';
import { NotasPage } from '../notas/notas.page';
import { PeriodosComponent } from '../../components/periodos/periodos.component';

declare var google;

@Component({
  selector: 'app-ppto',
  templateUrl: './ppto.page.html',
  styleUrls: ['./ppto.page.scss'],
  // animations: []  // <- define tu animación aquí 
})
export class PptoPage implements OnInit {
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
  filas     = [];
  acumul    = [];
  proyec    = [];
  // temmporada
  trows     = [];
  tfilas    = [];
  tacumul   = [];
  tproyec   = [];
  // totales
  tmes      = [];
  tacu      = [];
  tpro      = [];
  // subtotales
  tmesclisub = [];
  tmestemsub = [];
  tmestotsub = [];
  tacuclisub = [];
  tacutemsub = [];
  tacutotsub = [];
  tproclisub = [];
  tprotemsub = [];
  tprototsub = [];
  // barra superior
  informe   = 'ppto';
  vista     = 'M';  // millon
  titu      = 'Comercial';
  hayNotas  = undefined;
  nNotas    = 0;
  inmerse   = false;
  cargando  = false;

  // ngx-charts
  // view      = [ 800, 380 ];
  dataGrafo = [ { name: 'Mes',   value: 0, ppto: 0 },
                { name: 'Acum.', value: 0, ppto: 0 },
                { name: 'Proy.', value: 0, ppto: 0 } ];

  constructor( private datos: DatosService,
               private funciones: FuncionesService,
               private modalCtrl: ModalController,
               private popoverCtrl: PopoverController ) {
    this.meses     = this.funciones.losMeses();
    this.nombreMes = this.funciones.nombreMes( this.mes );
  }

  ngOnInit() {
    this.segmento.value = 'Del Mes';
    this.valorSegmento  = 'Del Mes';
    this.cargaPpto();
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
      this.vista = data.vista ;
    }
  }

  cuantasNotas() {
    return this.datos.postDataSPSilent( { sp:      '/ws_pylnotascuenta',
                                          informe: this.informe,
                                          empresa: this.empresa,
                                          periodo: this.periodo.toString() } )
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
    // console.log(event.detail.value);
    switch ( this.valorSegmento ) {
      case 'Del Mes':
        this.titu = 'Comercial';
        break;
      case 'Acumulado':
        this.titu = 'Acumulada';
        break;
      case 'Proyeccion':
        this.titu = 'Proyectada';
        break;
      default:
        this.titu = 'Comercial';
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
      this.cargaPpto();
      //
    }
  }

  cargaPpto() {
    this.cargando = true;
    this.datos.postDataSPSilent( {sp:      '/ws_ppto_vta_com',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  venta:   true } )
          .subscribe( (data: any) => { this.rows = data.datos;
                                       this.distribuyeData();
                                       this.cargaTemporada();
                                     });
  }
  distribuyeData() {
    //
    // console.log(this.rows);
    //
    let x = [];
    this.filas   = [];
    this.proyec  = [];
    this.acumul  = [];
    // existen datos? falta preguntar
    this.rows.forEach( element => {
      x = this.filas.filter( fila => fila.cliente === element.cliente );
      // si no existe.. se agrega
      if ( x.length === 0 ) {
        //
        this.filas.push( { cliente: element.cliente,
                           sigla: element.sigla,
                           show: false,
                           eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                           julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                           enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                           julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                           eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                           julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                           totalpas: 0,
                           totalact: 0,
                           marcas: [ {  marca: '001',
                                        nombre_marca: 'THOMAS',
                                        eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                        julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                        enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                        julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                        eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                        julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                        totpas: 0, totact: 0 },
                                     {  marca: '006',
                                        nombre_marca: 'SIEGEN',
                                        eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                        julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                        enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                        julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                        eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                        julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                        totpas: 0, totact: 0 } ]
                        });
        this.acumul.push( { cliente: element.cliente,
                            sigla: element.sigla,
                            show: false,
                            eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                            julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                            enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                            julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                            eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                            julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                            totalpas: 0,
                            totalact: 0,
                            marcas: [ {  marca: '001',
                                        nombre_marca: 'THOMAS',
                                        eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                        julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                        enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                        julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                        eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                        julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                        totpas: 0, totact: 0 },
                                      {  marca: '006',
                                        nombre_marca: 'SIEGEN',
                                        eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                        julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                        enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                        julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                        eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                        julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                        totpas: 0, totact: 0 } ]
                        });
        this.proyec.push( { cliente: element.cliente,
                          sigla: element.sigla,
                          show: false,
                          eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                          julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                          enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                          julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                          eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                          julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                          totalpas: 0,
                          totalact: 0,
                          marcas: [ {  marca: '001',
                                      nombre_marca: 'THOMAS',
                                      eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                      julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                      enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                      julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                      eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                      julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                      totpas: 0, totact: 0 },
                                    {  marca: '006',
                                      nombre_marca: 'SIEGEN',
                                      eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                                      julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                                      enepas:  0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                                      julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                                      eneact:  0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                                      julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                                      totpas: 0, totact: 0 } ]
                      });
      }
    });
    // tslint:disable-next-line: prefer-for-of
    for (let indexf = 0; indexf < this.filas.length; indexf++) {
      // tslint:disable-next-line: prefer-for-of
      for (let indexr = 0; indexr < this.rows.length; indexr++) {
        if ( this.rows[indexr].marca === '001' || this.rows[indexr].marca === '006' ) {
          if ( this.filas[indexf].cliente === this.rows[indexr].cliente ) {
            // console.log(this.filas[indexf].mini, this.rows[indexr], this.filas[indexf].concepto === this.rows[indexr].concepto );
            for ( let mm = 0; mm < 2; mm++ ) {
              if ( this.filas[indexf].marcas[mm].marca === this.rows[indexr].marca ) {
                if ( this.rows[indexr].periodo === this.periodo ) {
                  // venta
                  this.filas[indexf].marcas[mm].totact += this.rows[indexr].monto ;
                  this.filas[indexf].marcas[mm].eneact += ( this.rows[indexr].mes === 1  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].febact += ( this.rows[indexr].mes === 2  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].maract += ( this.rows[indexr].mes === 3  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].abract += ( this.rows[indexr].mes === 4  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].mayact += ( this.rows[indexr].mes === 5  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].junact += ( this.rows[indexr].mes === 6  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].julact += ( this.rows[indexr].mes === 7  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].agoact += ( this.rows[indexr].mes === 8  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].sepact += ( this.rows[indexr].mes === 9  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].octact += ( this.rows[indexr].mes === 10 ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].novact += ( this.rows[indexr].mes === 11 ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].dicact += ( this.rows[indexr].mes === 12 ) ? this.rows[indexr].monto : 0 ;
                  // ppto
                  this.filas[indexf].marcas[mm].eneppto += ( this.rows[indexr].mes === 1  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].febppto += ( this.rows[indexr].mes === 2  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].marppto += ( this.rows[indexr].mes === 3  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].abrppto += ( this.rows[indexr].mes === 4  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].mayppto += ( this.rows[indexr].mes === 5  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].junppto += ( this.rows[indexr].mes === 6  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].julppto += ( this.rows[indexr].mes === 7  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].agoppto += ( this.rows[indexr].mes === 8  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].sepppto += ( this.rows[indexr].mes === 9  ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].octppto += ( this.rows[indexr].mes === 10 ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].novppto += ( this.rows[indexr].mes === 11 ) ? this.rows[indexr].ppto : 0 ;
                  this.filas[indexf].marcas[mm].dicppto += ( this.rows[indexr].mes === 12 ) ? this.rows[indexr].ppto : 0 ;
                  // venta acumulada
                  this.acumul[indexf].marcas[mm].eneact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].febact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].maract += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].abract += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].mayact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].junact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].julact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].agoact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].sepact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].octact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].novact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].dicact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  // ppto acumulado
                  this.acumul[indexf].marcas[mm].eneppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].febppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].marppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].abrppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].mayppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].junppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].julppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].agoppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].sepppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].octppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].novppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  this.acumul[indexf].marcas[mm].dicppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : 0 ;
                  // venta acumulada proyectada
                  this.proyec[indexf].marcas[mm].eneact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].febact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].maract += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].abract += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].mayact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].junact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].julact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].agoact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].sepact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].octact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].novact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].dicact += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].ppto ;
                  // vta ppto acumulado
                  this.proyec[indexf].marcas[mm].eneppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].febppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].marppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].abrppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].mayppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].junppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].julppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].agoppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].sepppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].octppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].novppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  this.proyec[indexf].marcas[mm].dicppto += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].ppto : this.rows[indexr].ppto ;
                  //
                } else {
                  this.filas[indexf].marcas[mm].totpas += this.rows[indexr].monto ;
                  this.filas[indexf].marcas[mm].enepas += ( this.rows[indexr].mes === 1  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].febpas += ( this.rows[indexr].mes === 2  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].marpas += ( this.rows[indexr].mes === 3  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].abrpas += ( this.rows[indexr].mes === 4  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].maypas += ( this.rows[indexr].mes === 5  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].junpas += ( this.rows[indexr].mes === 6  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].julpas += ( this.rows[indexr].mes === 7  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].agopas += ( this.rows[indexr].mes === 8  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].seppas += ( this.rows[indexr].mes === 9  ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].octpas += ( this.rows[indexr].mes === 10 ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].novpas += ( this.rows[indexr].mes === 11 ) ? this.rows[indexr].monto : 0 ;
                  this.filas[indexf].marcas[mm].dicpas += ( this.rows[indexr].mes === 12 ) ? this.rows[indexr].monto : 0 ;
                  // acumulado
                  this.acumul[indexf].marcas[mm].enepas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].febpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].marpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].abrpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].maypas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].junpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].julpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].agopas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].seppas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].octpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].novpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  this.acumul[indexf].marcas[mm].dicpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : 0 ;
                  // proyeccion
                  this.proyec[indexf].marcas[mm].enepas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].febpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].marpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].abrpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].maypas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].junpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].julpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].agopas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].seppas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].octpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].novpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                  this.proyec[indexf].marcas[mm].dicpas += ( this.rows[indexr].mes <= this.mes ) ? this.rows[indexr].monto : this.rows[indexr].monto ;
                }
              }
            }
          }
        }
      }
    }
    // sumar filas del mismo cliente
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.filas.length; index++) {
      // filtrar el concepto
      x = this.rows.filter( row => row.cliente === this.filas[index].cliente );
      // recorrer las filas del mismo concepto
      x.forEach( element => {
        //
        if ( element.marca === '001' || element.marca === '006') {
          // del mes
          if ( element.mes === 1 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].eneact   += element.monto;
                this.filas[index].eneppto  += element.ppto;
              } else {
                this.filas[index].enepas  += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].eneppto  += element.ppto;
              } else {
                this.filas[index].enepas  += element.monto;
              }
            }
          }
          if ( element.mes === 2 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].febact   += element.monto;
                this.filas[index].febppto  += element.ppto;
              } else {
                this.filas[index].febpas  += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].febppto  += element.ppto;
              } else {
                this.filas[index].febpas += element.monto;
              }
            }
          }
          if ( element.mes === 3 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].maract   += element.monto;
                this.filas[index].marppto  += element.ppto;
              } else {
                this.filas[index].marpas  += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].marppto  += element.ppto;
              } else {
                this.filas[index].marpas += element.monto;
              }
            }
          }
          if ( element.mes === 4 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].abract  += element.monto;
                this.filas[index].abrppto += element.ppto;
              } else {
                this.filas[index].abrpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].abrppto += element.ppto;
              } else {
                this.filas[index].abrpas += element.monto;
              }
            }
          }
          if ( element.mes === 5 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].mayact  += element.monto;
                this.filas[index].mayppto += element.ppto;
              } else {
                this.filas[index].maypas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].mayppto += element.ppto;
              } else {
                this.filas[index].maypas += element.monto;
              }
            }
          }
          if ( element.mes === 6 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].junact  += element.monto;
                this.filas[index].junppto += element.ppto;
              } else {
                this.filas[index].junpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].junppto += element.ppto;
              } else {
                this.filas[index]. junpas += element.monto;
              }
            }
          }
          if ( element.mes === 7 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].julact  += element.monto;
                this.filas[index].julppto += element.ppto;
              } else {
                this.filas[index].julpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].julppto += element.ppto;
              } else {
                this.filas[index].julpas += element.monto;
              }
            }
          }
          if ( element.mes === 8 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].agoact  += element.monto;
                this.filas[index].agoppto += element.ppto;
              } else {
                this.filas[index].agopas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].agoppto += element.ppto;
              } else {
                this.filas[index].agopas += element.monto;
              }
            }
          }
          if ( element.mes === 9 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].sepact  += element.monto;
                this.filas[index].sepppto += element.ppto;
              } else {
                this.filas[index].seppas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].sepppto += element.ppto;
              } else {
                this.filas[index].seppas += element.monto;
              }
            }
          }
          if ( element.mes === 10 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].octact  += element.monto;
                this.filas[index].octppto += element.ppto;
              } else {
                this.filas[index].octpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].octppto += element.ppto;
              } else {
                this.filas[index].octpas += element.monto;
              }
            }
          }
          if ( element.mes === 11 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].novact  += element.monto;
                this.filas[index].novppto += element.ppto;
              } else {
                this.filas[index].novpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].novppto += element.ppto;
              } else {
                this.filas[index].novpas += element.monto;
              }
            }
          }
          if ( element.mes === 12 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.filas[index].dicact  += element.monto;
                this.filas[index].dicppto += element.ppto;
              } else {
                this.filas[index].dicpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.filas[index].dicppto += element.ppto;
              } else {
                this.filas[index].dicpas += element.monto;
              }
            }
          }
          // acumulados y proyeccion
          if ( element.periodo === this.periodo ) {
            // acumulado
            this.acumul[index].eneact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].eneppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].febact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].febppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].maract += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].marppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].abract += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].abrppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].mayact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].mayppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].junact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].junppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].julact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].julppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].agoact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].agoppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].sepact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].sepppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].octact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].octppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].novact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].novppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.acumul[index].dicact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.acumul[index].dicppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            // proyeccion
            this.proyec[index].eneact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].eneppto += element.ppto ;
            this.proyec[index].febact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].febppto += element.ppto ;
            this.proyec[index].maract += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].marppto += element.ppto ;
            this.proyec[index].abract += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].abrppto += element.ppto ;
            this.proyec[index].mayact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].mayppto += element.ppto ;
            this.proyec[index].junact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].junppto += element.ppto ;
            this.proyec[index].julact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].julppto += element.ppto ;
            this.proyec[index].agoact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].agoppto += element.ppto ;
            this.proyec[index].sepact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].sepppto += element.ppto ;
            this.proyec[index].octact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].octppto += element.ppto ;
            this.proyec[index].novact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].novppto += element.ppto ;
            this.proyec[index].dicact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.proyec[index].dicppto += element.ppto ;
            //
          } else {
            // acumulado
            this.acumul[index].enepas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].febpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].marpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].abrpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].maypas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].junpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].julpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].agopas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].seppas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].octpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].novpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.acumul[index].dicpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            // proyectado
            this.proyec[index].enepas += element.monto ;
            this.proyec[index].febpas += element.monto ;
            this.proyec[index].marpas += element.monto ;
            this.proyec[index].abrpas += element.monto ;
            this.proyec[index].maypas += element.monto ;
            this.proyec[index].junpas += element.monto ;
            this.proyec[index].julpas += element.monto ;
            this.proyec[index].agopas += element.monto ;
            this.proyec[index].seppas += element.monto ;
            this.proyec[index].octpas += element.monto ;
            this.proyec[index].novpas += element.monto ;
            this.proyec[index].dicpas += element.monto ;
          }
        }
      });
    }
  }

  cargaTemporada() {
    this.cargando = true;
    this.datos.postDataSPSilent( {sp:      '/ws_ppto_vta_com',
                                  periodo: this.periodo.toString(),
                                  empresa: this.empresa,
                                  venta:   false } )
          .subscribe( (data: any) => { this.trows = data.datos;
                                       this.distribuyeDataTempo();
                                     });
  }

  distribuyeDataTempo() {
    //
    // console.log(this.rows);
    //
    let x = [];
    this.tfilas   = [];
    this.tproyec  = [];
    this.tacumul  = [];
    // existen datos? falta preguntar
    this.trows.forEach( element => {
      x = this.tfilas.filter( fila => fila.cliente === element.cliente );
      // si no existe.. se agrega
      if ( x.length === 0 ) {
        //
        this.tfilas.push( { cliente: element.cliente,
                           sigla: element.sigla,
                           show: false,
                           eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                           julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                           enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                           julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                           eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                           julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                           totalpas: 0,
                           totalact: 0 });
        this.tacumul.push( {  cliente: element.cliente,
                              sigla: element.sigla,
                              show: false,
                              eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                              julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                              enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                              julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                              eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                              julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                              totalpas: 0,
                              totalact: 0 });
        this.tproyec.push( { cliente: element.cliente,
                          sigla: element.sigla,
                          show: false,
                          eneppto: 0, febppto: 0, marppto: 0, abrppto: 0, mayppto: 0, junppto: 0,
                          julppto: 0, agoppto: 0, sepppto: 0, octppto: 0, novppto: 0, dicppto: 0,
                          enepas: 0, febpas: 0, marpas: 0, abrpas: 0, maypas: 0, junpas: 0,
                          julpas: 0, agopas: 0, seppas: 0, octpas: 0, novpas: 0, dicpas: 0,
                          eneact: 0, febact: 0, maract: 0, abract: 0, mayact: 0, junact: 0,
                          julact: 0, agoact: 0, sepact: 0, octact: 0, novact: 0, dicact: 0,
                          totalpas: 0,
                          totalact: 0  });
      }
    });

    // sumar filas del mismo cliente
    // tslint:disable-next-line: prefer-for-of
    for (let index = 0; index < this.tfilas.length; index++) {
      // filtrar el concepto
      x = this.trows.filter( row => row.cliente === this.tfilas[index].cliente );
      // recorrer las filas del mismo concepto
      x.forEach( element => {
        //
        if ( element.marca === '001' || element.marca === '006') {
          // total de la fila
          this.tfilas[index].totalpas  += ( element.periodo === this.periodo ) ? 0 : element.monto;
          this.tfilas[index].totalact  += ( element.periodo === this.periodo ) ? element.monto : 0;
          // del mes
          if ( element.mes === 1 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].eneact  += element.monto;
                this.tfilas[index].eneppto += element.ppto;
              } else {
                this.tfilas[index].enepas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].eneppto += element.ppto;
              } else {
                this.tfilas[index].enepas += element.monto;
              }
            }
          }
          if ( element.mes === 2 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].febact  += element.monto;
                this.tfilas[index].febppto += element.ppto;
              } else {
                this.tfilas[index].febpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].febppto += element.ppto;
              } else {
                this.tfilas[index].febpas += element.monto;
              }
            }
          }
          if ( element.mes === 3 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].maract  += element.monto;
                this.tfilas[index].marppto += element.ppto;
              } else {
                this.tfilas[index].marpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].marppto += element.ppto;
              } else {
                this.tfilas[index].marpas += element.monto;
              }
            }
          }
          if ( element.mes === 4 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].abract  += element.monto;
                this.tfilas[index].abrppto += element.ppto;
              } else {
                this.tfilas[index].abrpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].abrppto += element.ppto;
              } else {
                this.tfilas[index].abrpas += element.monto;
              }
            }
          }
          if ( element.mes === 5 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].mayact  += element.monto;
                this.tfilas[index].mayppto += element.ppto;
              } else {
                this.tfilas[index].maypas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].mayppto += element.ppto;
              } else {
                this.tfilas[index].maypas += element.monto;
              }
            }
          }
          if ( element.mes === 6 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].junact  += element.monto;
                this.tfilas[index].junppto += element.ppto;
              } else {
                this.tfilas[index].junpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].junppto += element.ppto;
              } else {
                this.tfilas[index].junpas += element.monto;
              }
            }
          }
          if ( element.mes === 7 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].julact  += element.monto;
                this.tfilas[index].julppto += element.ppto;
              } else {
                this.tfilas[index].julpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].julppto += element.ppto;
              } else {
                this.tfilas[index].julpas += element.monto;
              }
            }
          }
          if ( element.mes === 8 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].agoact  += element.monto;
                this.tfilas[index].agoppto += element.ppto;
              } else {
                this.tfilas[index].agopas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].agoppto += element.ppto;
              } else {
                this.tfilas[index].agopas += element.monto;
              }
            }
          }
          if ( element.mes === 9 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].sepact  += element.monto;
                this.tfilas[index].sepppto += element.ppto;
              } else {
                this.tfilas[index].seppas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].sepppto += element.ppto;
              } else {
                this.tfilas[index].seppas += element.monto;
              }
            }
          }
          if ( element.mes === 10 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].octact  += element.monto;
                this.tfilas[index].octppto += element.ppto;
              } else {
                this.tfilas[index].octpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].octppto += element.ppto;
              } else {
                this.tfilas[index].octpas += element.monto;
              }
            }
          }
          if ( element.mes === 11 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].novact  += element.monto;
                this.tfilas[index].novppto += element.ppto;
              } else {
                this.tfilas[index].novpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].novppto += element.ppto;
              } else {
                this.tfilas[index].novpas += element.monto;
              }
            }
          }
          if ( element.mes === 12 ) {
            if ( this.mes >= element.mes ) {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].dicact  += element.monto;
                this.tfilas[index].dicppto += element.ppto;
              } else {
                this.tfilas[index].dicpas += element.monto;
              }
            } else {
              if ( element.periodo === this.periodo ) {
                this.tfilas[index].dicppto += element.ppto;
              } else {
                this.tfilas[index].dicpas += element.monto;
              }
            }
          }
          if ( element.periodo === this.periodo ) {
            // acumulado
            this.tacumul[index].eneact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].eneppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].febact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].febppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].maract += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].marppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].abract += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].abrppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].mayact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].mayppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].junact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].junppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].julact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].julppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].agoact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].agoppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].sepact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].sepppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].octact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].octppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].novact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].novppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            this.tacumul[index].dicact += ( element.mes <= this.mes ) ? element.monto : 0 ; this.tacumul[index].dicppto += ( element.mes <= this.mes ) ? element.ppto : 0 ;
            // proyeccion
            this.tproyec[index].eneact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].eneppto += element.ppto ;
            this.tproyec[index].febact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].febppto += element.ppto ;
            this.tproyec[index].maract += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].marppto += element.ppto ;
            this.tproyec[index].abract += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].abrppto += element.ppto ;
            this.tproyec[index].mayact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].mayppto += element.ppto ;
            this.tproyec[index].junact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].junppto += element.ppto ;
            this.tproyec[index].julact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].julppto += element.ppto ;
            this.tproyec[index].agoact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].agoppto += element.ppto ;
            this.tproyec[index].sepact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].sepppto += element.ppto ;
            this.tproyec[index].octact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].octppto += element.ppto ;
            this.tproyec[index].novact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].novppto += element.ppto ;
            this.tproyec[index].dicact += ( element.mes <= this.mes ) ? element.monto : element.ppto ; this.tproyec[index].dicppto += element.ppto ;
            //
          } else {
            // acumulado
            this.tacumul[index].enepas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].febpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].marpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].abrpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].maypas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].junpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].julpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].agopas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].seppas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].octpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].novpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            this.tacumul[index].dicpas += ( element.mes <= this.mes ) ? element.monto : 0 ;
            // proyectado
            this.tproyec[index].enepas += element.monto ;
            this.tproyec[index].febpas += element.monto ;
            this.tproyec[index].marpas += element.monto ;
            this.tproyec[index].abrpas += element.monto ;
            this.tproyec[index].maypas += element.monto ;
            this.tproyec[index].junpas += element.monto ;
            this.tproyec[index].julpas += element.monto ;
            this.tproyec[index].agopas += element.monto ;
            this.tproyec[index].seppas += element.monto ;
            this.tproyec[index].octpas += element.monto ;
            this.tproyec[index].novpas += element.monto ;
            this.tproyec[index].dicpas += element.monto ;
          }
        }
      });
    }
    // datos del grafo
    this.dataGrafo = [  { name: 'Mes',   value: 0, ppto: 0 },
                        { name: 'Acum.', value: 0, ppto: 0 },
                        { name: 'Proy.', value: 0, ppto: 0 } ];
    // console.log(this.filas.length );
    this.filas.forEach( element => {
      // del mes
      if ( this.mes ===  1 ) { this.dataGrafo[0].value += element.eneact; this.dataGrafo[0].ppto  += element.eneppto; }
      if ( this.mes ===  2 ) { this.dataGrafo[0].value += element.febact; this.dataGrafo[0].ppto  += element.febppto; }
      if ( this.mes ===  3 ) { this.dataGrafo[0].value += element.maract; this.dataGrafo[0].ppto  += element.marppto; }
      if ( this.mes ===  4 ) { this.dataGrafo[0].value += element.abract; this.dataGrafo[0].ppto  += element.abrppto; }
      if ( this.mes ===  5 ) { this.dataGrafo[0].value += element.mayact; this.dataGrafo[0].ppto  += element.mayppto; }
      if ( this.mes ===  6 ) { this.dataGrafo[0].value += element.junact; this.dataGrafo[0].ppto  += element.junppto; }
      if ( this.mes ===  7 ) { this.dataGrafo[0].value += element.julact; this.dataGrafo[0].ppto  += element.julppto; }
      if ( this.mes ===  8 ) { this.dataGrafo[0].value += element.agoact; this.dataGrafo[0].ppto  += element.agoppto; }
      if ( this.mes ===  9 ) { this.dataGrafo[0].value += element.sepact; this.dataGrafo[0].ppto  += element.sepppto; }
      if ( this.mes === 10 ) { this.dataGrafo[0].value += element.octact; this.dataGrafo[0].ppto  += element.octppto; }
      if ( this.mes === 11 ) { this.dataGrafo[0].value += element.novact; this.dataGrafo[0].ppto  += element.novppto; }
      if ( this.mes === 12 ) { this.dataGrafo[0].value += element.dicact; this.dataGrafo[0].ppto  += element.dicppto; }
      // console.log( this.dataGrafo[0], element.julact );
      // acumulado
      if ( this.mes >=  1 ) { this.dataGrafo[1].value += element.eneact; this.dataGrafo[1].ppto  += element.eneppto; }
      if ( this.mes >=  2 ) { this.dataGrafo[1].value += element.febact; this.dataGrafo[1].ppto  += element.febppto; }
      if ( this.mes >=  3 ) { this.dataGrafo[1].value += element.maract; this.dataGrafo[1].ppto  += element.marppto; }
      if ( this.mes >=  4 ) { this.dataGrafo[1].value += element.abract; this.dataGrafo[1].ppto  += element.abrppto; }
      if ( this.mes >=  5 ) { this.dataGrafo[1].value += element.mayact; this.dataGrafo[1].ppto  += element.mayppto; }
      if ( this.mes >=  6 ) { this.dataGrafo[1].value += element.junact; this.dataGrafo[1].ppto  += element.junppto; }
      if ( this.mes >=  7 ) { this.dataGrafo[1].value += element.julact; this.dataGrafo[1].ppto  += element.julppto; }
      if ( this.mes >=  8 ) { this.dataGrafo[1].value += element.agoact; this.dataGrafo[1].ppto  += element.agoppto; }
      if ( this.mes >=  9 ) { this.dataGrafo[1].value += element.sepact; this.dataGrafo[1].ppto  += element.sepppto; }
      if ( this.mes >= 10 ) { this.dataGrafo[1].value += element.octact; this.dataGrafo[1].ppto  += element.octppto; }
      if ( this.mes >= 11 ) { this.dataGrafo[1].value += element.novact; this.dataGrafo[1].ppto  += element.novppto; }
      if ( this.mes >= 12 ) { this.dataGrafo[1].value += element.dicact; this.dataGrafo[1].ppto  += element.dicppto; }
      //
      this.dataGrafo[2].value += ( this.mes >=  1 ) ? element.eneact : element.eneppto ; this.dataGrafo[2].ppto  += element.eneppto;
      this.dataGrafo[2].value += ( this.mes >=  2 ) ? element.febact : element.febppto ; this.dataGrafo[2].ppto  += element.febppto;
      this.dataGrafo[2].value += ( this.mes >=  3 ) ? element.maract : element.marppto ; this.dataGrafo[2].ppto  += element.marppto;
      this.dataGrafo[2].value += ( this.mes >=  4 ) ? element.abract : element.abrppto ; this.dataGrafo[2].ppto  += element.abrppto;
      this.dataGrafo[2].value += ( this.mes >=  5 ) ? element.mayact : element.mayppto ; this.dataGrafo[2].ppto  += element.mayppto;
      this.dataGrafo[2].value += ( this.mes >=  6 ) ? element.junact : element.junppto ; this.dataGrafo[2].ppto  += element.junppto;
      this.dataGrafo[2].value += ( this.mes >=  7 ) ? element.julact : element.julppto ; this.dataGrafo[2].ppto  += element.julppto;
      this.dataGrafo[2].value += ( this.mes >=  8 ) ? element.agoact : element.agoppto ; this.dataGrafo[2].ppto  += element.agoppto;
      this.dataGrafo[2].value += ( this.mes >=  9 ) ? element.sepact : element.sepppto ; this.dataGrafo[2].ppto  += element.sepppto;
      this.dataGrafo[2].value += ( this.mes >= 10 ) ? element.octact : element.octppto ; this.dataGrafo[2].ppto  += element.octppto;
      this.dataGrafo[2].value += ( this.mes >= 11 ) ? element.novact : element.novppto ; this.dataGrafo[2].ppto  += element.novppto;
      this.dataGrafo[2].value += ( this.mes >= 12 ) ? element.dicact : element.dicppto ; this.dataGrafo[2].ppto  += element.dicppto;
    });
    // console.log(this.tfilas.length );
    this.tfilas.forEach( element => {
      // del mes
      if ( this.mes ===  1 ) { this.dataGrafo[0].value += element.eneact; this.dataGrafo[0].ppto  += element.eneppto; }
      if ( this.mes ===  2 ) { this.dataGrafo[0].value += element.febact; this.dataGrafo[0].ppto  += element.febppto; }
      if ( this.mes ===  3 ) { this.dataGrafo[0].value += element.maract; this.dataGrafo[0].ppto  += element.marppto; }
      if ( this.mes ===  4 ) { this.dataGrafo[0].value += element.abract; this.dataGrafo[0].ppto  += element.abrppto; }
      if ( this.mes ===  5 ) { this.dataGrafo[0].value += element.mayact; this.dataGrafo[0].ppto  += element.mayppto; }
      if ( this.mes ===  6 ) { this.dataGrafo[0].value += element.junact; this.dataGrafo[0].ppto  += element.junppto; }
      if ( this.mes ===  7 ) { this.dataGrafo[0].value += element.julact; this.dataGrafo[0].ppto  += element.julppto; }
      if ( this.mes ===  8 ) { this.dataGrafo[0].value += element.agoact; this.dataGrafo[0].ppto  += element.agoppto; }
      if ( this.mes ===  9 ) { this.dataGrafo[0].value += element.sepact; this.dataGrafo[0].ppto  += element.sepppto; }
      if ( this.mes === 10 ) { this.dataGrafo[0].value += element.octact; this.dataGrafo[0].ppto  += element.octppto; }
      if ( this.mes === 11 ) { this.dataGrafo[0].value += element.novact; this.dataGrafo[0].ppto  += element.novppto; }
      if ( this.mes === 12 ) { this.dataGrafo[0].value += element.dicact; this.dataGrafo[0].ppto  += element.dicppto; }
      // console.log( this.dataGrafo[0], element.julact );
      // acumulado
      if ( this.mes >=  1 ) { this.dataGrafo[1].value += element.eneact; this.dataGrafo[1].ppto  += element.eneppto; }
      if ( this.mes >=  2 ) { this.dataGrafo[1].value += element.febact; this.dataGrafo[1].ppto  += element.febppto; }
      if ( this.mes >=  3 ) { this.dataGrafo[1].value += element.maract; this.dataGrafo[1].ppto  += element.marppto; }
      if ( this.mes >=  4 ) { this.dataGrafo[1].value += element.abract; this.dataGrafo[1].ppto  += element.abrppto; }
      if ( this.mes >=  5 ) { this.dataGrafo[1].value += element.mayact; this.dataGrafo[1].ppto  += element.mayppto; }
      if ( this.mes >=  6 ) { this.dataGrafo[1].value += element.junact; this.dataGrafo[1].ppto  += element.junppto; }
      if ( this.mes >=  7 ) { this.dataGrafo[1].value += element.julact; this.dataGrafo[1].ppto  += element.julppto; }
      if ( this.mes >=  8 ) { this.dataGrafo[1].value += element.agoact; this.dataGrafo[1].ppto  += element.agoppto; }
      if ( this.mes >=  9 ) { this.dataGrafo[1].value += element.sepact; this.dataGrafo[1].ppto  += element.sepppto; }
      if ( this.mes >= 10 ) { this.dataGrafo[1].value += element.octact; this.dataGrafo[1].ppto  += element.octppto; }
      if ( this.mes >= 11 ) { this.dataGrafo[1].value += element.novact; this.dataGrafo[1].ppto  += element.novppto; }
      if ( this.mes >= 12 ) { this.dataGrafo[1].value += element.dicact; this.dataGrafo[1].ppto  += element.dicppto; }
      //
      this.dataGrafo[2].value += ( this.mes >=  1 ) ? element.eneact : element.eneppto ; this.dataGrafo[2].ppto  += element.eneppto;
      this.dataGrafo[2].value += ( this.mes >=  2 ) ? element.febact : element.febppto ; this.dataGrafo[2].ppto  += element.febppto;
      this.dataGrafo[2].value += ( this.mes >=  3 ) ? element.maract : element.marppto ; this.dataGrafo[2].ppto  += element.marppto;
      this.dataGrafo[2].value += ( this.mes >=  4 ) ? element.abract : element.abrppto ; this.dataGrafo[2].ppto  += element.abrppto;
      this.dataGrafo[2].value += ( this.mes >=  5 ) ? element.mayact : element.mayppto ; this.dataGrafo[2].ppto  += element.mayppto;
      this.dataGrafo[2].value += ( this.mes >=  6 ) ? element.junact : element.junppto ; this.dataGrafo[2].ppto  += element.junppto;
      this.dataGrafo[2].value += ( this.mes >=  7 ) ? element.julact : element.julppto ; this.dataGrafo[2].ppto  += element.julppto;
      this.dataGrafo[2].value += ( this.mes >=  8 ) ? element.agoact : element.agoppto ; this.dataGrafo[2].ppto  += element.agoppto;
      this.dataGrafo[2].value += ( this.mes >=  9 ) ? element.sepact : element.sepppto ; this.dataGrafo[2].ppto  += element.sepppto;
      this.dataGrafo[2].value += ( this.mes >= 10 ) ? element.octact : element.octppto ; this.dataGrafo[2].ppto  += element.octppto;
      this.dataGrafo[2].value += ( this.mes >= 11 ) ? element.novact : element.novppto ; this.dataGrafo[2].ppto  += element.novppto;
      this.dataGrafo[2].value += ( this.mes >= 12 ) ? element.dicact : element.dicppto ; this.dataGrafo[2].ppto  += element.dicppto;
    });

    // datos del grafo
    //  -------------------------------------- guage
    //
    // console.log(this.dataGrafo);

    const datag = google.visualization.arrayToDataTable([
      ['Label', 'Value'],

      [this.dataGrafo[0].name, { v: ( this.dataGrafo[0].value * 100 / this.dataGrafo[0].ppto ),
                                 f: this.cambiaNro( ( this.dataGrafo[0].value * 100 / this.dataGrafo[0].ppto ) ) } ],
      [this.dataGrafo[1].name, { v: ( this.dataGrafo[1].value * 100 / this.dataGrafo[1].ppto ),
                                 f: this.cambiaNro( ( this.dataGrafo[1].value * 100 / this.dataGrafo[1].ppto ) ) } ],
      [this.dataGrafo[2].name, { v: ( this.dataGrafo[2].value * 100 / this.dataGrafo[2].ppto ),
                                 f: this.cambiaNro( ( this.dataGrafo[2].value * 100 / this.dataGrafo[2].ppto ) ) } ],
    ]);
    const options = {
      width:  500,
      height: 200,
      redFrom: 0, redTo: 95,
      yellowFrom: 95, yellowTo: 100,
      greenFrom: 100, greenTo: 135,
      minorTicks: 5,
      max: 135
    };
    const chart = new google.visualization.Gauge(document.getElementById('gauge_chart'));
    chart.draw(datag, options);
    // -------------------------------------- lineas
    const datax: any[] = [['Mes', this.periodo.toString(), (this.periodo - 1).toString(), 'Ppto' ],
                          ['Ene', 0, 0, 0 ],
                          ['Feb', 0, 0, 0 ],
                          ['Mar', 0, 0, 0 ],
                          ['Abr', 0, 0, 0 ],
                          ['May', 0, 0, 0 ],
                          ['Jun', 0, 0, 0 ],
                          ['Jul', 0, 0, 0 ],
                          ['Ago', 0, 0, 0 ],
                          ['Sep', 0, 0, 0 ],
                          ['Oct', 0, 0, 0 ],
                          ['Nov', 0, 0, 0 ],
                          ['Dic', 0, 0, 0 ] ];
    //
    this.filas.forEach( element => {
      datax[ 1][1] += element.eneact / 1000000; datax[ 1][2] += element.enepas / 1000000 ; datax[ 1][3] += element.eneppto / 1000000 ;
      datax[ 2][1] += element.febact / 1000000; datax[ 2][2] += element.febpas / 1000000 ; datax[ 2][3] += element.febppto / 1000000 ;
      datax[ 3][1] += element.maract / 1000000; datax[ 3][2] += element.marpas / 1000000 ; datax[ 3][3] += element.marppto / 1000000 ;
      datax[ 4][1] += element.abract / 1000000; datax[ 4][2] += element.abrpas / 1000000 ; datax[ 4][3] += element.abrppto / 1000000 ;
      datax[ 5][1] += element.mayact / 1000000; datax[ 5][2] += element.maypas / 1000000 ; datax[ 5][3] += element.mayppto / 1000000 ;
      datax[ 6][1] += element.junact / 1000000; datax[ 6][2] += element.junpas / 1000000 ; datax[ 6][3] += element.junppto / 1000000 ;
      datax[ 7][1] += element.julact / 1000000; datax[ 7][2] += element.julpas / 1000000 ; datax[ 7][3] += element.julppto / 1000000 ;
      datax[ 8][1] += element.agoact / 1000000; datax[ 8][2] += element.agopas / 1000000 ; datax[ 8][3] += element.agoppto / 1000000 ;
      datax[ 9][1] += element.sepact / 1000000; datax[ 9][2] += element.seppas / 1000000 ; datax[ 9][3] += element.sepppto / 1000000 ;
      datax[10][1] += element.octact / 1000000; datax[10][2] += element.octpas / 1000000 ; datax[10][3] += element.octppto / 1000000 ;
      datax[11][1] += element.novact / 1000000; datax[11][2] += element.novpas / 1000000 ; datax[11][3] += element.novppto / 1000000 ;
      datax[12][1] += element.dicact / 1000000; datax[12][2] += element.dicpas / 1000000 ; datax[12][3] += element.dicppto / 1000000 ;
    });
    this.tfilas.forEach( element => {
      datax[ 1][1] += element.eneact / 1000000; datax[ 1][2] += element.enepas / 1000000 ; datax[ 1][3] += element.eneppto / 1000000 ;
      datax[ 2][1] += element.febact / 1000000; datax[ 2][2] += element.febpas / 1000000 ; datax[ 2][3] += element.febppto / 1000000 ;
      datax[ 3][1] += element.maract / 1000000; datax[ 3][2] += element.marpas / 1000000 ; datax[ 3][3] += element.marppto / 1000000 ;
      datax[ 4][1] += element.abract / 1000000; datax[ 4][2] += element.abrpas / 1000000 ; datax[ 4][3] += element.abrppto / 1000000 ;
      datax[ 5][1] += element.mayact / 1000000; datax[ 5][2] += element.maypas / 1000000 ; datax[ 5][3] += element.mayppto / 1000000 ;
      datax[ 6][1] += element.junact / 1000000; datax[ 6][2] += element.junpas / 1000000 ; datax[ 6][3] += element.junppto / 1000000 ;
      datax[ 7][1] += element.julact / 1000000; datax[ 7][2] += element.julpas / 1000000 ; datax[ 7][3] += element.julppto / 1000000 ;
      datax[ 8][1] += element.agoact / 1000000; datax[ 8][2] += element.agopas / 1000000 ; datax[ 8][3] += element.agoppto / 1000000 ;
      datax[ 9][1] += element.sepact / 1000000; datax[ 9][2] += element.seppas / 1000000 ; datax[ 9][3] += element.sepppto / 1000000 ;
      datax[10][1] += element.octact / 1000000; datax[10][2] += element.octpas / 1000000 ; datax[10][3] += element.octppto / 1000000 ;
      datax[11][1] += element.novact / 1000000; datax[11][2] += element.novpas / 1000000 ; datax[11][3] += element.novppto / 1000000 ;
      datax[12][1] += element.dicact / 1000000; datax[12][2] += element.dicpas / 1000000 ; datax[12][3] += element.dicppto / 1000000 ;
    });
    //
    const datac = google.visualization.arrayToDataTable( datax );
    const optionsc = {
      title: 'Ventas x Mes (MM)', titleTextStyle: { color: '#f4f5f8' },
      curveType: 'function',
      backgroundColor: '#222428',
      chartArea: {width: '150%', height: '70%'},
      legend: { position: 'top', textStyle: {color: '#f4f5f8', fontSize: 12} },
      hAxis: { textStyle: {color: '#f4f5f8', fontSize: 12} },
      // vAxis: { textStyle: {color: '#f4f5f8', fontSize: 12} },
    };
    const chartc = new google.visualization.LineChart(document.getElementById('curve_chart'));
    chartc.draw(datac, optionsc);
    //
    this.cargando = false;
    // rellenar totales
    this.cargaTotales();
    // fin
  }

  cargaTotales() {
    // 
    this.tmes = [{ concepto: 'Mes de '       + this.nombreMes, anterior: 0, actual: 0, ppto: 0 }];
    this.tacu = [{ concepto: 'Acumulados a ' + this.nombreMes, anterior: 0, actual: 0, ppto: 0 }];
    this.tpro = [{ concepto: 'Proyectado '   + this.periodo,   anterior: 0, actual: 0, ppto: 0 }];
    // subtotales
    this.tmesclisub = [{ concepto: 'SubTotal Clientes',  anterior: 0, actual: 0, ppto: 0 }];
    this.tmestemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
    this.tmestotsub = [{ concepto: 'Gran Total ',        anterior: 0, actual: 0, ppto: 0 }];
    this.tacuclisub = [{ concepto: 'SubTotal Clientes',  anterior: 0, actual: 0, ppto: 0 }];
    this.tacutemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
    this.tacutotsub = [{ concepto: 'Gran Total ',        anterior: 0, actual: 0, ppto: 0 }];
    this.tproclisub = [{ concepto: 'SubTotal Clientes',  anterior: 0, actual: 0, ppto: 0 }];
    this.tprotemsub = [{ concepto: 'SubTotal Temporada', anterior: 0, actual: 0, ppto: 0 }];
    this.tprototsub = [{ concepto: 'Gran Total ',        anterior: 0, actual: 0, ppto: 0 }];
    // del mes
    this.filas.forEach( element => {
      if ( this.mes === 1  ) { this.tmes[0].anterior += element.enepas; this.tmes[0].actual += element.eneact; this.tmes[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmes[0].anterior += element.febpas; this.tmes[0].actual += element.febact; this.tmes[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmes[0].anterior += element.marpas; this.tmes[0].actual += element.maract; this.tmes[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmes[0].anterior += element.abrpas; this.tmes[0].actual += element.abract; this.tmes[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmes[0].anterior += element.maypas; this.tmes[0].actual += element.mayact; this.tmes[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmes[0].anterior += element.junpas; this.tmes[0].actual += element.junact; this.tmes[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmes[0].anterior += element.julpas; this.tmes[0].actual += element.julact; this.tmes[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmes[0].anterior += element.agopas; this.tmes[0].actual += element.agoact; this.tmes[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmes[0].anterior += element.seppas; this.tmes[0].actual += element.sepact; this.tmes[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmes[0].anterior += element.octpas; this.tmes[0].actual += element.octact; this.tmes[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmes[0].anterior += element.novpas; this.tmes[0].actual += element.novact; this.tmes[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmes[0].anterior += element.dicpas; this.tmes[0].actual += element.dicact; this.tmes[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tmesclisub[0].anterior += element.enepas; this.tmesclisub[0].actual += element.eneact; this.tmesclisub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmesclisub[0].anterior += element.febpas; this.tmesclisub[0].actual += element.febact; this.tmesclisub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmesclisub[0].anterior += element.marpas; this.tmesclisub[0].actual += element.maract; this.tmesclisub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmesclisub[0].anterior += element.abrpas; this.tmesclisub[0].actual += element.abract; this.tmesclisub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmesclisub[0].anterior += element.maypas; this.tmesclisub[0].actual += element.mayact; this.tmesclisub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmesclisub[0].anterior += element.junpas; this.tmesclisub[0].actual += element.junact; this.tmesclisub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmesclisub[0].anterior += element.julpas; this.tmesclisub[0].actual += element.julact; this.tmesclisub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmesclisub[0].anterior += element.agopas; this.tmesclisub[0].actual += element.agoact; this.tmesclisub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmesclisub[0].anterior += element.seppas; this.tmesclisub[0].actual += element.sepact; this.tmesclisub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmesclisub[0].anterior += element.octpas; this.tmesclisub[0].actual += element.octact; this.tmesclisub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmesclisub[0].anterior += element.novpas; this.tmesclisub[0].actual += element.novact; this.tmesclisub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmesclisub[0].anterior += element.dicpas; this.tmesclisub[0].actual += element.dicact; this.tmesclisub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tmestotsub[0].anterior += element.enepas; this.tmestotsub[0].actual += element.eneact; this.tmestotsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmestotsub[0].anterior += element.febpas; this.tmestotsub[0].actual += element.febact; this.tmestotsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmestotsub[0].anterior += element.marpas; this.tmestotsub[0].actual += element.maract; this.tmestotsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmestotsub[0].anterior += element.abrpas; this.tmestotsub[0].actual += element.abract; this.tmestotsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmestotsub[0].anterior += element.maypas; this.tmestotsub[0].actual += element.mayact; this.tmestotsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmestotsub[0].anterior += element.junpas; this.tmestotsub[0].actual += element.junact; this.tmestotsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmestotsub[0].anterior += element.julpas; this.tmestotsub[0].actual += element.julact; this.tmestotsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmestotsub[0].anterior += element.agopas; this.tmestotsub[0].actual += element.agoact; this.tmestotsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmestotsub[0].anterior += element.seppas; this.tmestotsub[0].actual += element.sepact; this.tmestotsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmestotsub[0].anterior += element.octpas; this.tmestotsub[0].actual += element.octact; this.tmestotsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmestotsub[0].anterior += element.novpas; this.tmestotsub[0].actual += element.novact; this.tmestotsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmestotsub[0].anterior += element.dicpas; this.tmestotsub[0].actual += element.dicact; this.tmestotsub[0].ppto += element.dicppto; }
    });
    // temporada
    this.tfilas.forEach( element => {
      if ( this.mes === 1  ) { this.tmes[0].anterior += element.enepas; this.tmes[0].actual += element.eneact; this.tmes[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmes[0].anterior += element.febpas; this.tmes[0].actual += element.febact; this.tmes[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmes[0].anterior += element.marpas; this.tmes[0].actual += element.maract; this.tmes[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmes[0].anterior += element.abrpas; this.tmes[0].actual += element.abract; this.tmes[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmes[0].anterior += element.maypas; this.tmes[0].actual += element.mayact; this.tmes[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmes[0].anterior += element.junpas; this.tmes[0].actual += element.junact; this.tmes[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmes[0].anterior += element.julpas; this.tmes[0].actual += element.julact; this.tmes[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmes[0].anterior += element.agopas; this.tmes[0].actual += element.agoact; this.tmes[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmes[0].anterior += element.seppas; this.tmes[0].actual += element.sepact; this.tmes[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmes[0].anterior += element.octpas; this.tmes[0].actual += element.octact; this.tmes[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmes[0].anterior += element.novpas; this.tmes[0].actual += element.novact; this.tmes[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmes[0].anterior += element.dicpas; this.tmes[0].actual += element.dicact; this.tmes[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tmestemsub[0].anterior += element.enepas; this.tmestemsub[0].actual += element.eneact; this.tmestemsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmestemsub[0].anterior += element.febpas; this.tmestemsub[0].actual += element.febact; this.tmestemsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmestemsub[0].anterior += element.marpas; this.tmestemsub[0].actual += element.maract; this.tmestemsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmestemsub[0].anterior += element.abrpas; this.tmestemsub[0].actual += element.abract; this.tmestemsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmestemsub[0].anterior += element.maypas; this.tmestemsub[0].actual += element.mayact; this.tmestemsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmestemsub[0].anterior += element.junpas; this.tmestemsub[0].actual += element.junact; this.tmestemsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmestemsub[0].anterior += element.julpas; this.tmestemsub[0].actual += element.julact; this.tmestemsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmestemsub[0].anterior += element.agopas; this.tmestemsub[0].actual += element.agoact; this.tmestemsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmestemsub[0].anterior += element.seppas; this.tmestemsub[0].actual += element.sepact; this.tmestemsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmestemsub[0].anterior += element.octpas; this.tmestemsub[0].actual += element.octact; this.tmestemsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmestemsub[0].anterior += element.novpas; this.tmestemsub[0].actual += element.novact; this.tmestemsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmestemsub[0].anterior += element.dicpas; this.tmestemsub[0].actual += element.dicact; this.tmestemsub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tmestotsub[0].anterior += element.enepas; this.tmestotsub[0].actual += element.eneact; this.tmestotsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tmestotsub[0].anterior += element.febpas; this.tmestotsub[0].actual += element.febact; this.tmestotsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tmestotsub[0].anterior += element.marpas; this.tmestotsub[0].actual += element.maract; this.tmestotsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tmestotsub[0].anterior += element.abrpas; this.tmestotsub[0].actual += element.abract; this.tmestotsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tmestotsub[0].anterior += element.maypas; this.tmestotsub[0].actual += element.mayact; this.tmestotsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tmestotsub[0].anterior += element.junpas; this.tmestotsub[0].actual += element.junact; this.tmestotsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tmestotsub[0].anterior += element.julpas; this.tmestotsub[0].actual += element.julact; this.tmestotsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tmestotsub[0].anterior += element.agopas; this.tmestotsub[0].actual += element.agoact; this.tmestotsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tmestotsub[0].anterior += element.seppas; this.tmestotsub[0].actual += element.sepact; this.tmestotsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tmestotsub[0].anterior += element.octpas; this.tmestotsub[0].actual += element.octact; this.tmestotsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tmestotsub[0].anterior += element.novpas; this.tmestotsub[0].actual += element.novact; this.tmestotsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tmestotsub[0].anterior += element.dicpas; this.tmestotsub[0].actual += element.dicact; this.tmestotsub[0].ppto += element.dicppto; }
    });
    // acumulado
    this.acumul.forEach( element => {
      if ( this.mes === 1  ) { this.tacu[0].anterior += element.enepas; this.tacu[0].actual += element.eneact; this.tacu[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacu[0].anterior += element.febpas; this.tacu[0].actual += element.febact; this.tacu[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacu[0].anterior += element.marpas; this.tacu[0].actual += element.maract; this.tacu[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacu[0].anterior += element.abrpas; this.tacu[0].actual += element.abract; this.tacu[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacu[0].anterior += element.maypas; this.tacu[0].actual += element.mayact; this.tacu[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacu[0].anterior += element.junpas; this.tacu[0].actual += element.junact; this.tacu[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacu[0].anterior += element.julpas; this.tacu[0].actual += element.julact; this.tacu[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacu[0].anterior += element.agopas; this.tacu[0].actual += element.agoact; this.tacu[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacu[0].anterior += element.seppas; this.tacu[0].actual += element.sepact; this.tacu[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacu[0].anterior += element.octpas; this.tacu[0].actual += element.octact; this.tacu[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacu[0].anterior += element.novpas; this.tacu[0].actual += element.novact; this.tacu[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacu[0].anterior += element.dicpas; this.tacu[0].actual += element.dicact; this.tacu[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tacuclisub[0].anterior += element.enepas; this.tacuclisub[0].actual += element.eneact; this.tacuclisub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacuclisub[0].anterior += element.febpas; this.tacuclisub[0].actual += element.febact; this.tacuclisub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacuclisub[0].anterior += element.marpas; this.tacuclisub[0].actual += element.maract; this.tacuclisub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacuclisub[0].anterior += element.abrpas; this.tacuclisub[0].actual += element.abract; this.tacuclisub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacuclisub[0].anterior += element.maypas; this.tacuclisub[0].actual += element.mayact; this.tacuclisub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacuclisub[0].anterior += element.junpas; this.tacuclisub[0].actual += element.junact; this.tacuclisub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacuclisub[0].anterior += element.julpas; this.tacuclisub[0].actual += element.julact; this.tacuclisub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacuclisub[0].anterior += element.agopas; this.tacuclisub[0].actual += element.agoact; this.tacuclisub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacuclisub[0].anterior += element.seppas; this.tacuclisub[0].actual += element.sepact; this.tacuclisub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacuclisub[0].anterior += element.octpas; this.tacuclisub[0].actual += element.octact; this.tacuclisub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacuclisub[0].anterior += element.novpas; this.tacuclisub[0].actual += element.novact; this.tacuclisub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacuclisub[0].anterior += element.dicpas; this.tacuclisub[0].actual += element.dicact; this.tacuclisub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tacutotsub[0].anterior += element.enepas; this.tacutotsub[0].actual += element.eneact; this.tacutotsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacutotsub[0].anterior += element.febpas; this.tacutotsub[0].actual += element.febact; this.tacutotsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacutotsub[0].anterior += element.marpas; this.tacutotsub[0].actual += element.maract; this.tacutotsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacutotsub[0].anterior += element.abrpas; this.tacutotsub[0].actual += element.abract; this.tacutotsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacutotsub[0].anterior += element.maypas; this.tacutotsub[0].actual += element.mayact; this.tacutotsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacutotsub[0].anterior += element.junpas; this.tacutotsub[0].actual += element.junact; this.tacutotsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacutotsub[0].anterior += element.julpas; this.tacutotsub[0].actual += element.julact; this.tacutotsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacutotsub[0].anterior += element.agopas; this.tacutotsub[0].actual += element.agoact; this.tacutotsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacutotsub[0].anterior += element.seppas; this.tacutotsub[0].actual += element.sepact; this.tacutotsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacutotsub[0].anterior += element.octpas; this.tacutotsub[0].actual += element.octact; this.tacutotsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacutotsub[0].anterior += element.novpas; this.tacutotsub[0].actual += element.novact; this.tacutotsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacutotsub[0].anterior += element.dicpas; this.tacutotsub[0].actual += element.dicact; this.tacutotsub[0].ppto += element.dicppto; }
    });
    // temporada
    this.tacumul.forEach( element => {
      if ( this.mes === 1  ) { this.tacu[0].anterior += element.enepas; this.tacu[0].actual += element.eneact; this.tacu[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacu[0].anterior += element.febpas; this.tacu[0].actual += element.febact; this.tacu[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacu[0].anterior += element.marpas; this.tacu[0].actual += element.maract; this.tacu[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacu[0].anterior += element.abrpas; this.tacu[0].actual += element.abract; this.tacu[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacu[0].anterior += element.maypas; this.tacu[0].actual += element.mayact; this.tacu[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacu[0].anterior += element.junpas; this.tacu[0].actual += element.junact; this.tacu[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacu[0].anterior += element.julpas; this.tacu[0].actual += element.julact; this.tacu[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacu[0].anterior += element.agopas; this.tacu[0].actual += element.agoact; this.tacu[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacu[0].anterior += element.seppas; this.tacu[0].actual += element.sepact; this.tacu[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacu[0].anterior += element.octpas; this.tacu[0].actual += element.octact; this.tacu[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacu[0].anterior += element.novpas; this.tacu[0].actual += element.novact; this.tacu[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacu[0].anterior += element.dicpas; this.tacu[0].actual += element.dicact; this.tacu[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tacutemsub[0].anterior += element.enepas; this.tacutemsub[0].actual += element.eneact; this.tacutemsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacutemsub[0].anterior += element.febpas; this.tacutemsub[0].actual += element.febact; this.tacutemsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacutemsub[0].anterior += element.marpas; this.tacutemsub[0].actual += element.maract; this.tacutemsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacutemsub[0].anterior += element.abrpas; this.tacutemsub[0].actual += element.abract; this.tacutemsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacutemsub[0].anterior += element.maypas; this.tacutemsub[0].actual += element.mayact; this.tacutemsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacutemsub[0].anterior += element.junpas; this.tacutemsub[0].actual += element.junact; this.tacutemsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacutemsub[0].anterior += element.julpas; this.tacutemsub[0].actual += element.julact; this.tacutemsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacutemsub[0].anterior += element.agopas; this.tacutemsub[0].actual += element.agoact; this.tacutemsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacutemsub[0].anterior += element.seppas; this.tacutemsub[0].actual += element.sepact; this.tacutemsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacutemsub[0].anterior += element.octpas; this.tacutemsub[0].actual += element.octact; this.tacutemsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacutemsub[0].anterior += element.novpas; this.tacutemsub[0].actual += element.novact; this.tacutemsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacutemsub[0].anterior += element.dicpas; this.tacutemsub[0].actual += element.dicact; this.tacutemsub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tacutotsub[0].anterior += element.enepas; this.tacutotsub[0].actual += element.eneact; this.tacutotsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tacutotsub[0].anterior += element.febpas; this.tacutotsub[0].actual += element.febact; this.tacutotsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tacutotsub[0].anterior += element.marpas; this.tacutotsub[0].actual += element.maract; this.tacutotsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tacutotsub[0].anterior += element.abrpas; this.tacutotsub[0].actual += element.abract; this.tacutotsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tacutotsub[0].anterior += element.maypas; this.tacutotsub[0].actual += element.mayact; this.tacutotsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tacutotsub[0].anterior += element.junpas; this.tacutotsub[0].actual += element.junact; this.tacutotsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tacutotsub[0].anterior += element.julpas; this.tacutotsub[0].actual += element.julact; this.tacutotsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tacutotsub[0].anterior += element.agopas; this.tacutotsub[0].actual += element.agoact; this.tacutotsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tacutotsub[0].anterior += element.seppas; this.tacutotsub[0].actual += element.sepact; this.tacutotsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tacutotsub[0].anterior += element.octpas; this.tacutotsub[0].actual += element.octact; this.tacutotsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tacutotsub[0].anterior += element.novpas; this.tacutotsub[0].actual += element.novact; this.tacutotsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tacutotsub[0].anterior += element.dicpas; this.tacutotsub[0].actual += element.dicact; this.tacutotsub[0].ppto += element.dicppto; }
    });
    // proyeccion
    this.proyec.forEach( element => {
      if ( this.mes === 1  ) { this.tpro[0].anterior += element.enepas; this.tpro[0].actual += element.eneact; this.tpro[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tpro[0].anterior += element.febpas; this.tpro[0].actual += element.febact; this.tpro[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tpro[0].anterior += element.marpas; this.tpro[0].actual += element.maract; this.tpro[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tpro[0].anterior += element.abrpas; this.tpro[0].actual += element.abract; this.tpro[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tpro[0].anterior += element.maypas; this.tpro[0].actual += element.mayact; this.tpro[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tpro[0].anterior += element.junpas; this.tpro[0].actual += element.junact; this.tpro[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tpro[0].anterior += element.julpas; this.tpro[0].actual += element.julact; this.tpro[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tpro[0].anterior += element.agopas; this.tpro[0].actual += element.agoact; this.tpro[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tpro[0].anterior += element.seppas; this.tpro[0].actual += element.sepact; this.tpro[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tpro[0].anterior += element.octpas; this.tpro[0].actual += element.octact; this.tpro[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tpro[0].anterior += element.novpas; this.tpro[0].actual += element.novact; this.tpro[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tpro[0].anterior += element.dicpas; this.tpro[0].actual += element.dicact; this.tpro[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tproclisub[0].anterior += element.enepas; this.tproclisub[0].actual += element.eneact; this.tproclisub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tproclisub[0].anterior += element.febpas; this.tproclisub[0].actual += element.febact; this.tproclisub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tproclisub[0].anterior += element.marpas; this.tproclisub[0].actual += element.maract; this.tproclisub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tproclisub[0].anterior += element.abrpas; this.tproclisub[0].actual += element.abract; this.tproclisub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tproclisub[0].anterior += element.maypas; this.tproclisub[0].actual += element.mayact; this.tproclisub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tproclisub[0].anterior += element.junpas; this.tproclisub[0].actual += element.junact; this.tproclisub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tproclisub[0].anterior += element.julpas; this.tproclisub[0].actual += element.julact; this.tproclisub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tproclisub[0].anterior += element.agopas; this.tproclisub[0].actual += element.agoact; this.tproclisub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tproclisub[0].anterior += element.seppas; this.tproclisub[0].actual += element.sepact; this.tproclisub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tproclisub[0].anterior += element.octpas; this.tproclisub[0].actual += element.octact; this.tproclisub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tproclisub[0].anterior += element.novpas; this.tproclisub[0].actual += element.novact; this.tproclisub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tproclisub[0].anterior += element.dicpas; this.tproclisub[0].actual += element.dicact; this.tproclisub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tprototsub[0].anterior += element.enepas; this.tprototsub[0].actual += element.eneact; this.tprototsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tprototsub[0].anterior += element.febpas; this.tprototsub[0].actual += element.febact; this.tprototsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tprototsub[0].anterior += element.marpas; this.tprototsub[0].actual += element.maract; this.tprototsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tprototsub[0].anterior += element.abrpas; this.tprototsub[0].actual += element.abract; this.tprototsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tprototsub[0].anterior += element.maypas; this.tprototsub[0].actual += element.mayact; this.tprototsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tprototsub[0].anterior += element.junpas; this.tprototsub[0].actual += element.junact; this.tprototsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tprototsub[0].anterior += element.julpas; this.tprototsub[0].actual += element.julact; this.tprototsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tprototsub[0].anterior += element.agopas; this.tprototsub[0].actual += element.agoact; this.tprototsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tprototsub[0].anterior += element.seppas; this.tprototsub[0].actual += element.sepact; this.tprototsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tprototsub[0].anterior += element.octpas; this.tprototsub[0].actual += element.octact; this.tprototsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tprototsub[0].anterior += element.novpas; this.tprototsub[0].actual += element.novact; this.tprototsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tprototsub[0].anterior += element.dicpas; this.tprototsub[0].actual += element.dicact; this.tprototsub[0].ppto += element.dicppto; }
    });
    // temporada
    this.tproyec.forEach( element => {
      if ( this.mes === 1  ) { this.tpro[0].anterior += element.enepas; this.tpro[0].actual += element.eneact; this.tpro[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tpro[0].anterior += element.febpas; this.tpro[0].actual += element.febact; this.tpro[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tpro[0].anterior += element.marpas; this.tpro[0].actual += element.maract; this.tpro[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tpro[0].anterior += element.abrpas; this.tpro[0].actual += element.abract; this.tpro[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tpro[0].anterior += element.maypas; this.tpro[0].actual += element.mayact; this.tpro[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tpro[0].anterior += element.junpas; this.tpro[0].actual += element.junact; this.tpro[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tpro[0].anterior += element.julpas; this.tpro[0].actual += element.julact; this.tpro[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tpro[0].anterior += element.agopas; this.tpro[0].actual += element.agoact; this.tpro[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tpro[0].anterior += element.seppas; this.tpro[0].actual += element.sepact; this.tpro[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tpro[0].anterior += element.octpas; this.tpro[0].actual += element.octact; this.tpro[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tpro[0].anterior += element.novpas; this.tpro[0].actual += element.novact; this.tpro[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tpro[0].anterior += element.dicpas; this.tpro[0].actual += element.dicact; this.tpro[0].ppto += element.dicppto; }
      // sub
      if ( this.mes === 1  ) { this.tprotemsub[0].anterior += element.enepas; this.tprotemsub[0].actual += element.eneact; this.tprotemsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tprotemsub[0].anterior += element.febpas; this.tprotemsub[0].actual += element.febact; this.tprotemsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tprotemsub[0].anterior += element.marpas; this.tprotemsub[0].actual += element.maract; this.tprotemsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tprotemsub[0].anterior += element.abrpas; this.tprotemsub[0].actual += element.abract; this.tprotemsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tprotemsub[0].anterior += element.maypas; this.tprotemsub[0].actual += element.mayact; this.tprotemsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tprotemsub[0].anterior += element.junpas; this.tprotemsub[0].actual += element.junact; this.tprotemsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tprotemsub[0].anterior += element.julpas; this.tprotemsub[0].actual += element.julact; this.tprotemsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tprotemsub[0].anterior += element.agopas; this.tprotemsub[0].actual += element.agoact; this.tprotemsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tprotemsub[0].anterior += element.seppas; this.tprotemsub[0].actual += element.sepact; this.tprotemsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tprotemsub[0].anterior += element.octpas; this.tprotemsub[0].actual += element.octact; this.tprotemsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tprotemsub[0].anterior += element.novpas; this.tprotemsub[0].actual += element.novact; this.tprotemsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tprotemsub[0].anterior += element.dicpas; this.tprotemsub[0].actual += element.dicact; this.tprotemsub[0].ppto += element.dicppto; }
      // tot
      if ( this.mes === 1  ) { this.tprototsub[0].anterior += element.enepas; this.tprototsub[0].actual += element.eneact; this.tprototsub[0].ppto += element.eneppto; }
      if ( this.mes === 2  ) { this.tprototsub[0].anterior += element.febpas; this.tprototsub[0].actual += element.febact; this.tprototsub[0].ppto += element.febppto; }
      if ( this.mes === 3  ) { this.tprototsub[0].anterior += element.marpas; this.tprototsub[0].actual += element.maract; this.tprototsub[0].ppto += element.marppto; }
      if ( this.mes === 4  ) { this.tprototsub[0].anterior += element.abrpas; this.tprototsub[0].actual += element.abract; this.tprototsub[0].ppto += element.abrppto; }
      if ( this.mes === 5  ) { this.tprototsub[0].anterior += element.maypas; this.tprototsub[0].actual += element.mayact; this.tprototsub[0].ppto += element.mayppto; }
      if ( this.mes === 6  ) { this.tprototsub[0].anterior += element.junpas; this.tprototsub[0].actual += element.junact; this.tprototsub[0].ppto += element.junppto; }
      if ( this.mes === 7  ) { this.tprototsub[0].anterior += element.julpas; this.tprototsub[0].actual += element.julact; this.tprototsub[0].ppto += element.julppto; }
      if ( this.mes === 8  ) { this.tprototsub[0].anterior += element.agopas; this.tprototsub[0].actual += element.agoact; this.tprototsub[0].ppto += element.agoppto; }
      if ( this.mes === 9  ) { this.tprototsub[0].anterior += element.seppas; this.tprototsub[0].actual += element.sepact; this.tprototsub[0].ppto += element.sepppto; }
      if ( this.mes === 10 ) { this.tprototsub[0].anterior += element.octpas; this.tprototsub[0].actual += element.octact; this.tprototsub[0].ppto += element.octppto; }
      if ( this.mes === 11 ) { this.tprototsub[0].anterior += element.novpas; this.tprototsub[0].actual += element.novact; this.tprototsub[0].ppto += element.novppto; }
      if ( this.mes === 12 ) { this.tprototsub[0].anterior += element.dicpas; this.tprototsub[0].actual += element.dicact; this.tprototsub[0].ppto += element.dicppto; }
    });
  }

}

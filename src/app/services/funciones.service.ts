import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { LoadingController, AlertController, ToastController } from '@ionic/angular';
import { DatosService } from './datos.service';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

@Injectable({
  providedIn: 'root'
})
export class FuncionesService {

  loader: any;
  loading: any;
  usuario: any;
  cliente: any;

  public decimalPipe: DecimalPipe;

  constructor( private loadingCtrl: LoadingController,
               private alertCtrl: AlertController,
               private datos: DatosService,
               private toastCtrl: ToastController,
               @Inject(LOCALE_ID) private locale: string ) {
  }

  textoSaludo() {
    const dia   = new Date();
    if ( dia.getHours() >= 8  && dia.getHours() < 12 ) {
      return 'buenos días ';
    } else if ( dia.getHours() >= 12 && dia.getHours() < 19 ) {
      return 'buenas tardes ';
    } else {
      return 'buenas noches '; }
  }

  cargaEspera( milisegundos?) {
    this.loader = this.loadingCtrl.create({
      duration: ( milisegundos != null && milisegundos !== undefined ? milisegundos : 3000 )
      });
    this.loader.present();
  }

  descargaEspera() {
    this.loader.dismiss();
  }

  async msgAlert( titulo, texto ) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      /*subHeader: 'Subtitle',*/
      message: texto,
      buttons: ['OK']
    });
    await alert.present();
  }

  async muestraySale( cTexto, segundos, posicion? ) {
    const toast = await this.toastCtrl.create({
      message: cTexto,
      duration: 1500 * segundos,
      position: posicion || 'middle'
    });
    toast.present();
  }

  nombreMes( nMes ) {
    if      ( nMes === 1 ) { return 'Enero'     ; }
    else if ( nMes === 2 ) { return 'Febrero'   ; }
    else if ( nMes === 3 ) { return 'Marzo'     ; }
    else if ( nMes === 4 ) { return 'Abril'     ; }
    else if ( nMes === 5 ) { return 'Mayo'      ; }
    else if ( nMes === 6 ) { return 'Junio'     ; }
    else if ( nMes === 7 ) { return 'Julio'     ; }
    else if ( nMes === 8 ) { return 'Agosto'    ; }
    else if ( nMes === 9 ) { return 'Septiembre'; }
    else if ( nMes === 10) { return 'Octubre'   ; }
    else if ( nMes === 11) { return 'Noviembre' ; }
    else if ( nMes === 12) { return 'Diciembre' ; }
    else                   { return 'n/n'       ; }
  }
  
  /**
   * Realiza el formato de número de acuerdo a los parámetros indicados.
   * Si un parámetro no va
   * @param numero Dato numérico a formatear. Por defecto cero.
   * @param decimales Número de decimales requerido para el formato. Por defecto cero.
   * @param locale Localización utilizada para el formateo de números. por defecto 'es' (localización para idioma español).
   * @param prefijo (opcional) Texto que se antepone al número a formatear. No incluye espacios separadores.
   * @param sufijo (opcional)  Texto que se pone al final del número a formatear. No incluye espacios separadores.
   */
  formatoNumero( numero: number | 0, decimales: number | 0, locale: string | 'es', prefijo?: string, sufijo?: string): string {
    let result: string = numero.toString(10);
    result  = this.decimalPipe.transform(parseFloat(result), `1.${decimales}-${decimales}`, locale);
    prefijo = (prefijo) ? prefijo : '';
    sufijo  = (sufijo)  ? sufijo  : '';
    return prefijo + `${result}` + sufijo;
  }

  formato( input, vacio  ) {
    // let num = input.value.replace(/\./g, '' );
    let num = input;
    if ( !isNaN(num) ) {
      num = num.toString().split('').reverse().join('').replace(/(?=\d*\.?)(\d{3})/g, '$1.');
      num = num.split('').reverse().join('').replace(/^[\.]/, '');
      input = num;
    }
  }

}
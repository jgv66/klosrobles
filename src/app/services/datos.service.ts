import { HttpClient } from '@angular/common/http';

import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  cualquierDato: any;
  xDato: any;
  loading: any;
  params: any;

  // puerto: LOS ROBLES
  url    = 'http://23.239.29.171';  /* servidor linode */
  puerto = ':3080';                  /* puerto: LOSROBLES */

  constructor (private loadingCtrl: LoadingController,
               private http: HttpClient,
               private dataLocal: Storage ) {
  }

  async showLoading() {
    this.loading = await this.loadingCtrl.create({
                      message: 'Rescatando',
                      duration: 7000
                    });
    return await this.loading.present();
  }

  /* FUNCIONES LOCALES */
  saveDatoLocal( token: any, dato: any ) {
    this.dataLocal.set( token, JSON.stringify(dato) );
  }

  async readDatoLocal(token: any) {
    const dato = await this.dataLocal.get(token).then( data => data );
    this.cualquierDato = !dato ? undefined : JSON.parse( dato );
    return this.cualquierDato;
  }

  async __readDatoLocal(token: any) {
    const dato = await this.dataLocal.get(token)
      .then( data => { this.cualquierDato = !dato ? undefined : JSON.parse( dato );
                       return this.cualquierDato; } );
  }

  guardaMientras( dato ) {
    this.cualquierDato = dato;
  }

  rescataMientras() {
    return this.cualquierDato ;
  }

  deleteDatoLocal( token: any ) {
    this.dataLocal.remove( token ).then( () => console.log( 'DatosService.deleteDatoLocal EXISTE y REMOVIDO->', token ) );
  }

  /* FUNCIONES REMOTAS */
  getDataEmpresas() {
    return this.http.get( this.url + '' + this.puerto + '/ws_empresas' );
  }

  postDataSP( data ) {
    this.showLoading();
    // console.log(data.sp);
    // console.log(this.url + this.puerto + data.sp, data);
    return this.http.post( this.url + this.puerto + data.sp, data )
      .pipe( tap( value =>  { if ( this.loading ) { this.loading.dismiss(); } }) );
  }

  postDataSPSilent( data ) {
    // console.log(data.sp);
    // console.log(this.url + this.puerto + data.sp, data);
    return this.http.post( this.url + this.puerto + data.sp, data );
  }

} 
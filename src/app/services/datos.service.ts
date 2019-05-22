import { HttpClient } from '@angular/common/http';

import { Injectable, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { tap } from 'rxjs/operators';
import { environment, SERVER_URL, PORT_URL } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DatosService implements OnInit {

  cualquierDato: any;
  xDato: any;
  loading: any;
  params: any;

  // puerto: LOS ROBLES
  url    = '';  /* servidor linode:  http://23.239.29.171 */
  puerto = '';  /* puerto: ':3080'  com dos puntos por delante... estoy flojo */

  constructor( private loadingCtrl: LoadingController,
               private http: HttpClient,
               private dataLocal: Storage ) {
    this.url    = SERVER_URL;
    this.puerto = PORT_URL;
  }

  ngOnInit() {}

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
    return this.http.post( this.url + this.puerto + data.sp, data )
      .pipe( tap( value =>  { if ( this.loading ) { this.loading.dismiss(); } }) );
  }

  postDataSPSilent( data ) {
    return this.http.post( this.url + this.puerto + data.sp, data );
  }

  /*
    sitio mindicador.cl  tipo="uf"  dia=dd-mm-aaaa  año=aaaa
    https://mindicador.cl/api/{tipo_indicador}
    https://mindicador.cl/api/{tipo_indicador}/{dd-mm-yyyy}
    https://mindicador.cl/api/{tipo_indicador}/{yyyy}
  */
  valorPeriodo( periodo, indicador ) {
    return this.http.get( 'https://mindicador.cl/api/' + indicador + '/' + periodo );
  }
  valorDia( fecha, indicador ) {
    return this.http.get( 'https://mindicador.cl/api/' + indicador + '/' + fecha );
  }


}

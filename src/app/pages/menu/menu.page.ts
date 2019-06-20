import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  abierto = false;
  usuario;
  reportes: Reportes[] = [
    { icono: 'pulse',   redirectTo: '/reppyl',     nombre: 'Profit & Loss Statement Accumulated' },
    { icono: 'pie',     redirectTo: '/reppylmes',  nombre: 'Profit & Loss Statement Monthly' },
    { icono: 'trophy',  redirectTo: '/eerr',       nombre: 'Estados de Resultado' }
  ];

  indicadores = [
    { icono: 'glasses',    url: '/indicador', dato: 'uf',                 nombre: 'Valor UF' },
    { icono: 'rainy',      url: '/indicador', dato: 'utm',                nombre: 'Valor UTM' },
    { icono: 'lock',       url: '/indicador', dato: 'dolar',              nombre: 'Valor USD Observado' },
    { icono: 'podium',     url: '/indicador', dato: 'euro',               nombre: 'Valores EURO' },
    { icono: 'restaurant', url: '/indicador', dato: 'tasa_desempleo',     nombre: 'Tasas de Desempleo' },
    { icono: 'stats',      url: '/indicador', dato: 'imacec',             nombre: 'Imacec' },
    { icono: 'switch',     url: '/indicador', dato: 'ipc',                nombre: 'IPC' },
  ];

  constructor( private router: Router,
               private datos: DatosService ) {
      this.abierto = false;
  }

  ngOnInit() {
    this.usrdata();
  }

  async usrdata() {
    const usr = await this.datos.readDatoLocal( 'KRLR_usuario' )
        .then( data =>  { try {
                            this.usuario = data;
                          } catch (error) {
                            this.usuario = [];
                          }
                        },
               error => { console.log(error); } );
  }

  onClick( item ) {
    this.router.navigate( [ item.url ] );
  }

  indicadorClick( item ) {
    this.router.navigate( [ item.url, item.dato ] );
  }

}

interface Reportes {
  icono: string;
  nombre: string;
  redirectTo: string;
}

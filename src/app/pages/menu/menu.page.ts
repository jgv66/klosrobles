import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DatosService } from '../../services/datos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  usuario;
  reportes: Reportes[] = [
    { icono: 'pulse',   redirectTo: '/reppyl',    nombre: 'Profit & Loss Statement Accumulated' },
  ];

  constructor( private router: Router,
               private datos: DatosService ) { }

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
}

interface Reportes {
  icono: string;
  nombre: string;
  redirectTo: string;
}

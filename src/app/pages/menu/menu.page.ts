import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  reportes: Reportes[] = [
    { icono: 'pulse', redirectTo: '/reppyl', nombre: 'Resumen P&L Clientes Acumulado' },
  ];

  constructor( private router: Router ) { }

  ngOnInit() {
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

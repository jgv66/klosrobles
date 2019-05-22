import { Component, OnInit, Input } from '@angular/core';
import { PopoverController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-vistas',
  templateUrl: './vistas.page.html',
  styleUrls: ['./vistas.page.scss'],
})
export class VistasPage implements OnInit {

  @Input() empresas;

  clientesgt = [];
  vistas =  [
              { descripcion: 'Millones'          , opcion: 'M'  },
              { descripcion: 'Fracción de millón', opcion: 'F'  },
              { descripcion: 'Porcentaje'        , opcion: '%'  },
              { descripcion: 'Fracción + %'      , opcion: 'F%' },
              { descripcion: 'Millones + %'      , opcion: 'M%' }
            ];

  constructor( private popoverCtrl: PopoverController,
               private params: NavParams ) {
    this.clientesgt = this.params.get( 'clientesgt' );
  }

  ngOnInit() {
    if ( this.clientesgt ) {
      this.vistas = [];
      this.clientesgt.forEach( element => {
        this.vistas.push( { descripcion: element.sigla, opcion: element.cliente } );
      });
    }
  }

  onClick( pos ) {
    // console.log( this.vistas[pos].descripcion );
    this.popoverCtrl.dismiss({ vista: this.vistas[pos].opcion });
  }


}

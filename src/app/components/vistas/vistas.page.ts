import { Component, OnInit } from '@angular/core';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-vistas',
  templateUrl: './vistas.page.html',
  styleUrls: ['./vistas.page.scss'],
})
export class VistasPage implements OnInit {

  vistas =  [
              { descripcion: 'Millones'          , opcion: 'M'  },
              { descripcion: 'Fracción de millón', opcion: 'F'  },
              { descripcion: 'Porcentaje'        , opcion: '%'  },
              { descripcion: 'Fracción + %'      , opcion: 'F%' },
              { descripcion: 'Millones + %'      , opcion: 'M%' }
            ];

  constructor( private popoverCtrl: PopoverController ) { }

  ngOnInit() {
  }

  onClick( pos ) {
    console.log( this.vistas[pos].descripcion );
    this.popoverCtrl.dismiss({ vista: this.vistas[pos].opcion });
  }

}

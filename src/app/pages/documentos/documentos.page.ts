import { Component, OnInit, Input } from '@angular/core';
import { DatosService } from '../../services/datos.service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-documentos',
  templateUrl: './documentos.page.html',
  styleUrls: ['./documentos.page.scss'],
})
export class DocumentosPage implements OnInit {

  @Input() dato;
  @Input() mes;
  @Input() caso;

  documentos = [];
  cargando   = false;

  constructor( private datos: DatosService,
               private modalCtrl: ModalController ) { }

  ngOnInit() {
    if ( this.caso === 'SF' ) {
      this.cargaDocumentos();
    }
  }

  cargaDocumentos() {
    this.cargando = true;
    this.datos.postDataSPSilent( {sp:       '/ws_mgxprod_doc',
                                  empresa:  '01',
                                  periodo:  ((new Date()).getFullYear()).toString(),
                                  mes:      this.mes.toString(),
                                  producto: this.dato.producto } )
        .subscribe( (data: any) => { this.documentos = data.datos;
                                     this.cargando = false; } );
  }

  salir() {
    this.modalCtrl.dismiss();
  }

}

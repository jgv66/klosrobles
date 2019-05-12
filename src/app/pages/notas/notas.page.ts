import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { FuncionesService } from '../../services/funciones.service';

@Component({
  selector: 'app-notas',
  templateUrl: './notas.page.html',
  styleUrls: ['./notas.page.scss'],
})
export class NotasPage implements OnInit {

  @Input() periodo;
  @Input() mes;
  @Input() empresa;

  notas     = [];
  editando  = undefined;
  titulo    = '';
  contenido = '';
  usuario   = [];

  constructor( private modalCtrl: ModalController,
               private funciones: FuncionesService,
               private datos: DatosService ) {
  }

  ngOnInit() {
    this.cargaNotas();
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

  salir() {
    this.modalCtrl.dismiss();
  }

  cargaNotas() {
    return this.datos.postDataSP( { sp:      '/ws_pylnotas',
                                    periodo: this.periodo.toString(),
                                    mes:     this.mes.toString() } )
      .subscribe( data => {
          const rs = data['datos'];
          this.notas = rs;
      });
  }

  salirComentario() {
    this.editando   = undefined;
    this.titulo     = '';
    this.contenido  = '';
  }

  grabarComentario() {
    if ( this.titulo === '' || this.contenido === '' ) {
      this.funciones.msgAlert( 'ATENCION', 'Debe ingresar ambos datos solicitados, de lo contrario el comentario no será grabado.' );
    } else {
      // quitando cremillas
      this.titulo    = this.titulo.replace( /'/, '' );
      this.contenido = this.contenido.replace( /'/, '' );
      // enviando a grabar
      return this.datos.postDataSP( { sp:       '/ws_pylnotasgraba',
                                      empresa:  this.usuario.empresa,
                                      periodo:  this.periodo.toString(),
                                      mes:      this.mes.toString(),
                                      titulo:   this.titulo,
                                      texto:    this.contenido,
                                      creador:  this.usuario.nombre
                                    } )
        .subscribe( data => {
          const rs = data['datos'];
          // console.log(rs);
          this.editando = undefined;
          this.titulo   = '';
          this.contenido = '';
          this.cargaNotas();
        });
    }
  }

}

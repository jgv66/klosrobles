import { Component, OnInit, Input } from '@angular/core';
import { ModalController, AlertController } from '@ionic/angular';
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
  @Input() informe;

  notas     = [];
  editando  = undefined;
  idModif   = 0;
  titulo    = '';
  contenido = '';
  usuario:  any = [];

  constructor( private modalCtrl: ModalController,
               private funciones: FuncionesService,
               private datos: DatosService,
               private alertCtrl: AlertController ) {
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
                                    informe: this.informe, 
                                    mes:     this.mes.toString() } )
      .subscribe( (data: any) => {
          const rs = data.datos;
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
                                      creador:  this.usuario.nombre,
                                      informe:  this.informe,
                                      id:       this.idModif.toString()
                                    } )
        .subscribe( ( data: any ) => {
          const rs = data.datos;
          // console.log(rs);
          this.editando   = undefined;
          this.idModif    = 0;
          this.titulo     = '';
          this.contenido  = '';
          this.cargaNotas();
        });
    }
  }

  modificar( nota ) {
    if ( nota.creador.trim() === this.usuario.nombre.trim() ) {
      this.editando   = true;
      this.idModif    = nota.id;
      this.titulo     = nota.titulo;
      this.contenido  = nota.nota;
    } else {
      this.funciones.msgAlert( 'ATENCION', 'Este comentario solo puede ser editado por su creador.');
    }
  }

  // pyl_notas_borra
  async eliminar( nota ) {
    if ( nota.creador.trim() === this.usuario.nombre.trim() ) {
      const alert = await this.alertCtrl.create({
        header: 'ATENCION',
        message: 'Esta nota será <strong>ELIMINADA</strong>...',
        buttons: [
          {
            text: 'No, me equivoqué',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {}
          },
          {
            text: 'Sí, elimine !',
            handler: () => { this.eliminaNota( nota );  }
          }
        ]
      });
      await alert.present();
    } else {
      this.funciones.msgAlert( 'ATENCION', 'Este comentario solo puede ser eliminado por su creador.');
    }
  }

  eliminaNota( nota ) {
    this.datos.postDataSP({ sp: '/ws_pylnotasborra',
                            id: nota.id.toString() })
        .subscribe( ( data: any ) => { this.editando = undefined;
                                       this.idModif  = 0;
                                       this.cargaNotas();
                                     });
  }

}

import { Component, OnInit } from '@angular/core';
import { FuncionesService } from 'src/app/services/funciones.service';
import { DatosService } from 'src/app/services/datos.service';
import { Router } from '@angular/router';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {

  email     = '';
  clave     = '';
  empresa   = '01';
  usuario   = [];
  uniqueID  = undefined;

  constructor( private funciones: FuncionesService,
               private datos: DatosService,
               private router: Router,
               private uniqueDeviceID: UniqueDeviceID ) { }

  ngOnInit() {
    this.usrdata();
    this.uniqueDeviceID.get()
        .then(  (uuid: any)   => { console.log('uniqueDeviceID', uuid); this.uniqueID = uuid; }  )
        .catch( (error: any)  => console.log('problemas->', error) );
  }

  async usrdata() {
    const usr = await this.datos.readDatoLocal( 'KRLR_usuario' )
        .then(  data =>  { try {
                            this.usuario = data;
                            this.email   = data.EMAIL;
                          } catch (error) {
                            this.email = '';
                          }
                        },
                error => { console.log(error); } );
  }

  login() {
    this.datos.postDataSP( {  sp:      '/ws_usuarios',
                              user:    this.email,
                              pass:    this.clave,
                              empresa: this.empresa,
                              uuid:    this.uniqueID } )
      .subscribe( data => {
        const rs = data['datos'][0];
        try {
            if ( rs.usuario ) { this.datos.saveDatoLocal( 'KRLR_usuario', rs ); }
            this.router.navigate( ['/menu'] );
        } catch (error) {
          this.funciones.msgAlert('ATENCION', 'Usuario y Clave no coinciden');
        }
      },
      err => {
        console.error('ERROR Verifique los datos ingresados', err);
      });
  }

}

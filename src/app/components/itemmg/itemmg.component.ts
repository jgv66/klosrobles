import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-itemmg',
  templateUrl: './itemmg.component.html',
  styleUrls: ['./itemmg.component.scss'],
})
export class ItemmgComponent implements OnInit {

  @Input() informacion = [];
  @Input() informacionTotal = [];
  @Input() fila: number;
  @Input() periodo: number;
  @Input() inmerse: boolean;

  documentos = [];

  constructor( private modalCtrl: ModalController ) {}

  ngOnInit() {}

  OnOff( fila) {
    fila.show = !fila.show;
  }

  async inmersion( dato ) {
    
    console.log( dato );
  }

}

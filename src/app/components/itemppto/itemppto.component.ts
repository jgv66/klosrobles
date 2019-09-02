
import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-itemppto',
  templateUrl: './itemppto.component.html',
  styleUrls: ['./itemppto.component.scss'],
})
export class ItempptoComponent implements OnInit {

  @Input() informacion: [];
  @Input() periodo: number;
  @Input() mes: number;
  @Input() concepto: string;
  @Input() fila: number;
  @Input() inmerse: boolean;

  constructor() {}

  ngOnInit() {}

  OnOff( fila ) {
    // console.log( fila );
    if ( !this.inmerse ) {
      fila.show = !fila.show;
    }
  }
  
}

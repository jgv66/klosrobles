import { Component, OnInit, Input } from '@angular/core';

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

  constructor() {}

  ngOnInit() {}

  OnOff( fila) {
    fila.show = !fila.show;
  }

}

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-doblealto',
  templateUrl: './doblealto.component.html',
  styleUrls: ['./doblealto.component.scss'],
})
export class DoblealtoComponent implements OnInit {

  @Input() tamano;
  @Input() numero;
  @Input() porcentaje;

  constructor() {}

  ngOnInit() {}

}

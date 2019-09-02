import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-itempyl',
  templateUrl: './itempyl.component.html',
  styleUrls: ['./itempyl.component.scss'],
})
export class ItempylComponent implements OnInit {

  @Input() informacion = [];
  @Input() concepto: string;
  @Input() fila: number;

  constructor() {}

  ngOnInit() {}

}

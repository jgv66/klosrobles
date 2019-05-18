import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dobletext',
  templateUrl: './dobletext.component.html',
  styleUrls: ['./dobletext.component.scss'],
})
export class DobletextComponent implements OnInit {

  @Input() tamano: string;
  @Input() linea1: string;
  @Input() linea2: string;

  constructor() { }

  ngOnInit() {}

}

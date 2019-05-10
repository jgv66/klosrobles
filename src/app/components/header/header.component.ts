import { Component, OnInit, Input } from '@angular/core';
import { increaseElementDepthCount } from '@angular/core/src/render3/state';
import { SelectMultipleControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() titulo;

  constructor() { }

  ngOnInit() {}



}

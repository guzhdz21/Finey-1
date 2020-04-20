import { Component, OnInit, Input } from '@angular/core';
import { GastoMayor } from '../../interfaces/interfaces';

@Component({
  selector: 'app-gastos-mayores',
  templateUrl: './gastos-mayores.page.html',
  styleUrls: ['./gastos-mayores.page.scss'],
})
export class GastosMayoresPage implements OnInit {

  @Input() gastosMayores: GastoMayor;
  
  constructor() { }

  ngOnInit() {
  }

}

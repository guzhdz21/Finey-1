import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray } from '../interfaces/interfaces';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient) { }

  getRubros() {
    return this.http.get<Rubro[]>('/assets/data/rubros.json');
  }

  getColores() {
    return this.http.get<ColorArray>('/assets/data/colores.json');
  }

  getEtiquetasTab1() {
    return this.http.get<LabelArray>('/assets/data/etiquetastab1.json');
  }
}

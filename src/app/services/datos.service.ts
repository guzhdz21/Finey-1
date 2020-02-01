import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray, UsuarioLocal, Gasto } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient, 
              private storage: Storage) { }

  usuarioLocal: UsuarioLocal;

  getRubros() {
    return this.http.get<Rubro[]>('/assets/data/rubros.json');
  }

  getColores() {
    return this.http.get<ColorArray>('/assets/data/colores.json');
  }

  getEtiquetasTab1() {
    return this.http.get<LabelArray>('/assets/data/etiquetastab1.json');
  }

  getGastosJson() {
    return this.http.get<Gasto[]>('/assets/data/gastos.json');
  }

  guardarUsuarioInfo(usuario: UsuarioLocal) {
    this.usuarioLocal = usuario;
    this.storage.set("Usuario", this.usuarioLocal);
    console.log(this.usuarioLocal);
  }

  guardarPrimeraVez(primera: boolean)
  {
    this.storage.set("Primera", primera);
  }
}

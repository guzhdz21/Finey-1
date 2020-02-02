import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Rubro, ColorArray, LabelArray, UsuarioLocal, Gasto } from '../interfaces/interfaces';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  constructor(private http: HttpClient, 
              private storage: Storage) { 
    this.cargarPrimeraVez();
    this.cargarDatos();
  }

  usuarioLocal: UsuarioLocal;
  usuarioCarga: UsuarioLocal = 
  {
    nombre: '',
    sexo: '',
    tipoIngreso: '',
    ingresoCantidad: null,
    gastos: [
      {
        nombre: '',
        cantidad: null,
        tipo: '',
        porcentaje: '1',
        icono: '',
        margenMin: null,
        margenMax: null
      }
      
    ]
  };
  primera: boolean;

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
    this.storage.set('Usuario', this.usuarioLocal);
  }

  guardarPrimeraVez(primera: boolean)
  {
    this.storage.set('Primera', primera);
  }

   async cargarPrimeraVez()
  {
    const primera = await this.storage.get('Primera');
    if(primera === false) {
      this.primera = primera;
    } else {
      this.primera = true;
    }
  }

   async cargarDatos() {
    const Usuario = await this.storage.get('Usuario');
    if(Usuario)
    {
      this.usuarioCarga = Usuario;
    }
  }

}

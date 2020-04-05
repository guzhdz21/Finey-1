import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, SubTest, Pregunta, Respuesta } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-internet',
  templateUrl: './internet.component.html',
  styleUrls: ['./internet.component.scss'],
})
export class InternetComponent implements OnInit {

  constructor(public datosService: DatosService) { }

  ngOnInit() {
    this.subTestsEncontrados = [];
    this.puntajeAlcanzar = [];
    this.puntajeActual = [];
    this.permisos = [];
    this.permisos[1] = false;
    this.permisos[2] = false;
    this.permisos[3] = false;
  }

  subTestsEncontrados: SubTest[];
  puntajeAlcanzar: number[];
  puntajeActual: number[];
  permisos: boolean[];

  subTestEncontrado: SubTest = {
    idTest: null,
    id: null,
    preguntas: [{
        idSubTest: null,
        id: null,
        preguntaTexto: '',
        respuestas: [{
            respuestaTexto: '',
            valor: null
          }]
      }]
  }

  obtenerSubTest(idSubTest: number, subTestEncontrado: SubTest){
    this.datosService.getSubTests().subscribe(val => {
      val.forEach(element => {
        if(idSubTest == element.id && element.idTest == 5){
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest){
                subTestEncontrado.preguntas.push(elementPreg); 
              }
           });
        });
      }
  });
});
return subTestEncontrado;
}

async subTest1(event){
  if(event.detail.value == 'si'){
    this.subTestsEncontrados[1] = await this.obtenerSubTest(1, this.subTestEncontrado);
    this.permisos[1] = true;
  }
  else{
    this.permisos[1] = false;
  }
}

async subTest2(event){
  if(event.detail.value == 'si'){
    this.subTestsEncontrados[2] = await this.obtenerSubTest(2, this.subTestEncontrado);
    this.permisos[2] = true;
  }
  else{
    this.permisos[2] = false;
  }
}

async subTest3(event){
  if(event.detail.value == 'si'){
    this.subTestsEncontrados[3] = await this.obtenerSubTest(3, this.subTestEncontrado);
    this.permisos[3] = true;
  }
  else{
    this.permisos[3] = false;
  }
}

}

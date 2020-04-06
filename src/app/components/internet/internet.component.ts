import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, SubTest, Pregunta, Respuesta } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-internet',
  templateUrl: './internet.component.html',
  styleUrls: ['./internet.component.scss'],
})
export class InternetComponent implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService ) { }

  ngOnInit() {
    this.subTestsEncontrados = [];
    this.puntajeAlcanzar = [];
    this.puntajeActual = [];
    this.permisos = [];
    this.valoresRadio = [];
    this.permisos[1] = false;
    this.permisos[2] = false;
    this.permisos[3] = false;
    this.puntajeActual[1] = 0; 
    this.puntajeActual[2] = 0; 
    this.puntajeActual[3] = 0; 
  }

  subTestsEncontrados: SubTest[];
  puntajeAlcanzar: number[];
  puntajeActual: number[];
  permisos: boolean[];
  valoresRadio: number[];

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

radioButtonChange(event, idPregunta, idSubTest){

  //SUBTEST1
  switch(idSubTest){
    
  case 1:

    if(idPregunta == 1){ //SI ES EL PUNTAJE A ALCANZAR
      this.puntajeAlcanzar[idSubTest] = parseInt(event.detail.value);
    } 
    else { //SI ES EL PUNTAJE ACTUAL
      this.valoresRadio[idPregunta] = parseInt(event.detail.value);
    }

  break;

  }

    }

checkBoxChange(event, idPregunta, idSubTest){

  //SUBTEST1
  if(idSubTest == 1){
    if(event.currentTarget.checked == true){
      this.puntajeActual[idSubTest] += parseInt(event.detail.value); 
    }
    else{
      this.puntajeActual[idSubTest] -= parseInt(event.detail.value); 
    }
  }
}

testFinalizado(){
  //SUBTEST1
  this.puntajeActual[1] += this.valoresRadio[3]; //LO DEL CHECK + LO DEL RADIO BUTTON, ES 3 PUES 1 ES LA DE ALCANZAR, 2 EL CHECK
  if(this.puntajeActual[1] < this.puntajeAlcanzar[1]){
      this.accionesService.presentAlertConsejo("Consejo de Internet" , "Tu plan de internet es muy grande para el tiempo y uso " +
      "que le das, te aconsejamos contratar un plan mas pequeño o cambiarte de compañia para gastar lo necesario", true);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Internet justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }

}

}

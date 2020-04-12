import { Component, OnInit, Input } from '@angular/core';
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
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.puntajeAlcanzar = []; //Arreglo que guarda los valores d epuntaje a alcanzar 
    this.puntajeActual = [];
    this.permisos = [];
    this.valoresRadio = [[],[],[]];
    this.permisos[0] = false;
    this.permisos[1] = false;
    this.permisos[2] = false;
    this.puntajeActual[0] = 0; 
    this.puntajeActual[1] = 0; 
    this.puntajeActual[2] = 0; 
  }

  subTestsEncontrados: SubTest[];
  puntajeAlcanzar: number[];
  puntajeActual: number[];
  permisos: boolean[];
  valoresRadio: number[][];

  subTestEncontrado1: SubTest = {
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

  subTestEncontrado2: SubTest = {
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

  subTestEncontrado3: SubTest = {
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
    this.subTestsEncontrados[0] = await this.obtenerSubTest(1, this.subTestEncontrado1);
    this.permisos[0] = true;
  }
  else{
    this.permisos[0] = false;
  }
}

async subTest2(event){
  if(event.detail.value == 'si'){
    this.subTestsEncontrados[1] = await this.obtenerSubTest(2, this.subTestEncontrado2);
    this.permisos[1] = true;
  }
  else{
    this.permisos[1] = false;
  }
}

async subTest3(event){
  if(event.detail.value == 'si'){
    this.subTestsEncontrados[2] = await this.obtenerSubTest(3, this.subTestEncontrado3);
    this.permisos[2] = true;
  }
  else{
    this.permisos[2] = false;
  }
}

radioButtonChange(event, idPregunta, idSubTest){

  //SUBTEST1
  switch(idSubTest){
    
  case 1:
    if(idPregunta == 1){ //SI ES EL PUNTAJE A ALCANZAR
      this.puntajeAlcanzar[idSubTest - 1] = parseInt(event.detail.value);
    } 
    else { //SI ES EL PUNTAJE ACTUAL
      this.valoresRadio[idSubTest - 1][idPregunta - 1] = parseInt(event.detail.value);
    }
  break;

  case 2:
    if(idPregunta == 1){
      this.puntajeAlcanzar[idSubTest - 1] = parseInt(event.detail.value);
    }
    else{
      this.valoresRadio[idSubTest - 1][idPregunta - 1] = parseInt(event.detail.value);
    }
  break;

  case 3:
    this.puntajeAlcanzar[idSubTest - 1] = 10;
    this.valoresRadio[idSubTest - 1][idPregunta - 1] = parseInt(event.detail.value);
    console.log("putooo: " + this.valoresRadio[idSubTest - 1][idPregunta - 1]);
  break;
  }

    }

checkBoxChange(event, idPregunta, idSubTest){

  //SUBTEST1
  if(idSubTest == 1){
    if(event.currentTarget.checked == true){
      this.puntajeActual[idSubTest - 1] += parseInt(event.detail.value); 
    }
    else{
      this.puntajeActual[idSubTest - 1 ] -= parseInt(event.detail.value); 
    }
  }
}

testFinalizado(){
  //SUBTEST1
if(this.permisos[0]){
  this.puntajeActual[0] += this.valoresRadio[0][2]; //LO DEL CHECK + LO DEL RADIO BUTTON, ES 3 PUES 1 ES LA DE ALCANZAR, 2 EL CHECK
  if(this.puntajeActual[0] <= this.puntajeAlcanzar[0]){
      this.accionesService.presentAlertConsejo("Consejo de Internet" , "Tu plan de internet es muy grande para el tiempo y uso " +
      "que le das, te aconsejamos contratar un plan mas pequeño o cambiarte de compañia para gastar lo necesario", false);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Internet justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

  //SUBTEST2
if(this.permisos[1]){
  this.puntajeActual[1] = this.valoresRadio[1][1] + this.valoresRadio[1][2] + this.valoresRadio[1][3]; //LO DEL CHECK + LO DEL RADIO BUTTON, ES 3 PUES 1 ES LA DE ALCANZAR, 2 EL CHECK
  console.log("Valor a alcanzar:" + this.puntajeAlcanzar[1]);
  console.log("Valor actual:" + this.puntajeActual[1]);
  if(this.puntajeActual[1] <= this.puntajeAlcanzar[1]){
    if(this.puntajeActual[1] <= 16){
      if(this.permisos[0]){
        var consejo = "Se ha determinado que no ves practicamente la television o solo pocos canales y horas, por lo que" +
        " te sugerimos cancelar el servicio de cable y buscar tus programas favoritos en internet y evitar el gasto innecesario";
      }
      else{
        var consejo = "Se ha determinado que no ves practicamente la television o solo pocos canales y horas, por lo que" +
        " te sugerimos cancelar el servicio de cable y si quieres ver tus programas favoritos contratar internet o un servicio" +
        " de streaming y verlos desde ahí";
      }
    }
    else{
      var consejo = "Se ha determinado que usas poco la televisión o no ves realmente la mayoría de los canales que se ofrecen" +
      " en tu plan, por lo tanto te sugerimos contratar un plan con menos canales o cancelarlo";
    }
      this.accionesService.presentAlertConsejo("Consejo de Cable" , consejo , false);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Cable justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

  //SUBTEST3
if(this.permisos[2]){
  this.puntajeActual[2] = this.valoresRadio[2][0] + this.valoresRadio[2][1]; //LO DEL CHECK + LO DEL RADIO BUTTON, ES 3 PUES 1 ES LA DE ALCANZAR, 2 EL CHECK
  console.log("Valor a alcanzar:" + this.puntajeAlcanzar[2]);
  console.log("Valor actual:" + this.puntajeActual[2]);
  if(this.puntajeActual[2] <= this.puntajeAlcanzar[2]){
      this.accionesService.presentAlertConsejo("Consejo de Internet" , "Se ha determinado que el servicio de telefonía no lo usas" +
      " para nada, te recomendamos que lo canceles o busques otra compañia que no lo ofrezca dentro de sus planes," +
      " usa solo el celular para comunicarte y asi evitarás el gasto innecesario", true);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Telefonía justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

}

}

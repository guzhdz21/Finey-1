import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';

@Component({
  selector: 'app-educacion',
  templateUrl: './educacion.component.html',
  styleUrls: ['./educacion.component.scss'],
})
export class EducacionComponent implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService) { }

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.respuestasContestadas= [[],[],[]];
    this.subTestEncontrado1 = this.obtenerSubTest(1, this.subTestEncontrado1);
    this.subTestsEncontrados.push(this.subTestEncontrado1);
    this.subTestEncontrado2 = this.obtenerSubTest(2, this.subTestEncontrado2);
    this.subTestsEncontrados.push(this.subTestEncontrado2);
  }

subTestsEncontrados: SubTest[];
respuestasContestadas: number[][];
permiso: number = 0;

subTestEncontrado1: SubTest = {
  idTest: null,
  id: null,
  preguntas: [{
    idTest: null,
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
    idTest: null,
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
      if(idSubTest == element.id && element.idTest == 7){
        console.log("cumple")
        subTestEncontrado.idTest = element.idTest;
        subTestEncontrado.id = element.id;
        subTestEncontrado.preguntas = [];
        this.datosService.getPreguntas().subscribe(preg => {

          preg.forEach(elementPreg => {

            if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 7){
              subTestEncontrado.preguntas.push(elementPreg); 
              console.log("pusheado");
            }
         });
      });
    }
});
});
return subTestEncontrado;
}

radioButtonChange(event, idPregunta, idSubTest){
this.respuestasContestadas[idSubTest-1][idPregunta] = parseInt(event.detail.value);
}

filtro1(event, idPregunta, idSubTest){
  this.permiso = parseInt(event.detail.value);
  }


testFinalizado(){

if(this.respuestasContestadas[0][1] == 1 && this.respuestasContestadas[0][2] == 1){
  var consejo1 = " • Tus gastos de educacion estan justificados debido a que pagas varias colegiaturas, aunque aun asi te podriamos dar unos cuantos consejos mas <br><br>"
}
else{
  var consejo1 = "";
}

if(this.respuestasContestadas[1][1] == 1){
  
  switch(this.respuestasContestadas[1][2]){
    case 1:
      var consejo2 = " • Te recomendamos que consideres otras opciones de instituciones con mejor nivel educativo y no tan costosas, aunque estén un poco más retiradas de su casa <br><br>"
    break;

    case 2:
      var consejo2 = " • Te recomendamos que valores otras instituciones por nivel educativo y costo, y que valores si es cierta esa recomendación que te dieron acerca de la institución y si vale la pena <br><br>"
    break;

    case 3:
      var consejo2 = " • Te recomendamos que valores realmente el nivel educativo y costo de la institución, por que es lo que de verdad importa, las instalaciones no deberían influir mucho en la elección de una institución educativa <br><br>"
    break;
  
    default:
      var consejo2 = "";
    break;
  }
}
else{
  var consejo2 = "";
}

if(this.respuestasContestadas[1][3] == 1){
  var consejo3 = " • Te recomendamos que hables con tu institución educativa o la de tus hijos segun sea el caso, sobre alguna posibilidad de beca <br><br>"
}
else{
  var consejo3 = "";
}

if(this.respuestasContestadas[1][4] == 1){
  var consejo4 = " • Te recomendamos que compares el precio de los libros de texto que son físicos con los que son digitales, en ocasiones suele convenir comprarlos en digital o si a fuerzas los necesitas en físico puedes hablar con alguien de un grado mayor para que te venda los libros de texto a un precio menor en caso de que ellos ya no los necesitaran <br><br>"
}
else{
  var consejo4 = "";
}

if(this.respuestasContestadas[1][5] == 1){
  var consejo5 = " • Te recomendamos que siempre trates de adquirir cursos en oferta, o que antes de adquirir un curso verifiques si en youtube hay alguna guia parecida a lo que necesitas <br><br>"
}
else{
  var consejo5 = "";
}

if(this.respuestasContestadas[1][6] == 1){
  var consejo6 = " • Te recomendamos siempre comprar tus útiles o los de tus hijos en vacaciones en una cantidad considerable o en paquetes para que te o les duren hasta el siguiente semestre o año <br><br>"
}
else{
  var consejo6 = "";
}


this.accionesService.presentAlertGenerica("Consejos de Educación ", consejo1 + consejo2 + consejo3 + consejo4 + consejo5 + consejo6);    
}

}

import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';

@Component({
  selector: 'app-alimentos',
  templateUrl: './alimentos.component.html',
  styleUrls: ['./alimentos.component.scss'],
})
export class AlimentosComponent implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService) { }

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.respuestasContestadas= [[],[],[]];
    this.subTestEncontrado1 = this.obtenerSubTest(1, this.subTestEncontrado1);
    this.subTestsEncontrados.push(this.subTestEncontrado1);
  }

subTestsEncontrados: SubTest[];
respuestasContestadas: number[][];

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

obtenerSubTest(idSubTest: number, subTestEncontrado: SubTest){
  this.datosService.getSubTests().subscribe(val => {
    val.forEach(element => {
      if(idSubTest == element.id && element.idTest == 2){
        console.log("cumple")
        subTestEncontrado.idTest = element.idTest;
        subTestEncontrado.id = element.id;
        subTestEncontrado.preguntas = [];
        this.datosService.getPreguntas().subscribe(preg => {

          preg.forEach(elementPreg => {

            if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 2){
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


testFinalizado(){

if(this.respuestasContestadas[0][1] == 1){
  var consejo1 = " • Te recomendamos comer lo menos posible en la calle, puedes prepararte tu comida en tu casa y llevartela en un recipiente sin problemas  <br><br>"
}
else{
  var consejo1 = "";
}

if(this.respuestasContestadas[0][2] == 1){
  var consejo2 = " • Te recomendamos cocinar tus alimentos una o dos veces para toda la semana y congelar lo que es para los días posteriores (por ejemplo; cocinar todos los lunes la comida para toda la semana) <br><br>"
}
else{
  var consejo2 = "";
}

if(this.respuestasContestadas[0][3] == 1){
  var consejo3 = " • Te recomendamos siempre antés de ir al supermercado revisar tus alimentos faltantes, hacer una lista de lo que deberás comprar y apegarte a ella <br><br>"
}
else{
  var consejo3 = "";
}

if(this.respuestasContestadas[0][4] == 1 || this.respuestasContestadas[0][4] == 2){
  var consejo4 = " • Te recomendamos hacer lo posible por no ir con tus hijos al supermercado, pues cuando los llevas los gastos se incrementan de una manera considerable <br><br>"
}
else{
  var consejo4 = "";
}

if(this.respuestasContestadas[0][5] == 1){
  var consejo5 = " • Te recomendamos nunca ir al supermercado con hambre o sin haber comido, pues comprarás más cosas de las que necesitas por el simple hecho de no haber comido, pues todo se te antojará <br><br>"
}
else{
  var consejo5 = "";
}

if(this.respuestasContestadas[0][6] == 1){
  var consejo6 = " • Te recomendamos ir al supermercado los días de ofertas y estar atento también a los cupones que a veces ofrecen  <br><br>"
}
else{
  var consejo6 = "";
}

if(this.respuestasContestadas[0][7] == 1){
  var consejo7 = " • Te recomendamos nunca comprar agua embotellada, siempre llevarse agua en un recipiente desde tu casa, pues si comparamos los precios de la agua embotellada" +
  " al de tu garrafón, es un abuso cantidad-precio <br><br>"
}
else{
  var consejo7 = "";
}

if(this.respuestasContestadas[0][8] == 1){
  var consejo8 = " • Te recomendamos siempre tratar de comprar en mayoreo, en lugares como Sams o Costco donde los precios son menores llevandote grandes cantidades" +
  " (por ejemplo; comprar 20 huevos a un buen precio unitario, que comprar 2 huevos cada 2 dias en la tiendita de la esquina) <br><br>"
}
else{
  var consejo8 = "";
}


this.accionesService.presentAlertGenerica("Consejos de Alimentos", consejo1 + consejo2 + consejo3 + consejo4 + consejo5 + consejo6 + consejo7 + consejo8);    
}

}

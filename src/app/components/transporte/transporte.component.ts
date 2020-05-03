import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';

@Component({
  selector: 'app-transporte',
  templateUrl: './transporte.component.html',
  styleUrls: ['./transporte.component.scss'],
})
export class TransporteComponent implements OnInit {

  constructor( public datosService: DatosService,
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
    this.permisos[3] = false;
    this.puntajeActual[0] = 0; 
    this.puntajeActual[1] = 0; 
    this.puntajeActual[2] = 0; 
    this.puntajeActual[3] = 0; 
    this.YaAbiertos = [];
    this.YaAbiertos[0] = false;
    this.YaAbiertos[1] = false;
    this.YaAbiertos[2] = false;
    this.YaAbiertos[3] = false;
  }

  subTestsEncontrados: SubTest[];
  puntajeAlcanzar: number[];
  puntajeActual: number[];
  permisos: boolean[];
  valoresRadio: number[][];
  YaAbiertos: boolean[]; //Para saber si ya fue abierto o no el subtest
  cuantasVeces: number = 0;
  distancia: number = 0;
  bienevales: number = 0;
  vecesUber: number = 0;
  horasPico: number = 0;
  sinPrisa: number = 0;

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

  subTestEncontrado3: SubTest = {
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

  subTestEncontrado4: SubTest = {
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
        if(idSubTest == element.id && element.idTest == 4){
          console.log("cumple")
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 4){
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

  //SUBTEST1
  switch(idSubTest){

  case 2:
    if(idPregunta == 3){
      this.puntajeAlcanzar[2] = parseInt(event.detail.value);
    }
    else{
      this.puntajeActual[2] = parseInt(event.detail.value);
    }
  break;

  case 3:
    if(idPregunta == 1){
     this.cuantasVeces = event.detail.value; 
    }
    else if(idPregunta == 2){
     this.distancia = event.detail.value;
    }
    else{
      this.bienevales = event.detail.value;
    }
  break;

  case 4:
    if(idPregunta == 1){
      this.vecesUber = event.detail.value; 
     }
     else if(idPregunta == 2){
      this.horasPico = event.detail.value;
     }
     else{
       this.sinPrisa = event.detail.value;
     }
  break;

  }

    }

async checkBoxChange(event, preguntaID, subtestID){
  switch(subtestID){
    case 1:
      if(event.currentTarget.checked == true){
        this.puntajeActual[0] += parseInt(event.detail.value); 
        console.log(this.puntajeActual[0]);
      }
      else{
        this.puntajeActual[0] -= parseInt(event.detail.value); 
        console.log(this.puntajeActual[0]);
      }
    break;

    case 2:
      if(event.currentTarget.checked == true){
        this.puntajeActual[1] += parseInt(event.detail.value); 
        console.log(this.puntajeActual[1]);
      }
      else{
        this.puntajeActual[1] -= parseInt(event.detail.value); 
        console.log(this.puntajeActual[1]);
      }
    break;
  }
}

async checkBoxInicial(event, idSub){
    switch(idSub){
      case 0:
        console.log("YaAbiertos: " + this.YaAbiertos[0]);
       if(this.YaAbiertos[0] == false){
         console.log("true");
        this.subTestsEncontrados[0] = await this.obtenerSubTest(1, this.subTestEncontrado1);
          this.YaAbiertos[0]=true;
          this.permisos[0] = true;
       }
       else{
        console.log("false");
        this.permisos[0] = false;
        this.YaAbiertos[0] = false;
       }
      break;

      case 1:
        if(this.YaAbiertos[1] == false){
          this.subTestsEncontrados[1] = await this.obtenerSubTest(2, this.subTestEncontrado2);
          this.permisos[1] = true;
          this.YaAbiertos[1]=true;
        }
        else{
          this.permisos[1] = false;
          this.YaAbiertos[1] = false;
        }
      break;

      case 2:
        if(this.YaAbiertos[2] == false){
          this.subTestsEncontrados[2] = await this.obtenerSubTest(3, this.subTestEncontrado3);
          this.permisos[2] = true;
          this.YaAbiertos[2]=true;
          }
          else{
            this.permisos[2] = false;
            this.YaAbiertos[2] = false;
          }
      break;

      case 3:
        if(this.YaAbiertos[3] == false){
          this.subTestsEncontrados[3] = await this.obtenerSubTest(4, this.subTestEncontrado4);
          this.permisos[3] = true;
          this.YaAbiertos[3]=true;
          }
          else{
            this.permisos[3] = false;
            this.YaAbiertos[3] = false;
          }
      break;
    }
}

testFinalizado(){
  //SUBTEST1
if(this.permisos[0]){
  
  if(this.puntajeActual[0] <= 10){
      this.accionesService.presentAlertConsejo("Consejo de Motocicleta" , "Se ha determinado que practicamente no usas tu motocicleta" +
      ", por lo que te sugerimos comprarte una bici o viajar en camión, si no es opcion esto para ti, entonces lleva tu moto" +
      " al mecanico, pues está gastando demasiada gasolina", false);
  }
  else if(this.puntajeActual[0] <= 20 && this.puntajeActual[0] >= 11){
    this.accionesService.presentAlertConsejo("Consejo de Motocicleta" , "Te aconsejamos comprarte una motocicleta que no gaste tanta" + 
    " gasolina, o que la que tienes actualmente la lleves con un mecanico para que revise por que gasta tanta gasolina", false);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Motocicleta justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

  //SUBTEST2
if(this.permisos[1]){

  var aconsejalo = false;

  if(this.puntajeActual[2] <= this.puntajeAlcanzar[2]){
    var consejo2 = " • Se ha determinado que posees un vehiculo más grande de lo que lo necesitas, pues no transportas demasiada gente" +
    " como para justificar tener una camioneta, te recomendamos comprar un carro o vehiculo que gaste menos gasolina <br><br>";
    aconsejalo = true;
  }
  else{
    var consejo2 = "";
  }
  if(this.puntajeActual[1] <= 10){
    var consejo = " • Se ha determinado que no usas casi practicamente tu vehiculo, te recomendamos adquirir una motocicleta" + 
    " o vehiculo que gaste menos gasolina, o simplemente en esas salidas ocasionales que tienes, tomar el transporte público <br><br>";
    aconsejalo = true;
  }
  else if(this.puntajeActual[1] <= 20 && this.puntajeActual[1] >= 11){
        var consejo = " • Se ha determinado que tu vehiculo está gastando más gasolina de la necesaria para las actividades que realizas" + 
        " por lo que te aconsejamos llevarlo al mecanico a que lo revise o te compres un vehiculo que gaste menos gasolina <br><br>";
    aconsejalo=true;
      }
  else{
    var consejo = "";
  }

  if(aconsejalo){
    this.accionesService.presentAlertConsejo("Consejo de Vehículo propio" , consejo + consejo2 , false);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Vehiculo propio justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

  //SUBTEST3
if(this.permisos[2]){

  var aconsejalo2 = false;

  if(this.cuantasVeces == 1 && this.distancia == 1){
    var consejo3 = " • Hemos concluido que usas muchos transportes públicos para tan poca distancia, por lo que te recomendamos" +
    "comprar una bicicleta, patineta, patines o simplemente buscar rutas de transporte publico en las que lo tomes menos veces" +
    " de lo que lo haces ahora <br><br>"
    aconsejalo2 = true;
  }
  else{
    var consejo3 = "";
  }
  if(this.bienevales == 1){
    var consejo4 = " • Te recomendamos de corazón que tramites tus bienevales, cuanto antés mejor, no sabes lo mucho que te ahorrarás <br><br>"
    aconsejalo2 = true;
  }
  else{
    var consejo4 = "";
  }

  if(aconsejalo2){
    this.accionesService.presentAlertConsejo("Consejo de Transporte público" , consejo3 + consejo4, true);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Transporte público justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas <br><br>");
  }
}

//SUBTEST 4//
if(this.permisos[3]){
  var aconsejalo3;

  if(this.vecesUber == 1){
    var consejo5 = " • Hemos determinado que adquieres muchos servicios de uber/taxi, por lo que te aconsejamos comprarte un" +
    " automovil o motocicleta, aun que no lo creas, gastarás menos a largo plazo si haces esto <br><br>"
    aconsejalo3 = true;
  }
  else{
    var consejo5 = "";
  }

  if(this.horasPico == 1){
    var consejo6 = " • Hemos determinado que a lo mejor gastas demasiado en el servicio de uber/taxi por tomarlo constantemente" +
    " en horas pico, te aconsejamos tomar el servicio una hora antes de lo que lo haces habitualmente para que la tarifa de dicho servicio no sea tan alta, " +
    "o cuando no tengas prisa tomar transporte público <br><br>"
    aconsejalo3 = true;
  }
  else{
    var consejo6 = "";
  }

  if(this.sinPrisa == 1){
    var consejo7 = " • Debido a que no tienes prisa normalmente cuando usas este servicio, te recomendamos tomarlo en su formato compartido," +
    " como un uber pool, o compartir el taxi con alguien que vaya a un destino parecido al tuyo, o simplemente toma el transprte público <br><br>"
    aconsejalo3 = true;
  }
  else{
    var consejo7 = "";
  }

  if(aconsejalo3){
    this.accionesService.presentAlertConsejo("Consejo de Uber/taxi" , consejo5 + consejo6 + consejo7, true);
  }
  else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
    this.accionesService.presentAlertGenerica("Gasto de Uber/taxi justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
}

}

}
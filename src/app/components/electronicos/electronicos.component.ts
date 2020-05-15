import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';

@Component({
  selector: 'app-electronicos',
  templateUrl: './electronicos.component.html',
  styleUrls: ['./electronicos.component.scss'],
})
export class ElectronicosComponent implements OnInit {

  constructor( public datosService: DatosService,
              public accionesService: AccionesService) { }

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.puntajeAlcanzar = []; //Arreglo que guarda los valores d epuntaje a alcanzar 
    this.puntajeActual = [];
    this.permisos = [];
    this.valoresRadio = [[],[],[],[]];
    this.permisos[0] = false;
    this.permisos[1] = false;
    this.permisos[2] = false;
    this.puntajeActual[0] = 0; 
    this.puntajeActual[1] = 0; 
    this.puntajeActual[2] = 0; 
    this.YaAbiertos = [];
    this.YaAbiertos[0] = false;
    this.YaAbiertos[1] = false;
    this.YaAbiertos[2] = false;
    this.YaAbiertos[3] = false;
    this.respuestasContestadas = [[],[],[],[]];
  }

  subTestsEncontrados: SubTest[];
  puntajeAlcanzar: number[];
  puntajeActual: number[];
  permisos: boolean[];
  valoresRadio: number[][];
  YaAbiertos: boolean[]; //Para saber si ya fue abierto o no el subtest
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
        if(idSubTest == element.id && element.idTest == 6){
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 6){
                subTestEncontrado.preguntas.push(elementPreg); 
              }
           });
        });
      }
  });
});
return subTestEncontrado;
}

async checkBoxInicial(event, idSub){
  switch(idSub){
    case 0:
     if(this.YaAbiertos[0] == false){
      this.subTestsEncontrados[0] = await this.obtenerSubTest(1, this.subTestEncontrado1);
        this.YaAbiertos[0]=true;
        this.permisos[0] = true;
     }
     else{
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

radioButtonChange(event, idPregunta, idSubTest){

  switch(idSubTest){
    
  //SUBTEST1
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
  break;
  }

    }

    radioButtonChange2(event, idPregunta, idSubTest){
      this.respuestasContestadas[idSubTest-1][idPregunta] = parseInt(event.detail.value);
      }

      checkBoxChange(event, idPregunta, idSubTest){

          if(event.currentTarget.checked == true){
            this.puntajeActual[idSubTest - 1] += parseInt(event.detail.value); 
          }
          else{
            this.puntajeActual[idSubTest - 1 ] -= parseInt(event.detail.value); 
        }
      }

    testFinalizado(){

  //SUBTEST 1
    if(this.permisos[0] == true){
 
      this.puntajeActual[0] = this.puntajeActual[0] + this.valoresRadio[0][1] + this.valoresRadio[0][3] + this.valoresRadio[0][4] + this.valoresRadio[0][5] + this.valoresRadio[0][6] + this.valoresRadio[0][7];

      console.log("Puntaje actual:" + this.puntajeActual[0])
      console.log("Puntaje a alcanzar:" + this.puntajeAlcanzar[0])

     if(this.puntajeActual[0] >= this.puntajeAlcanzar[0]){
      this.accionesService.presentAlertGenerica("Gasto de celular justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas"); 
      }
      else{
         // GAMA ALTA
        if(this.puntajeAlcanzar[0] == 60){
          if(this.puntajeActual[0] >= 0 && this.puntajeActual[0] < 25){
            var consejo_1 = "Hemos determinado que posees un celular muy sofisticado y avanzado para el uso que le das asi que te recomendamos no comprar uno nuevo en mucho tiempo ya que este seguramente te dure, así evitarás un gasto en los próximos años"
          }
          else if(this.puntajeActual[0] >= 25 && this.puntajeActual[0] < 40){
            var consejo_1 = "Hemos determinado que posees un celular algo sofisticado y que realmente no necesitas todo lo que tiene, te aconsejamos que la próxima vez que compres un celular pidas consejo a un amigo experto en el tema o vayas a la tienda con una idea del que quieres para que no intenten venderte uno más caro que realmente no necesitas"
          }
          else if(this.puntajeActual[0] >= 40 && this.puntajeActual[0] < 59){
            var consejo_1 = "Hemos determinado que posees un celular un poco sofisticado, si le das un uso adecuado pero no el suficiente para justificar la compra, pero te aconsejamos vender tus celulares antiguos (si posees) para obtener una ganancia extra y la próxima vez investigar más sobre tus necesidades y el celular adecuado para ti, no fijarse en las marcas si no en lo que tiene el celular"
          }
        }

        //GAMA MEDIA
        if(this.puntajeAlcanzar[0] == 40){
          if(this.puntajeActual[0] <= 17){
            var consejo_1 = "Hemos determinado que posees un celular muy sofisticado y avanzado para el uso que le das asi que te recomendamos no comprar uno nuevo en mucho tiempo ya que este seguramente te dure, así evitarás un gasto en los próximos años"
          }
          else if(this.puntajeActual[0] >= 18 && this.puntajeActual[0] < 30){
            var consejo_1 = "Hemos determinado que posees un celular algo sofisticado y que realmente no necesitas todo lo que tiene, te aconsejamos que la próxima vez que compres un celular pidas consejo a un amigo experto en el tema o vayas a la tienda con una idea del que quieres para que no intenten venderte uno más caro que realmente no necesitas"
          }
          else if(this.puntajeActual[0] >= 30 && this.puntajeActual[0] < 39){
            var consejo_1 = "Hemos determinado que posees un celular un poco sofisticado, si le das un uso adecuado pero no el suficiente para justificar la compra, pero te aconsejamos vender tus celulares antiguos (si posees) para obtener una ganancia extra y la próxima vez investigar más sobre tus necesidades y el celular adecuado para ti, no fijarse en las marcas si no en lo que tiene el celular"
          }
        }

        //GAMA BAJA
        if(this.puntajeAlcanzar[0] == 25){
          var consejo_1 = "Te recomendamos no comprar un nuevo celular hasta que el que tienes actualmente deje de funcionar o ya no te sea útil"
        }

        this.accionesService.presentAlertGenerica("Consejo de Celular", consejo_1);
      }
    
}

//SUBTEST 2
if(this.permisos[1] == true){
 
  this.puntajeActual[1] = this.puntajeActual[1] + this.valoresRadio[1][1] + this.valoresRadio[1][3] + this.valoresRadio[1][4] + this.valoresRadio[1][5];

  console.log("Puntaje actual:" + this.puntajeActual[1])
  console.log("Puntaje a alcanzar:" + this.puntajeAlcanzar[1])

 if(this.puntajeActual[1] >= this.puntajeAlcanzar[1]){
  this.accionesService.presentAlertGenerica("Gasto de computadora justificado", "Aunque tu gasto este arriba de la media nacional" +
  ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas"); 
  }
  else{
     // GAMA GAMER
    if(this.puntajeAlcanzar[1] == 46){
      if(this.puntajeActual[1] >= 0 && this.puntajeActual[1] < 20){
        var consejo_2 = "Hemos determinado que posees una laptop/computadora muy sofisticada y avanzada para el uso que le das asi que te recomendamos venderlo inmediatamente y recuperar la inversión, considerar si realmente la necesitas, si es el caso entonces procura comprar una básica y del menor precio ya que no requieres de mucha potencia. Si no puedes venderla entonces te recomendamos no comprar una nueva en mucho tiempo ya que esta seguramente te dure, así evitarás un gasto en los próximos años"
      }
      else if(this.puntajeActual[1] >= 21 && this.puntajeActual[1] < 34){
        var consejo_2 = "Hemos determinado que posees una computadora/laptop algo sofisticada y que realmente no necesitas todo lo que tiene, te aconsejamos que la próxima vez que compres una computadora/laptop pidas consejo a un amigo experto en el tema o vayas a la tienda con una idea del producto  que quieres para que no intenten venderte uno más caro que realmente no necesitas, procura encontrar el producto que se atiende a tus necesidades y que no este tan caro, no te dejes llevar por lo que te dicen los vendedores"
      }
      else if(this.puntajeActual[1] >= 34 && this.puntajeActual[1] < 44 && this.valoresRadio[1][3] == 0){
        var consejo_2 = "Hemos determinado que posees una computadora un poco más sofisticada de lo que la requieres, si le das un uso adecuado pero no el suficiente para justificar la compra, pero te aconsejamos que para la próxima que armes la computadora comprando los componentes tu mismo, si no te crees capaz de hacerlo pídele ayuda a un experto para armarla y escogerla, pero el propósito es escoger las piezas tú mismo, verificando que necesitas que realice la computadora y lo económico de las mismas, además de esta manera cuando alguna pieza sea obsoleta puedes reemplazarla y saldrá más barato que comprar una nueva computadora"
      }
      else if(this.puntajeActual[1] >= 34 && this.puntajeActual[1] < 44 && this.valoresRadio[1][4] == 0){
        var consejo_2 = "Hemos determinado que posees una laptop un poco más sofisticada de lo que la quieres, si le das un uso adecuado pero no el suficiente para justificar la compra, pero te aconsejamos que para la próxima busques una laptop óptima para el uso que le das o buscar una que te asegure durabilidad de mínimo 2 años, así realizamos un gasto cada 2 años y menor al comprar una laptop que no tenga tantas características que no las aprovechas al 100%, procura buscar antes de comprar, siempre salir con una idea de que se desea compra"
      }
    }

    //GAMA PROFESIONAL
    if(this.puntajeAlcanzar[1] == 36){
      if(this.puntajeActual[1] <= 20){
        var consejo_2 = "Hemos determinado que posees una laptop/computadora muy sofisticada y avanzada para el uso que le das asi que te recomendamos venderlo inmediatamente y recuperar la inversión, considerar si realmente la necesitas, si es el caso entonces procura comprar una básica y del menor precio ya que no requieres de mucha potencia. Si no puedes venderla entonces te recomendamos no comprar una nueva en mucho tiempo ya que esta seguramente te dure, así evitarás un gasto en los próximos años"
      }
      else if(this.puntajeActual[1] >= 21 && this.puntajeActual[1] < 36){
        var consejo_2 = "Hemos determinado que posees una computadora/laptop algo sofisticada y que realmente no necesitas todo lo que tiene, te aconsejamos que la próxima vez que compres una computadora/laptop pidas consejo a un amigo experto en el tema o vayas a la tienda con una idea del producto  que quieres para que no intenten venderte uno más caro que realmente no necesitas, procura encontrar el producto que se atiende a tus necesidades y que no este tan caro, no te dejes llevar por lo que te dicen los vendedores"
      }
    }

    //GAMA MEDIA
    if(this.puntajeAlcanzar[1] == 22){
      if(this.puntajeActual[1] < 12){
        var consejo_2 = "Te recomendamos vender tu computadora y considerar si necesitas una computadora, por que el uso que le das es tan mínimo que es mejor tener solamente celular si lo que necesitas es estar conectado, si realmente la necesitas compra la mas barata y básica que encuentres ya que te servirá"
      }
      else{
      var consejo_2 = "Hemos determinado que posees una laptop/computadora muy sofisticada y avanzada para el uso que le das asi que te recomendamos venderlo inmediatamente y recuperar la inversión, considerar si realmente la necesitas, si es el caso entonces procura comprar una básica y del menor precio ya que no requieres de mucha potencia. Si no puedes venderla entonces te recomendamos no comprar una nueva en mucho tiempo ya que esta seguramente te dure, así evitarás un gasto en los próximos años"
      }
    }

    //GAMA BAJA
    if(this.puntajeAlcanzar[1] == 12){
      var consejo_2 = "Te recomendamos vender tu computadora y considerar si necesitas una computadora, por que el uso que le das es tan mínimo que es mejor tener solamente celular si lo que necesitas es estar conectado, si realmente la necesitas compra la mas barata y básica que encuentres ya que te servirá"
    }

    this.accionesService.presentAlertGenerica("Consejo de Computadora/laptop", consejo_2);
  }

}


    //SUBTEST 3
      if(this.permisos[2] == true){
 
      if((this.respuestasContestadas[2][1] == 1 || this.respuestasContestadas[2][1] == 2) && this.respuestasContestadas[2][2] == 1){
        var consejo1 = " • Te recomendamos que no compres una nueva televisión en mucho tiempo, ya que la que tienes es buena y no hace falta otra para el tiempo tan bajo que la usas, ademas deberias de consultar a alguien que sepa de tecnología antes de tu próxima compra de alguna televisión <br><br>"
      }
      else{
        var consejo1 = "";
      }
    
      this.accionesService.presentAlertGenerica("Consejo de Televisión", consejo1);    
    }
    
    //SUBTEST 4
    
  
    if(this.permisos[3] == true){
      if(this.respuestasContestadas[3][1] == 1 ){
        var consejo4 = " • Te recomendamos que compres unos audifonos bluetooth no muy caros, para que de esta manera te duren más y no dejen de funcionar por el cable en poco tiempo (no tendrá cable por ser bluetooth)<br><br>"
      }
      else{
        var consejo4 = "";
      }
    
      if(this.respuestasContestadas[3][2] == 1 && this.respuestasContestadas[3][3] == 1){
        var consejo5 = " • Hemos detectado que no necesitas unos audífonos tan sofisticados solo para escuchar música o ver videos en tu casa o en la de alguien más, por lo que para tu próxima compra de audífonos te recomendamos comprar de los chicos o unos más básicos <br><br>"
      }
      else{
        var consejo5 = "";
      }

      if(this.respuestasContestadas[3][1] == 2){
        var consejo6 = " • Te recomendamos no volver a comprar otros audifonos hasta que los tuyos ya no sirvan <br><br>"
      }
      else{
        var consejo6 = "";
      }
    
      this.accionesService.presentAlertGenerica("Consejos de Audifonos", consejo4 + consejo5 + consejo6);
    }
  }

}

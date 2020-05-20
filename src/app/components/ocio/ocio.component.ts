import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-ocio',
  templateUrl: './ocio.component.html',
  styleUrls: ['./ocio.component.scss'],
})
export class OcioComponent implements OnInit {

  constructor( public datosService: DatosService,
               public accionesService: AccionesService,
               private nav: NavController,
               private modalCtrl: ModalController) { }

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.respuestasContestadas = [[],[],[],[],[],[]];
    this.permisos = [];
    this.YaAbiertos = [];
    this.YaAbiertos[0] = false;
    this.YaAbiertos[1] = false;
    this.YaAbiertos[2] = false;
    this.YaAbiertos[3] = false;
    this.YaAbiertos[4] = false;
    this.YaAbiertos[5] = false;
    this.permisos[0] = false;
    this.permisos[1] = false;
    this.permisos[2] = false;
    this.permisos[3] = false;
    this.permisos[4] = false;
    this.permisos[5] = false;
    this.radioRequired = [[],[],[],[],[],[],[]];
    this.radioRequired[0][1] = true;
    this.radioRequired[0][2] = true;
    this.radioRequired[0][3] = true;
    this.radioRequired[1][1] = true;
    this.radioRequired[1][2] = true;
    this.radioRequired[1][3] = true;
    this.radioRequired[1][4] = true;
    this.radioRequired[2][1] = true;
    this.radioRequired[2][2] = true;
    this.radioRequired[2][3] = true;
    this.radioRequired[3][1] = true;
    this.radioRequired[3][2] = true;
    this.radioRequired[3][3] = true;
    this.radioRequired[4][1] = true;
    this.radioRequired[4][2] = true;
    this.radioRequired[4][3] = true;
    this.radioRequired[5][1] = true;
    this.radioRequired[5][2] = true;
  }

  subTestsEncontrados: SubTest[];
  respuestasContestadas: number[][];
  permisos: boolean[];
  valoresRadio: number[][];
  YaAbiertos: boolean[]; //Para saber si ya fue abierto o no el subtest
  radioRequired : boolean[][];
  subTestsAbiertos: number = 0;
  subTestsAconsejados: number = 0;
  sub1: boolean = false;
  sub2: boolean = false;
  sub3: boolean = false;
  sub4: boolean = false;
  sub5: boolean = false;
  sub6: boolean = false;

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

  subTestEncontrado5: SubTest = {
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

  subTestEncontrado6: SubTest = {
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
        if(idSubTest == element.id && element.idTest == 8){
          console.log("cumple")
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 8){
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

async checkBoxInicial(event, idSub){
  switch(idSub){
    case 0:
     if(this.YaAbiertos[0] == false){
      this.subTestsEncontrados[0] = await this.obtenerSubTest(1, this.subTestEncontrado1);
        this.YaAbiertos[0]=true;
        this.permisos[0] = true;
        this.subTestsAbiertos++;
     }
     else{
      this.permisos[0] = false;
      this.YaAbiertos[0] = false;
      this.subTestsAbiertos--;
     }
    break;

    case 1:
      if(this.YaAbiertos[1] == false){
        this.subTestsEncontrados[1] = await this.obtenerSubTest(2, this.subTestEncontrado2);
        this.permisos[1] = true;
        this.YaAbiertos[1]=true;
        this.subTestsAbiertos++;
      }
      else{
        this.permisos[1] = false;
        this.YaAbiertos[1] = false;
        this.subTestsAbiertos--;
      }
    break;

    case 2:
      if(this.YaAbiertos[2] == false){
        this.subTestsEncontrados[2] = await this.obtenerSubTest(3, this.subTestEncontrado3);
        this.permisos[2] = true;
        this.YaAbiertos[2]=true;
        this.subTestsAbiertos++;
        }
        else{
          this.permisos[2] = false;
          this.YaAbiertos[2] = false;
          this.subTestsAbiertos--;
        }
    break;

    case 3:
      if(this.YaAbiertos[3] == false){
        this.subTestsEncontrados[3] = await this.obtenerSubTest(4, this.subTestEncontrado4);
        this.permisos[3] = true;
        this.YaAbiertos[3]=true;
        this.subTestsAbiertos++;
        }
        else{
          this.permisos[3] = false;
          this.YaAbiertos[3] = false;
          this.subTestsAbiertos--;
        }
    break;

    case 4:
      if(this.YaAbiertos[4] == false){
        this.subTestsEncontrados[4] = await this.obtenerSubTest(5, this.subTestEncontrado5);
        this.permisos[4] = true;
        this.YaAbiertos[4]=true;
        this.subTestsAbiertos++;
        }
        else{
          this.permisos[4] = false;
          this.YaAbiertos[4] = false;
          this.subTestsAbiertos--;
        }
    break;

    case 5:
      if(this.YaAbiertos[5] == false){
        this.subTestsEncontrados[5] = await this.obtenerSubTest(6, this.subTestEncontrado6);
        this.permisos[5] = true;
        this.YaAbiertos[5]=true;
        this.subTestsAbiertos++;
        }
        else{
          this.permisos[5] = false;
          this.YaAbiertos[5] = false;
          this.subTestsAbiertos--;
        }
    break;
  }
}

radioButtonChange(event, idPregunta, idSubTest){
  this.radioRequired[idSubTest-1][idPregunta] = false;
  this.respuestasContestadas[idSubTest-1][idPregunta] = parseInt(event.detail.value);
  }

  testLibros(){
    //SUBTEST 1
    var justificado1 = true;
    if(this.permisos[0] == true){
    if(this.respuestasContestadas[0][1] == 1 || this.respuestasContestadas[0][1] == 2){
      var consejo1 = " • Te recomendamos que trates de intercambiar libros con tus amigos o que los vendas a algún conocido, tienda o por internet <br><br>"
      justificado1 = false;
    }
    else{
      var consejo1 = "";
    }
  
    if(this.respuestasContestadas[0][2] == 1){
      var consejo2 = " • Te recomendamos que compares los precios de los libros físicos con los digitales, y que decidas cuál te conviene <br><br>"
      justificado1 = false;
    }
    else{
      var consejo2 = "";
    }
  
    if(this.respuestasContestadas[0][3] == 1){
      var consejo3 = " • Te recomendamos que le des una oportunidad a los libros usados, hay varios lugares donde venden libros usados o puedes buscarlos en internet o igual puedes comprarle libros a alguien conocido <br><br>"
      justificado1 = false;
    }
    else{
      var consejo3 = "";
    }

    if(justificado1 == false){
      this.accionesService.presentAlertGenerica("Consejos de Libros", consejo1 + consejo2 + consejo3);  
    }
    else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
      this.accionesService.presentAlertGenerica("Gasto de Libros justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    }  
    this.comprobarSiRegresa(1);
  }
  }

  comprobarSiRegresa(idSubtest: number){
    switch(idSubtest){
      case 1:
        if(this.sub1 == false){
          this.sub1 = true;
          this.subTestsAconsejados++;
        }
      break;
  
      case 2:
        if(this.sub2 == false){
          this.sub2 = true;
          this.subTestsAconsejados++;
        }
      break;
  
      case 3:
        if(this.sub3 == false){
          this.sub3 = true;
          this.subTestsAconsejados++;
        }
      break;
  
      case 4:
        if(this.sub4 == false){
          this.sub4 = true;
          this.subTestsAconsejados++;
        }
      break;

      case 5:
        if(this.sub5 == false){
          this.sub5 = true;
          this.subTestsAconsejados++;
        }
      break;

      case 6:
        if(this.sub6 == false){
          this.sub6 = true;
          this.subTestsAconsejados++;
        }
      break;
    }
  
    if(this.subTestsAbiertos == this.subTestsAconsejados){
      this.modalCtrl.dismiss();
      this.nav.navigateRoot('/tabs/tab3');
    }
  }

  testPeliculas(){
    //SUBTEST 2
  var justificado2 = true;
  if(this.permisos[1] == true){
    if(this.respuestasContestadas[1][1] == 1 || this.respuestasContestadas[1][1] == 2){
      var consejo4 = " • Te recomendamos que siempre trates de ir al cine cuando haya promociones u ofertas, por ejemplo; a veces los miércoles los cines se ponen en 2x1 en taquilla <br><br>"
      justificado2 = false;
    }
    else{
      var consejo4 = "";
    }
  
    if(this.respuestasContestadas[1][2] == 1){
      var consejo5 = " • Te recomendamos sacar una tarjeta de beneficios de tu cine, pues hemos detectado que vas mucho al cine, y este tipo de tarjetas convienen demasiado para los usuarios concurrentes pues ofrece muchas ofertas y bonificaciones <br><br>"
      justificado2 = false;
    }
    else{
      var consejo5 = "";
    }
  
    if(this.respuestasContestadas[1][3] == 1 && this.respuestasContestadas[1][4] == 1){
      var consejo6 = " • Te recomendamos dejar de comprar las películas una por una en otras plataformas y mejor contratar algún servicio de streaming de películas <br><br>"
      justificado2 = false;
    }
    else{
      var consejo6 = "";
    }

    if(justificado2 == false){
      this.accionesService.presentAlertGenerica("Consejos de Películas", consejo4 + consejo5 + consejo6);
    }
    else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
      this.accionesService.presentAlertGenerica("Gasto de Películas justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    }  
    this.comprobarSiRegresa(2);
  }
  }
  
  testVideojuegos(){
     //SUBTEST 3
  var justificado3 = true;
  if(this.permisos[2] == true){
    if(this.respuestasContestadas[2][1] == 1){
      var consejo7 = " • Te recomendamos que trates de vender los juegos que ya no uses o que los intercambies con alguien, pero no guardarlos, pues es dinero perdido <br><br>"
      justificado3 = false;
    }
    else{
      var consejo7 = "";
    }
  
    if(this.respuestasContestadas[2][2] == 1 || this.respuestasContestadas[2][2] == 2){
      var consejo8 = " • Te recomendamos siempre tratar de comprar videojuegos en las temporadas de ofertas, como lo son las ofertas de invierno por ejemplo <br><br>"
      justificado3 = false;
    }
    else{
      var consejo8 = "";
    }
  
    if(this.respuestasContestadas[2][3] == 1){
      var consejo9 = " • Te recomendamos tratar de no meterle dinero a los juegos, pues esta clase de micropagos te acaban saliendo más caros que el mismo juego en sí <br><br>"
      justificado3 = false;
    }
    else{
      var consejo9 = "";
    }

    if(justificado3 == false){
      this.accionesService.presentAlertGenerica("Consejos de Videojuegos", consejo7 + consejo8 + consejo9);
    }
    else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
      this.accionesService.presentAlertGenerica("Gasto de Videojuegos justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    }  
    this.comprobarSiRegresa(3);
  }
  }

  testAmigosPareja(){
    //SUBTEST 4
  var justificado4 = true;
  if(this.permisos[3]){
    if(this.respuestasContestadas[3][1] == 1){
      var consejo10 = " • Te recomendamos que siempre que vayas a salir con sus amigos o pareja, tengas en mente una cifra a gastar fija, y tratar de apegarse a ella <br><br>"
      justificado4 = false;
    }
    else{
      var consejo10 = "";
    }

    if(this.respuestasContestadas[3][2] == 1){
      var consejo11 = " • Te recomendamos que siempre traten de pagar cada quien lo suyo, pues está comprobado que cuando se paga en partes iguales, la gente suele pedir de más y por ende, saldrá más caro <br><br>"
      justificado4 = false;
    }
    else{
      var consejo11 = "";
    }

    if(this.respuestasContestadas[3][3] == 1){
      var consejo12 = " • Te recomendamos que trates de no excederte con las idas al antro, que una reunión en casa de alguno de tus amigos también es una buena opción para juntarse <br><br>"
      justificado4 = false;
    }
    else{
      var consejo12 = "";
    }

    if(justificado4 == false){
      this.accionesService.presentAlertGenerica("Consejos de Salidas con amigos/pareja", consejo10 + consejo11 + consejo12);
    }
    else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
      this.accionesService.presentAlertGenerica("Gasto de Salidas con amigos/pareja justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    } 
    this.comprobarSiRegresa(4);
  }
  }

  testViajes(){
    //SUBTEST 5
   var justificado5 = true;
   if(this.permisos[4]){
    if(this.respuestasContestadas[4][1] == 1){
      var consejo13 = " • Te recomendamos tratar de hacer todo lo posible por viajar en temporada baja, si no puedes entonces trata de reducir gastos, como por ejemplo; en lugar de hospedarte en un hotel hazlo en un airbnb, o en lugar de viajar en avión hazlo en camión, cualquier tipo de “sacrificio” que no te cueste tanto realizar que te ahorre dinero <br><br>"
      justificado5 = false;
    }
    else{
      var consejo13 = "";
    }

    if(this.respuestasContestadas[4][2] == 1){
      var consejo14 = " • Te recomendamos que siempre planifiques tu presupuesto antes de tu viaje y te apegues a él lo más posible <br><br>"
      justificado5 = false;
    }
    else{
      var consejo14 = "";
    }

    if(this.respuestasContestadas[4][3] == 1){
      var consejo15 = " • Te recomendamos que de vez en cuando prepares comida desde el lugar donde te hospedas, puedes hacer unos sándwiches, hot cakes, o algo económico para desayunar y cenar, y ya puedes comer fuera sin problemas <br><br>"
      justificado5 = false;
    }
    else if(this.respuestasContestadas[4][3] == 2){
      var consejo15 = " • Te recomendamos que siempre compares precios antes de elegir el todo incluido, y que valores si vale realmente la pena <br><br>"
      justificado5 = false;
    }
    else{
      var consejo15 = "";
    }

    if(justificado5 == false){
      this.accionesService.presentAlertGenerica("Consejos de Viajes", consejo13 + consejo14 + consejo15);
    }
    else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
      this.accionesService.presentAlertGenerica("Gasto de Viajes justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    } 
    this.comprobarSiRegresa(5);
  }
  }

  testEventos(){

     //SUBTEST 6
     var justificado6 = true;
     if(this.permisos[5]){
      if(this.respuestasContestadas[5][1] == 1){
        var consejo16 = " • Te recomendamos siempre aprovechar los eventos culturales gratis o que tienen descuentos, por ejemplo; los domingos de vez en cuando hay varios eventos gratis <br><br>"
        justificado6 = false;
      }
      else{
        var consejo16 = "";
      }
  
      if(this.respuestasContestadas[5][2] == 1){
        var consejo17 = " • Te recomendamos que trates de no gastar mucho en los consumibles, hay veces que la gente gasta más en consumibles que en el propio boleto del evento, puedes irte bien comido para no generar antojos dentro del evento y así evitar ese tipo de gastos <br><br>"
        justificado6 = false;
      }
      else{
        var consejo17 = "";
      }
  
      if(justificado6 == false){
        this.accionesService.presentAlertGenerica("Consejos de Eventos culturales/deportivos", consejo16 + consejo17);
      }
      else{ //SI SU GASTO SI ESTÁ JUSTIFICADO
        this.accionesService.presentAlertGenerica("Gasto de Eventos culturales/deportivos justificado", "Aunque tu gasto este arriba de la media nacional" +
        ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
      } 
      this.comprobarSiRegresa(6);
    }
    
  }
  

}

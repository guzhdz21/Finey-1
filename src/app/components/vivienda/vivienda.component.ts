import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-vivienda',
  templateUrl: './vivienda.component.html',
  styleUrls: ['./vivienda.component.scss'],
})
export class ViviendaComponent implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService,
              private nav: NavController,
              private modalCtrl: ModalController ) { }

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.respuestasContestadas= [[],[],[]];
    this.subTestEncontrado1 = this.obtenerSubTest(1, this.subTestEncontrado1);
    this.subTestsEncontrados.push(this.subTestEncontrado1);
    this.radioRequired = [];
    this.radioRequired[1] = true;
    this.radioRequired[2] = true;
    this.radioRequired[3] = true;
    this.radioRequired[4] = true;
    this.radioRequired[5] = true;
    this.radioRequired[6] = true;
    this.radioRequired[7] = true;
    this.radioRequired[8] = true;
    this.radioRequired[9] = true;
  }

  subTestsEncontrados: SubTest[];
  respuestasContestadas: number[][];
  radioRequired: boolean[];

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
        if(idSubTest == element.id && element.idTest == 1){
          console.log("cumple")
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 1){
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
  this.radioRequired[idPregunta] = false;
  this.respuestasContestadas[idSubTest-1][idPregunta] = parseInt(event.detail.value);
  }


testFinalizado(){

var justificado = true;

  if(this.respuestasContestadas[0][1] == 1 && this.respuestasContestadas[0][2] == 1 && this.respuestasContestadas[0][4] == 1){
    var consejo1 = " • Te recomendamos rentar en otro lugar más economico aunque sea mas chico, pues no pasas mucho tiempo en tu casa" +
    ", literal nomás llegas a dormir, por eso no hay motivo de rentar algo tan completo <br><br>"
    justificado = false;
  }
  else{
    var consejo1 = "";
  }

  if(this.respuestasContestadas[0][1] == 1 && this.respuestasContestadas[0][3] == 1){
    var consejo2 = " • Te recomendamos buscar otro lugar donde rentar que sea más economico, aunque no tenga la misma plusvalía <br><br>"
    justificado = false;
  }
  else{
    var consejo2 = "";
  }

  if(this.respuestasContestadas[0][5] == 1 && this.respuestasContestadas[0][4] == 1 && this.respuestasContestadas[0][1] == 1){
    var consejo3 = " • Te recomendamos rentar en un lugar más barato debido a que tu casa es más grande de lo necesario para el número de personas que viven en ella <br><br>"
    justificado = false;
  }
  else{
    var consejo3 = "";
  }

  if(this.respuestasContestadas[0][6] == 1){
    var consejo4 = " • Te recomendamos usar más la regadera y que la tina/bañera la llenes de vez en cuando, no siempre <br><br>"
    justificado = false;
  }
  else{
    var consejo4 = "";
  }

  if(this.respuestasContestadas[0][6] == 2){
    var consejo5 = " • Te recomendamos comprar un aspersor para la regadera para que ahorre agua, a largo plazo es demasiado conveniente <br><br>"
    justificado = false;
  }
  else{
    var consejo5 = "";
  }

  if(this.respuestasContestadas[0][7] == 1){
    var consejo6 = " • Te recomendamos usar la cubeta para lavar tu vehiculo, ya que asi ahorrarás mucha agua <br><br>"
    justificado = false;
  }
  else{
    var consejo6 = "";
  }

  if(this.respuestasContestadas[0][7] == 2){
    var consejo7 = " • Te recomendamos dejar de llevar tu vehiculo al autolavado, y lavarlo tu mismo con cubeta y manguera" +
    ", si no tienes el tiempo para hacerlo, puedes ofrecerle una propina a algun hijo/sobrino tuyo por hacerlo <br><br>"
  }
  else{
    var consejo7 = "";
  }

  if(this.respuestasContestadas[0][8] == 1){
    var consejo8 = " • Te recomendamos que la limpieza del hogar la realices tu o alguien que viva contigo, se pueden turnar los días <br><br>"
    justificado = false;
  }
  else{
    var consejo8 = "";
  }

  if(this.respuestasContestadas[0][9] == 1){
    var consejo9 = " • Te recomendamos dejar de mandar tu ropa a la lavandería, puedes lavarla a mano en casa o puedes conseguirte una lavadora economica <br><br>"
    justificado = false;
  }
  else{
    var consejo9 = "";
  }

  if(this.respuestasContestadas[0][9] == 2){
    var consejo10 = " • Te recomendamos laves los días soleados para que puedas ahorrarte la secadora y secar tus prendas en el sol <br><br>"
    justificado = false;
  }
  else{
    var consejo10 = "";
  }
    
  if(justificado == true){
    this.accionesService.presentAlertGenerica("Gasto de Vivienda justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
  else{
    this.accionesService.presentAlertGenerica("Consejos de vivienda", consejo1 + consejo2 + consejo3 + consejo4 + consejo5 + consejo6 + consejo7 + consejo8 + consejo9 + consejo10);
  }

  this.modalCtrl.dismiss();
  this.nav.navigateRoot('/tabs/tab3');

}


}

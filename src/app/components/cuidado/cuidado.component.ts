import { Component, OnInit } from '@angular/core';
import { SubTest } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';
import { NavController, ModalController } from '@ionic/angular';

@Component({
  selector: 'app-cuidado',
  templateUrl: './cuidado.component.html',
  styleUrls: ['./cuidado.component.scss'],
})
export class CuidadoComponent implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService,
              private nav: NavController,
              private modalCtrl: ModalController ) {}

  ngOnInit() {
    this.subTestsEncontrados = []; //Arreglo que guarda los subtests encontrados
    this.respuestasContestadas= [[],[],[]];
    this.subTestEncontrado1 = this.obtenerSubTest(1, this.subTestEncontrado1);
    this.subTestEncontrado2 = this.obtenerSubTest(2, this.subTestEncontrado2);
    this.subTestEncontrado3 = this.obtenerSubTest(3, this.subTestEncontrado3);
    this.subTestsEncontrados.push(this.subTestEncontrado1);
    this.subTestsEncontrados.push(this.subTestEncontrado2);
    this.subTestsEncontrados.push(this.subTestEncontrado3);

    this.radioRequired = [[],[],[]];
    this.radioRequired[0][1] = true;
    this.radioRequired[0][2] = true;
    this.radioRequired[0][3] = true;
    this.radioRequired[0][4] = true;
    this.radioRequired[0][5] = true;
    this.radioRequired[1][1] = true;
    this.radioRequired[1][2] = true;
    this.radioRequired[1][3] = true;
    this.radioRequired[2][1] = true;
    this.radioRequired[2][2] = true;
    this.radioRequired[2][3] = true;
  }

  subTestsEncontrados: SubTest[];
  respuestasContestadas: number[][];
  radioRequired : boolean[][];

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

  obtenerSubTest(idSubTest: number, subTestEncontrado: SubTest){
    this.datosService.getSubTests().subscribe(val => {
      val.forEach(element => {
        if(idSubTest == element.id && element.idTest == 3){
          console.log("cumple")
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;
          subTestEncontrado.preguntas = [];
          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(subTestEncontrado.id == elementPreg.idSubTest && elementPreg.idTest == 3){
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
    this.radioRequired[idSubTest-1][idPregunta] = false;
    this.respuestasContestadas[idSubTest-1][idPregunta] = parseInt(event.detail.value);
    }


testFinalizado(){

  //SUBTEST1

  var justificado1 = true;

  if(this.respuestasContestadas[0][1] == 1 && this.respuestasContestadas[0][2] == 1){
    this.accionesService.presentAlertGenerica("Gasto de Limpieza personal justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
  else{
    if(this.respuestasContestadas[0][3] == 1){
      var consejo1 = " • Hemos detectado que gastas mucho en desodorante, por lo que te recomendamos buscar algun otro desodorante mas" +
      " economico o usar piedra de alumbre (producto natural de bajo costo que sirve de desodorante) <br><br>"
      justificado1 = false;
    }
    else{
      var consejo1 = "";
    }

    if(this.respuestasContestadas[0][4] == 1){
      var consejo2 = " • Te aconsejamos que compres tus productos de cuidado personal en buena cantidad siempre que convenga," +
      " como ir al Sams y comprar un paquete de 6 jabones, en lugar de comprar 1 jabón cada 4 días en la tienda de la esquina <br><br>"
      justificado1 = false;
    }
    else{
      var consejo2 = "";
    }

    if(this.respuestasContestadas[0][5] == 1){
      var consejo3 = " • No deberías comprar tus productos en tu lugar de destino, es un gasto innecesario cuando tienes la posibilidad de "+
      " llevarte los tuyos de tu casa, ten en cuenta que por ejemplo; un desodorante no lo dejan subir en un avión <br><br>"
      justificado1 = false;
    }
    else{
      var consejo3 = "";
    }

    if(this.respuestasContestadas[0][1] == 1 && this.respuestasContestadas[0][2] == 0){
      var consejo4 = " • Te recomendamos asistir con un dermatólogo, ya que el te dirá en que productos gastar y en cuales no," +
      " y esto a largo plazo es un ahorro <br><br>"
      justificado1 = false;
    }
    else{
      var consejo4 = "";
    }

    if(justificado1 == true){
      this.accionesService.presentAlertGenerica("Gasto de Limpieza personal justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    }
    else{
      this.accionesService.presentAlertGenerica("Consejos de limpieza personal", consejo4 + consejo1 + consejo2 + consejo3);
    }
    
  }

  //SUBTEST2
  
  var justificado2 = true;

  if(this.respuestasContestadas[1][1] == 1){
    this.accionesService.presentAlertGenerica("Gasto de Salud justificado", "Aunque tu gasto este arriba de la media nacional" +
    ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
  }
  else{
    if(this.respuestasContestadas[1][2] == 1){
      var consejo5 = " • Te recomendamos siempre tener tu kit de primeros auxilios o medicamentos básicos en tu casa," +
      " pues es mejor hacerlo de esta manera que andar comprando los accesorios o medicamentos cuando estés en apuros acudiendo a la primera opción <br><br>"
    justificado2 = false;
    }
    else{
      var consejo5 = "";
    }

    if(this.respuestasContestadas[1][3] == 1){
      var consejo6 = " • Si la enfermedad no es grave, te recomendamos adquirir medicamentos de marca libre o similares, ya que estos convienen" +
      " en cuanto a calidad-precio, ojo, siempre y cuando no sea algo grave <br><br>"
      justificado2 = false;
    }
    else{
      var consejo6 = "";
    }

    if(justificado2 == true){
      this.accionesService.presentAlertGenerica("Gasto de Salud justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas");
    }
    else{
      this.accionesService.presentAlertGenerica("Consejos de salud", consejo5 + consejo6); 
    }   
  }

  //SUBTEST3

  var justificado3 = true;

    if(this.respuestasContestadas[2][1] == 1){
      justificado3 = false;
      var consejo7 = " • Deberías buscar algunas marcas no tan caras de ropa, hay muchas en el mercado de excelente calidad" +
      " y economicas, no caigas en la trampa de que compres algo caro solamente por la marca, haz comparaciones de calidad-precio entre las marcas <br><br>"
    }
    else{
      var consejo7 = "";
    }

    if(this.respuestasContestadas[2][2] == 1){
      justificado3 = false;
      var consejo8 = " • La ropa que no usas la deberías de vender, para obtener cualquier beneficio economico o podrías intercambiarla con" +
      " algun amig@ o familiar ahorrandote el comprar más prendas <br><br>"
    }
    else{
      var consejo8 = "";
    }

    if(this.respuestasContestadas[2][3] == 1){
      justificado3 = false;
      var consejo9 = " • Te recomendamos que esperes las ofertas para adquirir ropa, pues hemos detectado que no aprovechas del todo" +
      " las ofertas que las tiendas ofrecen. <br><br>"
    }
    else{
      var consejo9 = "";
    }

    if(justificado3 == true){
      this.accionesService.presentAlertGenerica("Gasto de ropa justificado", "Aunque tu gasto este arriba de la media nacional" +
      ", está justificado, pues si lo aprovechas bien o simplemente lo necesitas tal y como es debido a tus respuestas, aunque si deberías tratar de bajar un poco el presupuesto para dicho gasto");
    }
    else{
    this.accionesService.presentAlertGenerica("Consejos de ropa", consejo7 + consejo8 + consejo9);    
    }
    
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab3');
}

}

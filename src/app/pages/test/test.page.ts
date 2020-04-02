import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, SubTest, Pregunta, Respuesta } from 'src/app/interfaces/interfaces';
import { DatosService } from 'src/app/services/datos.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {

@Input() id: number;
tests: Observable<Test[]> = this.datosService.getTests();
subTests: Observable<SubTest[]> = this.datosService.getSubTests();
preguntas: Observable<Pregunta[]> = this.datosService.getPreguntas();

testEncontrado: Test = {
  id: null,
  nombre: '',
  texto: '',
  subTests: null
};

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

subTestEncontrado4: SubTest = {
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

permiso1: boolean = false;
permiso2: boolean = false;
permiso3: boolean = false;
permiso4: boolean = false;

encontradoExito = false;

  constructor(public datosService: DatosService) { }

  ngOnInit() {

    //Encuentro el test con esa ID
    this. datosService.getTests().subscribe(val => {
      val.forEach(element => {
        if(element.id == this.id){
          this.testEncontrado = element;
        }
      });
    });

  }

  obtenerSubTest(idSubTest: number, subTestEncontrado: SubTest){
   this.encontradoExito=false;
    var i=0, ii=0;
    this.datosService.getSubTests().subscribe(val => {

      val.forEach(element => {

        if(idSubTest == element.id && element.idTest == this.id){
          this.encontradoExito=true;
          i=0;
          subTestEncontrado.idTest = element.idTest;
          subTestEncontrado.id = element.id;

          this.datosService.getPreguntas().subscribe(preg => {

            preg.forEach(elementPreg => {

              if(idSubTest == elementPreg.idSubTest){

               ii=0;
               subTestEncontrado.preguntas[i] = elementPreg;

                  subTestEncontrado.preguntas[i].respuestas.forEach(elementRespu => {

                  subTestEncontrado.preguntas[i].respuestas[ii].respuestaTexto = elementRespu.respuestaTexto;
                  ii++;   
                }); 
              }
               else{
                console.log("No encontrado");
              }
            
              i++;

           });
        });
      }
  });
});
return subTestEncontrado;
}

  async subTest1(event){
    if(event.detail.value == 'si'){
      this.subTestEncontrado1 = this.obtenerSubTest(1, this.subTestEncontrado1);
      this.permiso1 = true;
      //console.log(this.subTestEncontrado1);
    }
    else{
      this.permiso1 = false;
      this.subTestEncontrado1 = null;
    }
  }

  async subTest2(event){
    if(event.detail.value == 'si'){
      this.subTestEncontrado2 = this.obtenerSubTest(2, this.subTestEncontrado2);
      this.permiso2 = true;
      //console.log(this.subTestEncontrado2);
    }
    else{
      this.permiso2 = false;
      this.subTestEncontrado2 = null;
      console.log("no");
    }
  }

}

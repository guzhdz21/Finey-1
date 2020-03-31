import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Test, SubTest, Pregunta } from 'src/app/interfaces/interfaces';
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

subTestEncontrado: SubTest = {
  idTest: 5,
  id: 1,
  preguntas: [{
      idSubTest: 1,
      id: 1,
      preguntaTexto: 'Guz es gay',
      respuestas: [{
          respuestaTexto: 'si',
          valor: 0
        }]
    }]
}

permiso1: boolean = false;
permiso2: boolean = false;
permiso3: boolean = false;
permiso4: boolean = false;
permiso5: boolean = false;

  constructor(public datosService: DatosService) { }

  cuantosSubTests = 0;

  ngOnInit() {

    //Encuentro el test con esa ID
    this. datosService.getTests().subscribe(val => {
      val.forEach(element => {
        if(element.id == this.id){
          this.testEncontrado = element;
        }
      });
    });

    this.datosService.getSubTests().subscribe(val => {
      val.forEach(element => {
        if(element.idTest == this.id){
        this.cuantosSubTests++;
        }
      });
    });
  
  }

  obtenerSubTest( idSubTest: number){

    this.datosService.getSubTests().subscribe(val => {
      val.forEach(element => {
        if( idSubTest == element.id && element.idTest == this.id){
          this.subTestEncontrado = element;
          console.log("encontrado");
        }
        else{
          console.log("No encontrado");
        }
      });
    });

  }

  subTest1(event){
    if(event.detail.value == 'si'){
      this.obtenerSubTest(1);
      this.permiso1 = true;
    }
    else{
      this.permiso1 = false;
    }
  }

}

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

testEncontrado: Test = {
  id: null,
  nombre: '',
  texto: '',
  subTests: null
};

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

}

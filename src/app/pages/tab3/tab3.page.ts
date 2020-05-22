import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { DatosService } from '../../services/datos.service';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { Test, SubTest, Pregunta, UsuarioLocal } from '../../interfaces/interfaces';
import { NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  backButtonSub: Subscription;
  mostrarTest: boolean[];

  //Variable para guardar los datos del ususario
  usuario: UsuarioLocal = this.datosService.usuarioCarga;
  contador: number = 1;
  valorPromedio: number[];
  testsExisten: boolean;

  tests: Observable<Test[]> = this.datosService.getTests();

  constructor(private localNotifications: LocalNotifications,
              public datosService: DatosService,
              private plt: Platform,
              private nav: NavController,
              private modalCtrl: ModalController) {}

  ngOnInit() {
    this.testsExisten = false;
    this.mostrarTest = [];
    this.valorPromedio = [];
    this.mostrarTest[1] = false;
    this.mostrarTest[2] = false;
    this.mostrarTest[3] = false;
    this.mostrarTest[4] = false;
    this.mostrarTest[5] = false;
    this.mostrarTest[6] = false;
    this.mostrarTest[7] = false;
    this.mostrarTest[8] = false;
    this.valorPromedio[1] = 0;
    this.valorPromedio[2] = 0;
    this.valorPromedio[3] = 0;
    this.valorPromedio[4] = 0;
    this.valorPromedio[5] = 0;
    this.valorPromedio[6] = 0;
    this.valorPromedio[7] = 0;
    this.valorPromedio[8] = 0;
    this.mostrarTestsCorrespondientes();
    }

  mostrarTestsCorrespondientes(){

    //Vivienda
    this.valorPromedio[1] = this.usuario.gastos[0].cantidad + this.usuario.gastos[1].cantidad + this.usuario.gastos[2].cantidad + this.usuario.gastos[3].cantidad;
    console.log("Vivienda: " + this.valorPromedio[1]);

    //Alimentos
    this.valorPromedio[2] = this.usuario.gastos[4].cantidad ;
    console.log("Alimentos: " + this.valorPromedio[2]);

    //Cuidado personal
    this.valorPromedio[3] = this.usuario.gastos[5].cantidad + this.usuario.gastos[7].cantidad  + this.usuario.gastos[15].cantidad ;
    console.log("Cuidado personal: " + this.valorPromedio[3]);

    //Transporte
    this.valorPromedio[4] = this.usuario.gastos[8].cantidad;
    console.log("Transporte: " + this.valorPromedio[4]);

    //Internet/cable/telefonía
    this.valorPromedio[5] = this.usuario.gastos[10].cantidad;
    console.log("Internet: " + this.valorPromedio[5]);

    //Electronicos
    this.valorPromedio[6] = this.usuario.gastos[12].cantidad;
    console.log("Electronicos: " + this.valorPromedio[6]);

    //Educación
    this.valorPromedio[7] = this.usuario.gastos[13].cantidad;
    console.log("Educacion: " + this.valorPromedio[7]);

    //Ocio
    this.valorPromedio[8] = this.usuario.gastos[14].cantidad;
    console.log("Ocio: " + this.valorPromedio[8]);

    if(this.valorPromedio[1] >= 5215){ //Vivienda
      this.mostrarTest[1] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[2] >= 3500){ //Alimentos
      this.mostrarTest[2] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[3] >= 1300){ //Cuidado personal
      this.mostrarTest[3] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[4] >= 1300){ //Transporte
      this.mostrarTest[4] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[5] >= 885){ //Internet/cable/television
      this.mostrarTest[5] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[6] >= 800){ //Electronicos
      this.mostrarTest[6] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[7] >= 1500){ //Educacion
      this.mostrarTest[7] = true;
      this.testsExisten = true;
    }

    if(this.valorPromedio[8] >= 800){ //Ocio
      this.mostrarTest[8] = true;
      this.testsExisten = true;
    }
  }

  ionViewDidEnter() {
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      this.nav.navigateRoot('/tabs/tab1');
    });
  }

  async abrirTest(idSeleccionado: number){

    let navigationExtras: NavigationExtras = {
      queryParams: {
        idParametro: idSeleccionado
      }
  };
  await this.nav.navigateForward(['test-page'], navigationExtras);
  }
}

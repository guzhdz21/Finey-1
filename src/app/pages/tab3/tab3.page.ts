import { Component } from '@angular/core';
import { LocalNotifications} from '@ionic-native/local-notifications/ngx'
import { DatosService } from '../../services/datos.service';
import { Platform, NavController, ModalController } from '@ionic/angular';
import { Subscription, Observable } from 'rxjs';
import { Test, SubTest, Pregunta, UsuarioLocal, AlertaGeneral } from '../../interfaces/interfaces';
import { NavigationExtras } from '@angular/router';
import { AccionesService } from '../../services/acciones.service';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {

  backButtonSub: Subscription;
  mostrarTest: boolean[];

  //Variable para guardar los datos del usuario
  usuario: UsuarioLocal = this.datosService.usuarioCarga;
  contador: number = 1;
  valorPromedio: number[];
  testsExisten: boolean;

  alertas: AlertaGeneral[] = [];

  tests: Observable<Test[]> = this.datosService.getTests();

  constructor(private localNotifications: LocalNotifications,
              public datosService: DatosService,
              private plt: Platform,
              private nav: NavController,
              private modalCtrl: ModalController,
              private accionesService: AccionesService) {}

  ngOnInit() {
    this.datosService.getAlertasJson().subscribe(val => {
      this.alertas = val;
    });
    
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

    this.datosService.cargarDatos();
    this.usuario = this.datosService.usuarioCarga;

    //Vivienda
    this.valorPromedio[1] = this.usuario.gastos[0].cantidad + this.usuario.gastos[1].cantidad + this.usuario.gastos[2].cantidad + this.usuario.gastos[3].cantidad;

    //Alimentos
    this.valorPromedio[2] = this.usuario.gastos[4].cantidad ;

    //Cuidado personal
    this.valorPromedio[3] = this.usuario.gastos[5].cantidad + this.usuario.gastos[7].cantidad  + this.usuario.gastos[15].cantidad ;

    //Transporte
    this.valorPromedio[4] = this.usuario.gastos[8].cantidad;

    //Internet/cable/telefonía
    this.valorPromedio[5] = this.usuario.gastos[10].cantidad;

    //Electronicos
    this.valorPromedio[6] = this.usuario.gastos[12].cantidad;

    //Educación
    this.valorPromedio[7] = this.usuario.gastos[13].cantidad;

    //Ocio
    this.valorPromedio[8] = this.usuario.gastos[14].cantidad;

    if(this.valorPromedio[1] >= 5215){ //Vivienda
      this.mostrarTest[1] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[1] = false;
    }

    if(this.valorPromedio[2] >= 3500){ //Alimentos
      this.mostrarTest[2] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[2] = false;
    }

    if(this.valorPromedio[3] >= 1300){ //Cuidado personal
      this.mostrarTest[3] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[3] = false;
    }

    if(this.valorPromedio[4] >= 1300){ //Transporte
      this.mostrarTest[4] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[4] = false;
    }

    if(this.valorPromedio[5] >= 885){ //Internet/cable/television
      this.mostrarTest[5] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[5] = false;
    }

    if(this.valorPromedio[6] >= 800){ //Electronicos
      this.mostrarTest[6] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[6] = false;
    }

    if(this.valorPromedio[7] >= 1500){ //Educacion
      this.mostrarTest[7] = true;
      this.testsExisten = true;
    }
    else {
      this.mostrarTest[7] = false;
    }

    if(this.valorPromedio[8] >= 800){ //Ocio
      this.mostrarTest[8] = true;
      this.testsExisten = true;
    } else {
      this.mostrarTest[8] = false;
    }

    this.testsExisten = false;
    for(var mostrar of this.mostrarTest) {
      if(mostrar) {
        this.testsExisten = true;
      }
    }
  }

  ionViewDidEnter() {
    this.mostrarTestsCorrespondientes();
    this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
      if(this.datosService.bloquearModulos == true){
        navigator["app"].exitApp();
      }
      this.nav.navigateRoot('/tabs/tab1');
    });
    this.mostrarTestsCorrespondientes();
  }

  async abrirTest(idSeleccionado: number){

    let navigationExtras: NavigationExtras = {
      queryParams: {
        idParametro: idSeleccionado
      }
  };
    await this.nav.navigateForward(['test-page'], navigationExtras);
  }

  botonInfo(titulo: string) {
    this.alertas.forEach(element => {
      if(titulo == element.titulo)
      {
        this.accionesService.presentAlertGenerica(element.titulo, element.mensaje);
        return;
      }
    });
  }

}

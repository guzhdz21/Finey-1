import { Component, OnInit } from '@angular/core';
import { DatosService } from 'src/app/services/datos.service';
import { AccionesService } from 'src/app/services/acciones.service';
import { ModalController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-hormiga',
  templateUrl: './hormiga.page.html',
  styleUrls: ['./hormiga.page.scss'],
})
export class HormigaPage implements OnInit {

  constructor(public datosService: DatosService,
              public accionesService: AccionesService,
              private nav: NavController,
              private modalCtrl: ModalController,
              private plt: Platform) { }

  ngOnInit() {
    this.consejos = [];
    this.consejos[0] = ""; 
    this.consejos[1] = ""; 
    this.consejos[2] = ""; 
    this.consejos[3] = ""; 
    this.consejos[4] = ""; 
    this.consejos[5] = ""; 
    this.consejos[6] = ""; 
    this.consejos[7] = ""; 
    this.consejos[8] = ""; 
    this.consejos[9] = ""; 
    this.consejos[10] = ""; 
    this.consejos[11] = ""; 
    this.consejos[12] = ""; 
    this.consejos[13] = ""; 
    this.consejos[14] = "";
    this.consejos[15] = ""; 
    this.aconsejados = [];
    this.aconsejados[0] = false;
    this.aconsejados[1] = false;
    this.aconsejados[2] = false;
    this.aconsejados[3] = false;
    this.aconsejados[4] = false;
    this.aconsejados[5] = false;
    this.aconsejados[6] = false;
    this.aconsejados[7] = false;
    this.aconsejados[8] = false;
    this.aconsejados[9] = false;
    this.aconsejados[10] = false;
    this.seleccionados = 0;
  }

  consejos: string[];
  aconsejados: boolean[];
  seleccionados: number;
  rutaSeguir: string = "/tabs/tab1";
  backButtonSub: Subscription;

  async mostrarConsejos(){
    await this.accionesService.presentAlertGenerica("Consejos de gastos hormiga", this.consejos[0] + this.consejos[1] + this.consejos[2] + this.consejos[3] + this.consejos[4] + this.consejos[5] + this.consejos[6] + this.consejos[7] + this.consejos[8] + this.consejos[9] + this.consejos[10] + this.consejos[11] + this.consejos[12] + this.consejos[13] + this.consejos[14] + this.consejos[15]);
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }

  async checkBoxInicial(event, id){
    switch(id){
      case 0:
        if(this.aconsejados[0] == false){
          this.consejos[0] = " • Te recomendamos no siempre comprar tu café fuera, trata de preparartelo en casa o en tu oficina siempre que puedas <br><br>";
          this.consejos[1] = " • Te recomendamos ir reduciendo de poco en poco la cantidad de cucharadas de café que incluyes en tu taza de café <br><br>";
          this.aconsejados[0] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[0] = "";
          this.consejos[1] = "";
          this.aconsejados[0] = false;
          this.seleccionados--;
        }
      break;
  
      case 1:
        if(this.aconsejados[1] == false){
          this.consejos[2] = " • Te recomendamos calcular el gasto que realizas en tus cigarrillos al año, para que veas cuanto gastas, y obviamente con esto, tratar de motivarte a que reduzcas su consumo poco a poco, sabemos que no es fácil, pero vale la pena <br><br>";
          this.consejos[3] = " • Te recomendamos reutilizar tus cigarrillos, por ejemplo; no tires un cigarro cuando nomás lo usaste 2 minutos, puedes guardarlo y volver a prenderlo después <br><br>";
          this.aconsejados[1] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[2] = "";
          this.consejos[3] = "";
          this.aconsejados[1] = false;
          this.seleccionados--;
        }
      break;
  
      case 2:
        if(this.aconsejados[2] == false){
          this.consejos[4] = " • Te recomendamos no volver a comprar agua embotellada, siempre tratar de llenar un recipiente de agua de tu garrafón, compara el precio del agua embotellada con el de tu garrafón, te darás cuenta por qué <br><br>";
          this.aconsejados[2] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[4] = "";
          this.aconsejados[2] = false;
          this.seleccionados--;
        }
      break;
  
      case 3:
        if(this.aconsejados[3] == false){
          this.consejos[5] = " • Te recomendamos que si tu snack es algo que se puede comprar en una cantidad grande, lo hagas de esta manera, por ejemplo; es mejor comprar un paquete de muffins, que a comprar un muffin por día <br><br>";
          this.consejos[6] = " • Te recomendamos siempre tener establecido tu número de snacks y tratar de irlo reduciendo, por ejemplo; si alguien tiene 3 snacks al día, tratar de irlo reduciendo primero a 2, y cuando sienta que puede bajar a 1 snack al día lo haga <br><br>";
          this.aconsejados[3] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[5] = "";
          this.consejos[6] = "";
          this.aconsejados[3] = false;
          this.seleccionados--;
        }
      break;
  
      case 4:
        if(this.aconsejados[4] == false){
          this.consejos[7] = " • Te recomendamos usar más los medios digitales para informarte de las noticias, de esta manera irás encontrando que las revistas o periodicos no son tan fundamentales en tu día a día <br><br>";
          this.aconsejados[4] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[7] = "";
          this.aconsejados[4] = false;
          this.seleccionados--;
        }
      break;
  
      case 5:
        if(this.aconsejados[5] == false){
          this.consejos[8] = " • Te recomendamos de plano no apostar ni entrar a rifas, no dejan nada bueno, pues las probabilidades de victoría no son altas, si de plano no quieres dejarlo, pues te recomendamos no apostar mucho dinero o entrar a rifas caras <br><br>";
          this.aconsejados[5] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[8] = "";
          this.aconsejados[5] = false;
          this.seleccionados--;
        }
      break;

      case 6:
        if(this.aconsejados[6] == false){
          this.consejos[9] = " • En el caso de que uses mucho el internet celular o llames mucho desde este, te recomendamos de plano contratar un plan economico, el que más te convenga con la compañía que quieras<br><br>";
          this.aconsejados[6] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[9] = "";
          this.aconsejados[6] = false;
          this.seleccionados--;
        }
      break;

      case 7:
        if(this.aconsejados[7] == false){
          this.consejos[10] = " • Te recomendamos usar el transporte público de vez en cuando, puede ser cuando no tengas prisa o cuando vayas a un lugar cercano <br><br>";
          this.consejos[11] = " • En el caso de que el transporte público no sea una opción para tí, te recomendamos tomar los taxis o ubers cuando la tarifa de estos sea baja, para esto deberías evadir transportarte en las horas pico <br><br>";
          this.aconsejados[7] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[10] = "";
          this.consejos[11] = "";
          this.aconsejados[7] = false;
          this.seleccionados--;
        }
      break;

      case 8:
        if(this.aconsejados[8] == false){
          this.consejos[12] = " • Te recomendamos que hagas una lista de los servicios de suscripción que tienes activos, y considerar si realmente los usas como para justificar el gasto que haces en cada uno de ellos, si alguno se te hace caro y no lo usas mucho, busca servicios alternativos más economicos o de plano descontrátalo <br><br>";
          this.aconsejados[8] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[12] = "";
          this.aconsejados[8] = false;
          this.seleccionados--;
        }
      break;

      case 9:
        if(this.aconsejados[9] == false){
          this.consejos[13] = " • Te recomendamos ir en transporte público o en bicicleta a lugares cercanos donde gastas en estacionamiento <br><br>";
          this.aconsejados[9] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[13] = "";
          this.aconsejados[9] = false;
          this.seleccionados--;
        }
      break;

      case 10:
        if(this.aconsejados[10] == false){
          this.consejos[14] = " • Te recomendamos siempre controlar tus porciones de refresco, como si agendarás cuando tomarlo, por ejemplo; tomar refresco solo cuando comes y cenas, no más <br><br>";
          this.consejos[15] = " • Te recomendamos no comprar porciones chicas de refresco, es mejor comprar de más (obviamente no tomartelo todo en un día) por ejemplo; es mejor comprar un refresco de 2 litros y tomartelo en varios dias, a que te compres un refresco de medio litro cada día<br><br>"
          this.aconsejados[10] = true;
          this.seleccionados++;
        }
        else{
          this.consejos[14] = "";
          this.consejos[15] = "";
          this.aconsejados[10] = false;
          this.seleccionados--;
        }
      break;
    }
  }

  async ionViewDidEnter() {

    await this.datosService.cargarBloqueoModulos();
    if(this.datosService.bloquearModulos == true){
      this.rutaSeguir = "/tabs/tab3";
      this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab3');
      });
    }
    else{
      this.backButtonSub = this.plt.backButton.subscribeWithPriority( 10000, () => {
        this.modalCtrl.dismiss();
        this.nav.navigateRoot('/tabs/tab1');
      });
    }
  }

}

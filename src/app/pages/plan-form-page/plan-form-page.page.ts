import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DatosService } from 'src/app/services/datos.service';
import { format } from 'url';
import { PlanFormPage } from '../plan-form/plan-form.page';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-plan-form-page',
  templateUrl: './plan-form-page.page.html',
  styleUrls: ['./plan-form-page.page.scss'],
})
export class PlanFormPagePage implements OnInit {

constructor(private modalCtrl: ModalController,
            private activatedRoute: ActivatedRoute ) { 
              this.activatedRoute.queryParams.subscribe((res) =>
              {
                this.registro = res.value;
              });
            }

registro: string;
ngOnInit() {
this.abrirModal();
}

async abrirModal() {
  const modal = await this.modalCtrl.create({
  component: PlanFormPage,
  componentProps: {
    registro: this.registro
  }
  });
  await modal.present();
}

}

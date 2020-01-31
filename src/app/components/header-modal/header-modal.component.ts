import { Component, OnInit, Input } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-header-modal',
  templateUrl: './header-modal.component.html',
  styleUrls: ['./header-modal.component.scss'],
})
export class HeaderModalComponent implements OnInit {

  @Input() titulo: string;
  constructor(private modalCtrl: ModalController,
              private nav: NavController) { }

  ngOnInit() {}

  regresar()
  {
    this.modalCtrl.dismiss();
    this.nav.navigateRoot('/tabs/tab1');
  }
}

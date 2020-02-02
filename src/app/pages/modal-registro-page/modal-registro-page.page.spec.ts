import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ModalRegistroPagePage } from './modal-registro-page.page';

describe('ModalRegistroPagePage', () => {
  let component: ModalRegistroPagePage;
  let fixture: ComponentFixture<ModalRegistroPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalRegistroPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ModalRegistroPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

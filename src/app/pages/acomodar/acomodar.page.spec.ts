import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcomodarPage } from './acomodar.page';

describe('AcomodarPage', () => {
  let component: AcomodarPage;
  let fixture: ComponentFixture<AcomodarPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcomodarPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcomodarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

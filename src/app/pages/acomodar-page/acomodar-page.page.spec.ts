import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AcomodarPagePage } from './acomodar-page.page';

describe('AcomodarPagePage', () => {
  let component: AcomodarPagePage;
  let fixture: ComponentFixture<AcomodarPagePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcomodarPagePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AcomodarPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AppComponent } from './app.component';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';

// No probamos contra Azure AD real: se simulan MsalService/MsalBroadcastService
// con lo mínimo que AppComponent necesita para poder crearse.
const msalServiceMock = {
  handleRedirectObservable: () => of(null),
  instance: {
    getAllAccounts: () => [],
    getActiveAccount: () => null,
    setActiveAccount: () => {},
  },
};

const msalBroadcastServiceMock = {
  inProgress$: of('none'),
};

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: MsalService, useValue: msalServiceMock },
        { provide: MsalBroadcastService, useValue: msalBroadcastServiceMock },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should show the login button when there is no session', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Iniciar sesión');
  });
});

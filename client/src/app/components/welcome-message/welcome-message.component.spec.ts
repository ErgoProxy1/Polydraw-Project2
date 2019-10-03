import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { KeyboardShortcutService } from 'src/app/services/keyboardShortcut/keyboard-shortcut.service';
import { UserInfoService } from 'src/app/services/userInfo/userinfo.service';
import { WelcomeModalContentService } from 'src/app/services/welcomeModalContent/welcome-modal-content.service';
import { WelcomeMessageComponent } from './welcome-message.component';

describe('WelcomeMessageComponent', () => {
  let component: WelcomeMessageComponent;
  let fixture: ComponentFixture<WelcomeMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WelcomeMessageComponent ],
      imports: [NgbModule],
      providers: [CookieService],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WelcomeMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('Modal properly set to active on init', () => {
    const userInfo: UserInfoService = TestBed.get(UserInfoService);
    const keyboardService: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    userInfo.noMessage = false;
    keyboardService.setActiveModalStatus(false);
    component.ngOnInit();
    expect(keyboardService.getActiveModalStatus()).toBe(true);
  });

  it('Modal stays inactive on init if user asked it to', () => {
    const userInfo: UserInfoService = TestBed.get(UserInfoService);
    const keyboardService: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    userInfo.noMessage = true;
    keyboardService.setActiveModalStatus(false);
    component.ngOnInit();
    expect(keyboardService.getActiveModalStatus()).toBe(false);
  });

  it('Modal set to active when opened', () => {
    component.openModal();
    const keyboardServide: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    expect(keyboardServide.getActiveModalStatus()).toBe(true);
  });

  it('Modal set to inactive when closed', () => {
    component.closeModal();
    const keyboardServide: KeyboardShortcutService = TestBed.get(KeyboardShortcutService);
    expect(keyboardServide.getActiveModalStatus()).toBe(false);
  });

  it('Modal text is correct', () => {
    const welcomeMessageService: WelcomeModalContentService = TestBed.get(WelcomeModalContentService);
    expect(component.getModalText()).toBe(welcomeMessageService.welcomeModalText[0]);

    component.changeTab('next');

    expect(component.getModalText()).toBe(welcomeMessageService.welcomeModalText[1]);

    component.changeTab('previous');

    expect(component.getModalText()).toBe(welcomeMessageService.welcomeModalText[0]);
  });

  it('Tabs are properly identified', () => {
    const welcomeMessageService: WelcomeModalContentService = TestBed.get(WelcomeModalContentService);
    welcomeMessageService.currentTab = 0;
    expect(component.checkIfFirst()).toBe(true);
    expect(component.checkIfLast()).toBe(false);

    welcomeMessageService.currentTab = 1;
    expect(component.checkIfFirst()).toBe(false);
    expect(component.checkIfLast()).toBe(true);
  });

  it('Tab change is properly detected and transmitted', () => {
    const welcomeMessageService: WelcomeModalContentService = TestBed.get(WelcomeModalContentService);
    expect(welcomeMessageService.currentTab).toBe(0);

    component.changeTab('next');
    expect(welcomeMessageService.currentTab).toBe(1);

    component.changeTab('previous');
    expect(welcomeMessageService.currentTab).toBe(0);
  });

  it('Check box is properly ticked', () => {
    const userInfo: UserInfoService = TestBed.get(UserInfoService);
    userInfo.noMessage = false;
    component.tickCheckBox();
    expect(userInfo.noMessage).toBe(true);

    component.tickCheckBox();
    expect(userInfo.noMessage).toBe(false);
  });
});

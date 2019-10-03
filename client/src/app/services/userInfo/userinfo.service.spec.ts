import { TestBed } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { UserInfoService } from './userinfo.service';

describe('UserinfoService', () => {

  let userInfoService: UserInfoService;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CookieService],
    });
    TestBed.configureTestingModule({});
    cookieService = TestBed.get(CookieService);
  });
  it('should be created', () => {
    const service: UserInfoService = TestBed.get(UserInfoService);
    expect(service).toBeTruthy();
  });

  it('getnoMessage should be true because cookie is true', () => {
    cookieService.deleteAll();
    cookieService.set('noShow', 'true');
    userInfoService = new UserInfoService(cookieService);
    expect(userInfoService.getnoMessage()).toBe(true);
  });

  it('getnoMessage should be false because cookie is false', () => {
    cookieService.deleteAll();
    cookieService.set('noShow', 'false');
    userInfoService = new UserInfoService(cookieService);
    expect(userInfoService.getnoMessage()).toBe(false);
  });

  it('getnoMessage should be false because cookie not exist', () => {
    cookieService.deleteAll();
    userInfoService = new UserInfoService(cookieService);
    expect(userInfoService.getnoMessage()).toBe(false);
  });

  it('getnoMessage should be false because cookie contains something unexpected string', () => {
    cookieService.deleteAll();
    cookieService.set('noShow', 'dlskjfhakh');
    userInfoService = new UserInfoService(cookieService);
    expect(userInfoService.getnoMessage()).toBe(false);
  });

  it('getnoMessage should be false because cookie contains something unexpected number', () => {
    cookieService.deleteAll();
    cookieService.set('noShow', '1');
    userInfoService = new UserInfoService(cookieService);
    expect(userInfoService.getnoMessage()).toBe(false);
  });

  it('The noMessage boolean should be switch', () => {
    cookieService.deleteAll();
    userInfoService = new UserInfoService(cookieService);
    const beforeCallingtheMethod: boolean = userInfoService.getnoMessage();
    userInfoService.tickCheckBox();
    expect(userInfoService.getnoMessage()).toBe(!beforeCallingtheMethod);
  });

  it('The noMessage boolean should be True by passing true to the method', () => {
    cookieService.deleteAll();
    userInfoService = new UserInfoService(cookieService);
    userInfoService.setCheckboxValue(true);
    expect(userInfoService.getnoMessage()).toBe(true);
  });

  it('The noMessage boolean should be False by passing true to the method', () => {
    cookieService.deleteAll();
    userInfoService = new UserInfoService(cookieService);
    userInfoService.setCheckboxValue(false);
    expect(userInfoService.getnoMessage()).toBe(false);
  });

});

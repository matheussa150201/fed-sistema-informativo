import { TestBed } from '@angular/core/testing';

import { GuardRotaGuard } from './guard-rota.guard';

describe('GuardRotaGuard', () => {
  let guard: GuardRotaGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(GuardRotaGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});

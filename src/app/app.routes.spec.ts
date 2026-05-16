import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';

import { routes } from './app.routes';

describe('App routes', () => {
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter(routes)],
    }).compileComponents();

    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('opens welcome route on /', async () => {
    await router.navigateByUrl('/');

    expect(router.url).toBe('/');
    expect(location.path()).toBe('');
  });

  it('opens menu route on /menu', async () => {
    await router.navigateByUrl('/menu');

    expect(router.url).toBe('/menu');
    expect(location.path()).toBe('/menu');
  });

  it('redirects unknown paths to home', async () => {
    await router.navigateByUrl('/unknown-page');

    expect(router.url).toBe('/');
  });
});

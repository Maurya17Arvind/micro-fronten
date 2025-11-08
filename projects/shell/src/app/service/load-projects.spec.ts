import { TestBed } from '@angular/core/testing';

import { LoadProjects } from './load-projects';

describe('LoadProjects', () => {
  let service: LoadProjects;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoadProjects);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProjectNewsService } from './project-news.service';

describe('ProjectNewsService', () => {
  let service: ProjectNewsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProjectNewsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

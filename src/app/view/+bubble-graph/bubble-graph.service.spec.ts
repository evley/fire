import { TestBed } from '@angular/core/testing';

import { BubbleGraphService } from './bubble-graph.service';

describe('BubbleGraphService', () => {
  let service: BubbleGraphService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BubbleGraphService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

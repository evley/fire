import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BubbleGraphComponent } from './bubble-graph.component';

describe('BubbleGraphComponent', () => {
  let component: BubbleGraphComponent;
  let fixture: ComponentFixture<BubbleGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BubbleGraphComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BubbleGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

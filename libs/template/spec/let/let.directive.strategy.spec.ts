import {
  ChangeDetectorRef,
  Component,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import { EMPTY, interval, NEVER, Observable, of, throwError } from 'rxjs';
import { async, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { LetDirective } from '../../src/lib/let';
import { take } from 'rxjs/operators';
import { MockChangeDetectorRef } from '../fixtures';

@Component({
  template: `
    <ng-container
      *rxLet="value$; let value; $error as error; $complete as complete"
      >{{ (value | json) || 'undefined' }}</ng-container
    >
  `
})
class LetDirectiveTestComponentStrategy {
  value$: Observable<number> = of(42);
}

let fixtureLetDirectiveTestComponent: any;
let letDirectiveTestComponent: {
  strategy: any;
  value$: Observable<any> | undefined | null;
};
let componentNativeElement: any;

const setupLetDirectiveTestComponentStrategy = (): void => {
  TestBed.configureTestingModule({
    declarations: [LetDirectiveTestComponentStrategy, LetDirective],
    providers: [
      { provide: ChangeDetectorRef, useClass: MockChangeDetectorRef },
      TemplateRef,
      ViewContainerRef
    ]
  });
  fixtureLetDirectiveTestComponent = TestBed.createComponent(
    LetDirectiveTestComponentStrategy
  );
  letDirectiveTestComponent =
    fixtureLetDirectiveTestComponent.componentInstance;
  componentNativeElement = fixtureLetDirectiveTestComponent.nativeElement;
};

describe('LetDirective when using strategy', () => {
  beforeEach(async(setupLetDirectiveTestComponentStrategy));

  it('should work with different if a strategy other than the default', () => {
    letDirectiveTestComponent.value$ = of(1, 2, 3, 4, 5);
    letDirectiveTestComponent.strategy = 'local';
    fixtureLetDirectiveTestComponent.detectChanges();
    expect(componentNativeElement.textContent).toBe('5');
  });
});

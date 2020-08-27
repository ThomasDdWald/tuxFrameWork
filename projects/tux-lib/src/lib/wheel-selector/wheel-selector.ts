import {
  Component, ViewChild, Input, ViewChildren, QueryList, AfterViewInit, Output,
  EventEmitter, SimpleChanges, OnChanges, forwardRef,
} from '@angular/core';
import { TuxWheelSelectorItemComponent, ItemState } from './wheel-selector-item';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'tux-wheel-selector',
  templateUrl: './wheel-selector.html',
  styleUrls: ['./wheel-selector.scss'],
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => TuxWheelSelectorComponent), multi: true },
  ]
})
export class TuxWheelSelectorComponent implements ControlValueAccessor, AfterViewInit, OnChanges {
  ELEMENT_WIDTH = 84;
  VISIBLE_NUMBERS = 5;
  externalMargin: number = this.ELEMENT_WIDTH * this.VISIBLE_NUMBERS / 2 - this.ELEMENT_WIDTH / 2;
  previousScrollPosition = 0;
  options: Array<any> = [];
  touching = false;
  @ViewChild('container') container: any;
  @ViewChildren(TuxWheelSelectorItemComponent) numberList: QueryList<TuxWheelSelectorItemComponent>;
  @Input() min = 10;
  @Input() max = 67;
  @Input() stepCombinations: Array<any>;
  // Related to the options index
  current = 0;
  // Related to the options value (options[current])
  @Input() value: any = this.min;
  @Input() label = '';
  @Output() change = new EventEmitter<any>();

  private snapOnTouchendTimer: any = null;
  // private _clientXMouseDown: number;
  // private _mouseDown: boolean = false;

  // Temporary scroll function, in ngAfterViewInit is being set with the real functionality
  scroll: any = (event) => { };

  propagateChange: any = (value: any) => { };

  constructor() { }

  ngAfterViewInit(): void {
    // To prevent the error ExpressionChangedAfterItHasBeenCheckedError
    Promise.resolve(null).then(() => {
      // if we receive an array of combinations we set min and max values
      this.setOptions();

      // After set options we need a bit of time to get again the numberList
      setTimeout(() => {
        // Updates the UI regarding the value
        // this.current = this.getIndexFromValue(this.value);
        // this.value = this.options[this.current];
        // this.updateValue(this.value);
        // Calculating the sizes
        this.updateUI();
        this.resize();
      }, 50);

      // Activating the scroll functionality after everything is initializated
      setTimeout(() => {
        this.scroll = (event) => {
          event.preventDefault();
          event.stopPropagation();
          // Snap when the scroll stops
          this.scheduleSnap();
          this.updateState();
        };
      }, 250);
    });
  }

  setOptions(): void {
    if (this.stepCombinations && this.stepCombinations.length) {
      this.min = 0;
      this.max = this.stepCombinations.length - 1;
      this.options = this.stepCombinations;
    } else {
      const options = [];
      for (let index = 0, value = this.min; value <= this.max; index++ , value++) {
        options[index] = value;
      }
      this.options = options;
    }
  }

  touchstart(event): void {
    // this._clientXMouseDown = event.clientX;
    this.touching = true;
  }

  touchend(event): void {
    this.touching = false;
    // If touchend should run snaptoNearest() only if is not scrolling
    this.scheduleSnap();
  }

  scheduleSnap(): void {
    try {
      clearTimeout(this.snapOnTouchendTimer);
    } catch (error) { }

    this.snapOnTouchendTimer = setTimeout(() => {
      this.snaptoNearest();
      // To improve the general behaivor, we emit the change event on snap
      this.change.emit(this.value);
      this.propagateChange(this.value);
    }, 100);
  }

  snaptoNearest(): void {
    this.container.nativeElement.scrollLeft = this.current * this.ELEMENT_WIDTH;
  }

  updateState(): void {
    this.select(this.findNearestSelection());
  }

  updateUI(): void {
    if (typeof this.numberList === 'undefined') {
      return;
    }

    this.numberList.map((numbers: TuxWheelSelectorItemComponent, index) => {
      switch (index) {
        case this.current:
          numbers.setState(ItemState.ACTIVE);
          break;

        case this.current - 1:
        case this.current + 1:
          numbers.setState(ItemState.BESIDE_ACTIVE);
          break;

        case this.current - 2:
        case this.current + 2:
          numbers.setState(ItemState.ENDS);
          break;

        default:
          numbers.setState(ItemState.DEFAULT);
      }
    });
  }

  findNearestSelection(): number {
    const containerCenter = this.container.nativeElement.clientWidth / 2;
    const scrollCenter = this.container.nativeElement.scrollLeft + containerCenter - this.externalMargin;
    return Math.floor(scrollCenter / this.ELEMENT_WIDTH);
  }

  select(selected): void {
    if (selected !== this.current) {
      this.current = selected;
      this.value = this.options[this.current];
      this.updateUI();
      // this.change.emit(this.value);
      // this.propagateChange(this.value);
    }
  }

  getIndexFromValue(value: any): number {
    let index = this.options.indexOf(value);
    // Value not found
    if (index < 0) {
      index = 0;
    }
    return index;
  }

  updateValue(value: any): void {
    this.current = this.getIndexFromValue(value);
    this.value = this.options[this.current];
    this.updateUI();
    this.scheduleSnap();
  }

  // ControlValueAccessor Implementation
  writeValue(value: any): void {
    this.updateValue(value);
  }

  registerOnChange(fn: any): void {
    if (typeof fn === 'function') {
      this.propagateChange = fn;
    }
  }

  registerOnTouched(fn: any): void { }
  // End: ControlValueAccessor Implementation

  ngOnChanges(inputs: SimpleChanges): void {
    for (const key in inputs) {
      if (inputs.hasOwnProperty(key)) {
        this[key] = inputs[key].currentValue;
      }
    }
    this.setOptions();

    if (inputs.value) {
      this.updateValue(inputs.value.currentValue);
    }
  }

  resize(): void {
    this.ELEMENT_WIDTH = this.container.nativeElement.clientWidth / this.VISIBLE_NUMBERS;
    // Minimum element width size
    this.ELEMENT_WIDTH = this.ELEMENT_WIDTH < 56 ? 56 : this.ELEMENT_WIDTH;
    this.externalMargin = this.ELEMENT_WIDTH * this.VISIBLE_NUMBERS / 2 - this.ELEMENT_WIDTH / 2;
    this.numberList.map((num: TuxWheelSelectorItemComponent, index) => {
      num.setWidth(this.ELEMENT_WIDTH);
    });
    this.scheduleSnap();
  }

  /*
  mousedown(event) {
    this._mouseDown = true;
    this._clientXMouseDown = event.clientX;
  }

  mouseup(event) {
    this._mouseDown = false;
    this.touchend(event);
    // this.snaptoNearest();
  }

  mousemove(event) {
    if (!this._mouseDown) {
      return;
    }
    // right = -1, left = 1;
    let direction = 1;
    let distance = this._clientXMouseDown - event.clientX;
    if (this._clientXMouseDown < event.clientX) {
      direction = -1;
      distance = event.clientX - this._clientXMouseDown;
    }
    // console.log('mousemove touching, event.clientX, _clientXMouseDown', this.touching, event.clientX, this._clientXMouseDown);
    // console.log('distance', distance * direction);
    let _scrollTo = this.container.nativeElement.scrollLeft + distance * direction;
    const _maxScroll = this.ELEMENT_WIDTH * (this.options.length - 1);
    if (_scrollTo < 0) {
      _scrollTo = 0;
    } else if (_scrollTo > _maxScroll) {
      _scrollTo = _maxScroll;
    }
    // console.log('scrollLeft', this.container.nativeElement.scrollLeft, '_scrollTo', _scrollTo);
    this.container.nativeElement.scrollLeft = _scrollTo;
  }
  */

  /*
  getVelocity() {
    const currentPosition = this.container.nativeElement.scrollLeft;
    const velocity = Math.abs(this.previousScrollPosition - currentPosition);
    this.previousScrollPosition = currentPosition;
    // console.log('vel', velocity, this.touching);
    return velocity;
  }
  */

}

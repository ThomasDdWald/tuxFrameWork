import { Component, Input } from '@angular/core';

export enum ItemState {
  DEFAULT = '',
  ACTIVE = 'active',
  BESIDE_ACTIVE = 'beside',
  ENDS = 'ends',
}

@Component({
  selector: 'tux-wheel-number',
  templateUrl: './wheel-selector-item.html',
  styleUrls: ['./wheel-selector-item.scss']
})

export class TuxWheelSelectorItemComponent {
  state = ItemState.DEFAULT;
  width = 84;

  @Input() number: number;

  public setState(state: ItemState): void  {
    this.state = state;
  }

  public setWidth(width: number): void {
    this.width = width;
  }
}

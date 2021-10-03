export type SortDirection = 'asc' | 'desc' | '';

export interface ISortState {
  column: string;
  direction: SortDirection;
}

export class SortState implements ISortState {
  column = 'id'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export class SortStateTable implements ISortState {
  column = 'allotedDate'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export interface ISortView {
  sorting: SortState;
  ngOnInit(): void;
  sort(column: string): void;
}

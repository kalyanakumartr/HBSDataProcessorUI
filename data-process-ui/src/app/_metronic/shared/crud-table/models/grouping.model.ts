export interface IGroupingState {
  selectedRowIds: Set<string>;
  itemIds: string[];
  checkAreAllRowsSelected(): boolean;
  selectRow(id: string): IGroupingState;
  // tslint:disable-next-line:variable-name
  clearRows(_itemIds: string[]): IGroupingState;
  isRowSelected(id: string): boolean;
  selectAllRows(): IGroupingState;
  getSelectedRows(): string[];
  getSelectedRowsCount(): number;
}

export class GroupingState implements IGroupingState {
  selectedRowIds: Set<string> = new Set<string>();
  itemIds = [];


  checkAreAllRowsSelected(): boolean {
    if (this.itemIds.length === 0) {
      return false;
    }

    return this.selectedRowIds.size === this.itemIds.length;
  }

  selectRow(id: string): GroupingState {
    if (this.selectedRowIds.has(id)) {
      this.selectedRowIds.delete(id);
    } else {
      this.selectedRowIds.add(id);
    }
    return this;
  }

  // tslint:disable-next-line:variable-name
  clearRows(_itemIds: string[]): GroupingState {
    this.itemIds = _itemIds;
    this.selectedRowIds = new Set<string>();
    return this;
  }

  isRowSelected(id: string): boolean {
    return this.selectedRowIds.has(id);
  }

  selectAllRows(): GroupingState {
    const areAllSelected = this.itemIds.length === this.selectedRowIds.size;
    if (areAllSelected) {
      this.selectedRowIds = new Set<string>();
    } else {
      this.selectedRowIds = new Set<string>();
      this.itemIds.forEach(id => this.selectedRowIds.add(id));
    }
    return this;
  }

  getSelectedRows(): string[] {
    return Array.from(this.selectedRowIds);
  }

  getSelectedRowsCount(): number {
    return this.selectedRowIds.size;
  }
}

export interface IGroupingView  {
  grouping: GroupingState;
  ngOnInit(): void;
}

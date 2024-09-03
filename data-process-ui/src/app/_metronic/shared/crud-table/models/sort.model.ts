export type SortDirection = 'asc' | 'desc' | '';

export interface ISortState {
  column: string;
  direction: SortDirection;
}

export class SortState implements ISortState {
  column = 'createdDate'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortStateTable implements ISortState {
  column = 'allotedDate'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortStateAttendance implements ISortState {
  column = 'timesheetId'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export class SortStateLeave implements ISortState {
  column = 'createdDate'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortStateProject implements ISortState {
  column = 'projectDetail.modifiedDate'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortGroupTeam implements ISortState {
  column = 'groupName'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export class SortStateRoadType implements ISortState {
  column = 'roadName'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortWorkflow implements ISortState {
  column = 'group.groupName'; // Id by default
  direction: SortDirection = 'desc'; // asc by default;
}
export class SortProcess implements ISortState {
  column = 'process.processName'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export class SortSubcountry implements ISortState {
  column = 'subCountry.countryName'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export class SortTeamTransfer implements ISortState {
  column = 'userName'; // Id by default
  direction: SortDirection = 'asc'; // asc by default;
}
export interface ISortView {
  sorting: SortState;
  ngOnInit(): void;
  sort(column: string): void;
}

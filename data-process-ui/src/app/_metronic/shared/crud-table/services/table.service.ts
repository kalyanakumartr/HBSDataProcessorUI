// tslint:disable:variable-name
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { PaginatorState } from '../models/paginator.model';
import { ITableState, TableResponseModel } from '../models/table.model';
import { BaseModel } from '../models/base.model';
import { SortState } from '../models/sort.model';
import { GroupingState } from '../models/grouping.model';
import { environment } from '../../../../../environments/environment';
import { AuthModel } from 'src/app/modules/auth/_models/auth.model';

const DEFAULT_STATE: ITableState = {
  filter: {},
  paginator: new PaginatorState(),
  sorting: new SortState(),
  searchTerm: '',
  divisionId: '',
  departmentId: '',
  projectId: '',
  groupId:'',
  teamId:'',
  type:'',
  clientName:'',
  status:'',
  fromDate: '',
  toDate: '',
  workUnitId:  '',
  startWUMiles: '',
  endWUMiles: '',
  reasonId: '',
  roadTypeMapId: '',
  startAssignedDate: '',
  startProcessedDate: '',
  receivedDate: '',
  endAssignedDate: '',
  endProcessedDate: '',
  endReceivedDate: '',
  teamName: '',
  subCountryId: '',
  isAdvanceSearch:false,
  isDirectReport:true,
  grouping: new GroupingState(),
  entityId: undefined
};

export abstract class TableService<T> {
  // Private fields
  private _items$ = new BehaviorSubject<T[]>([]);
  private _headers$ = new BehaviorSubject<T[]>([]);
  private _isLoading$ = new BehaviorSubject<boolean>(false);
  private _isFirstLoading$ = new BehaviorSubject<boolean>(true);
  public _tableState$ = new BehaviorSubject<ITableState>(DEFAULT_STATE);
  private _errorMessage = new BehaviorSubject<string>('');
  private _subscriptions: Subscription[] = [];
  private authLocalStorageToken = `${environment.appVersion}-${environment.USERDATA_KEY}`;
  private _leaveBalanceCount$ :number;
  private _approvedLeaveCount$ :number;
  private _unApprovedLeaveCount$ :number;

  get approvedLeaveCount$():number {
    return this._approvedLeaveCount$;
  }
  get leaveBalanceCount$() {
    return this._leaveBalanceCount$;
  }
  get unApprovedLeaveCount$() {
    return this._unApprovedLeaveCount$;
  }
  // Getters
  get items$() {
    return this._items$.asObservable();
  }
  get headers$() {
    return this._headers$.asObservable();
  }
  get isLoading$() {
    return this._isLoading$.asObservable();
  }
  get isFirstLoading$() {
    return this._isFirstLoading$.asObservable();
  }
  get errorMessage$() {
    return this._errorMessage.asObservable();
  }
  get subscriptions() {
    return this._subscriptions;
  }
  // State getters
  get paginator() {
    return this._tableState$.value.paginator;
  }
  get filter() {
    return this._tableState$.value.filter;
  }
  get sorting() {
    return this._tableState$.value.sorting;
  }
  get searchTerm() {
    return this._tableState$.value.searchTerm;
  }
  get grouping() {
    return this._tableState$.value.grouping;
  }

  protected http: HttpClient;
  // API URL has to be overrided
  API_URL = `${environment.adminApiUrl}`;
  REPORT_API_URL = `${environment.reportsApi}`;
  VIEW_API_URL = `${environment.viewApiUrl}`;
  constructor(http: HttpClient) {
    // if(this instanceof LeaveModel || this instanceof AttendanceModel || this instanceof TimeSheetModel){
    //  this.API_URL = `${environment.taleApi}`;
    // }
    this.http = http;
  }

  // CREATE
  // server should return the object with ID
  create(item: BaseModel,path: string, formUser:string): Observable<any> {

    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    if(path.endsWith("Project")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formProject: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else if(path.endsWith("RoadType")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formRoadType: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else if(path.endsWith("GroupTeam")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formGroup: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else if(path.endsWith("Process")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formProcess: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else if(path.endsWith("Country")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formGroup: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }
    else if(path.endsWith("AllocationGroup")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, item,{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else{
      return this.http.post<BaseModel>(this.API_URL+path, {formUser: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('CREATE ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }

  }

  // READ (Returning filtered list of entities)
  find(tableState: ITableState ,path: string): Observable<TableResponseModel<T>> {
    console.log("Inside find >>>");
    var url ='';
    if(path.endsWith("Report")){
      url = this.REPORT_API_URL + path;//'/searchUser';
    }else if(path.endsWith("Project")){
      url = this.VIEW_API_URL + path;//'/searchProject';
    }else if(path.endsWith("RoadType")){
      url = this.VIEW_API_URL + path;//'/searchRoadType';
    }else if(path.endsWith("GroupTeam")){
      url = this.VIEW_API_URL + path;//'/searchGroupTeam';
    }else if(path.endsWith("Transfer")){
      url = this.VIEW_API_URL + path;//'/searchTransfer';
    }else if(path.endsWith("Process")){
      url = this.VIEW_API_URL + path;//'/searchProcess';
    }else if(path.endsWith("Country")){
      url = this.VIEW_API_URL + path;//'/searchProcess';
    }else if(path.endsWith("AllocationGroup")){
      url = this.VIEW_API_URL + path;//'/searchAllocationGroup';
    }     else{
       url = this.API_URL + path;//'/searchUser';
    }
    this._errorMessage.next('');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    return this.http.post<TableResponseModel<T>>(url, tableState,{headers: httpHeaders}).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('FIND ITEMS', err);
        return of({ items: [],headerList: [], total: 0, leaveBalanceCount: 0, approvedLeaveCount:0, unApprovedLeaveCount:0 });
      })
    );
  }


  getItemById(id: string, c?: string): Observable<BaseModel> {
    this._isLoading$.next(true);

    var url = `${this.API_URL}/${id}`;
    if (typeof c !== 'undefined') {
      url = `${this.VIEW_API_URL}/getProject/${id}`;
    }
    return this.http.get<BaseModel>(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('GET ITEM BY IT', id, err);
        return of({ id: undefined });
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // UPDATE
  update(item: BaseModel,path: string, formUser:string): Observable<any> {
    var url = `${this.API_URL}`;
    if(path.endsWith("Project")){
      url = `${this.VIEW_API_URL}`;
    }
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,
    });
    if(path.endsWith("Project")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formProject: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else  if(path.endsWith("Process")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formProcess: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );}
    else  if(path.endsWith("RoadType")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, item,{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else  if(path.endsWith("Country")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formRoadType: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }


    else  if(path.endsWith("GroupTeam")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path, {formGroup: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else  if(path.endsWith("AllocationGroup")){
      return this.http.post<BaseModel>(this.VIEW_API_URL+path,  item,{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }else{
      return this.http.post<BaseModel>(this.API_URL+path, {formUser: item},{headers: httpHeaders}).pipe(
        catchError(err => {
          this._errorMessage.next(err);
          console.error('Update ITEM', err);
          return of({ id: undefined });
        }),
        finalize(() => this._isLoading$.next(false))
      );
    }

  }

  // UPDATE Status
  updateStatusForItems(ids: string[], status: number): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const body = { ids, status };
    const url = this.API_URL + '/updateStatus';
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('UPDATE STATUS FOR SELECTED ITEMS', ids, status, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // DELETE
  delete(id: any): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = `${this.API_URL}/${id}`;
    return this.http.delete(url).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE ITEM', id, err);
        return of({});
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  // delete list of items
  deleteItems(ids: string[] = []): Observable<any> {
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const url = this.API_URL + '/deleteItems';
    const body = { ids };
    return this.http.put(url, body).pipe(
      catchError(err => {
        this._errorMessage.next(err);
        console.error('DELETE SELECTED ITEMS', ids, err);
        return of([]);
      }),
      finalize(() => this._isLoading$.next(false))
    );
  }

  public fetch(path:string) {
    console.log("Inside Fetch Path is >>>>" , path);
    if(path==""){
      path="/searchUser"
    }
    this._isLoading$.next(true);
    this._errorMessage.next('');
    const request = this.find(this._tableState$.value, path)
      .pipe(
        tap((res: TableResponseModel<T>) => {
          this._items$.next(res.items);
          this._headers$.next(res.headerList);
          this._leaveBalanceCount$=res.leaveBalanceCount;
          this._approvedLeaveCount$=res.approvedLeaveCount;
          this._unApprovedLeaveCount$=res.unApprovedLeaveCount;
          this.patchStateWithoutFetch({
            paginator: this._tableState$.value.paginator.recalculatePaginator(
              res.total
            ),
          });
        }),
        catchError((err) => {
          this._errorMessage.next(err);
          return of({
            items: [],
            total: 0
          });
        }),
        finalize(() => {
          this._isLoading$.next(false);
          const itemIds = this._items$.value.map((el: T) => {
            const item = (el as unknown) as BaseModel;
            return item.id;
          });
          this.patchStateWithoutFetch({
            grouping: this._tableState$.value.grouping.clearRows(itemIds),
          });
        })
      )
      .subscribe();
    this._subscriptions.push(request);
  }
  public exportExcel(path:string,serverType:string) {
    console.log("Inside exportExcel Path is >>>>" , path);
    if(path==""){
      path="/exportToExcelOperRecord"
    }
   // this._isLoading$.next(true);
   this._tableState$.value.paginator.pageSize=100;
    this._errorMessage.next('');
    var url ='';
    if(serverType == 'Admin'){
      url = this.API_URL + path;//'/searchUser';
    }else if(serverType == 'Report'){
      url = this.REPORT_API_URL + path;//'/searchUser';
    }else if(serverType == 'Project'){
      url = this.VIEW_API_URL + path;//'/searchUser';
    }
    else if(serverType == 'Country'){
      url = this.VIEW_API_URL + path;//'/searchUser';
    }

    this._errorMessage.next('');
    const httpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getAuthFromLocalStorage().access_token}`,

    });
    return this.http.post(url, this._tableState$.value,{headers: httpHeaders,responseType: 'blob'});

  }

  public setDefaults() {
    this.patchStateWithoutFetch({ filter: {} });
    this.patchStateWithoutFetch({ sorting: new SortState() });
    this.patchStateWithoutFetch({ grouping: new GroupingState() });
    this.patchStateWithoutFetch({ searchTerm: '' });
    this.patchStateWithoutFetch({ divisionId: '' });
    this.patchStateWithoutFetch({ departmentId: '' });
    this.patchStateWithoutFetch({ projectId: '' });
    this.patchStateWithoutFetch({ workUnitId: '' });
    this.patchStateWithoutFetch({ startWUMiles: '' });
    this.patchStateWithoutFetch({ endWUMiles: '' });
    this.patchStateWithoutFetch({ reasonId: '' });
    this.patchStateWithoutFetch({ roadTypeMapId: '' });
    this.patchStateWithoutFetch({ startAssignedDate: '' });
    this.patchStateWithoutFetch({ startProcessedDate: '' });
    this.patchStateWithoutFetch({ receivedDate: '' });
    this.patchStateWithoutFetch({ endAssignedDate: '' });
    this.patchStateWithoutFetch({ endProcessedDate: '' });
    this.patchStateWithoutFetch({ endReceivedDate: '' });
    this.patchStateWithoutFetch({ teamName: '' });
    this.patchStateWithoutFetch({ subCountryId: '' });
    this.patchStateWithoutFetch({
      paginator: new PaginatorState()
    });
    this._isFirstLoading$.next(true);
    this._isLoading$.next(true);
    this._tableState$.next(DEFAULT_STATE);
    this._errorMessage.next('');
  }

  // Base Methods
  public patchState(patch: Partial<ITableState>, path:string) {
    console.log("PatchState",path);
    this.patchStateWithoutFetch(patch);
    this.fetch(path);
  }

  public patchStateWithoutFetch(patch: Partial<ITableState>) {
    const newState = Object.assign(this._tableState$.value, patch);
    this._tableState$.next(newState);
  }
  public getAuthFromLocalStorage(): AuthModel {
    try {
      const authData = JSON.parse(
        localStorage.getItem(this.authLocalStorageToken)
      );
      return authData;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }
}

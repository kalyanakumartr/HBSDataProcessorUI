import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of, Subscription } from 'rxjs';
import { catchError, first, tap } from 'rxjs/operators';
import { AuthService, ConfirmPasswordValidator, UserModel } from '../../auth';
import { UsersService } from '../../auth/_services/user.service';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.scss']
})
export class UpdatePasswordComponent implements OnInit {
  id:string;
  name:string;
  formGroup: FormGroup;
  password:string;
  inputType:string;
  inputType1:string;
  user$: Observable<UserModel>;
  firstUserState: UserModel;
  subscriptions: Subscription[] = [];
  isLoading$: Observable<boolean>;

  constructor( private snackBar: MatSnackBar, private usersService: UsersService, private auth: AuthService,private fb: FormBuilder) {
    //this.isLoading$ = this.userService.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.user$ = this.auth.currentUserSubject.asObservable();
    this.user$.pipe(first()).subscribe(value => { this.id=value.userId; this.name =value.userName;});
     this.loadForm();
     this.inputType="password";
     this.inputType1="password";
  }
  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
      verticalPosition:"top"
    });
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }

  loadForm() {
    this.formGroup = this.fb.group({
      password: ['', Validators.required],
      cPassword: ['', Validators.required]
    }, {
      validator: ConfirmPasswordValidator.MatchPassword
    });
  }

  save() {
    this.formGroup.markAllAsTouched();
    if (!this.formGroup.valid) {
      return;
    }

    this.password = this.formGroup.value.password;


    const sbUpdate = this.usersService.changePassword(this.id, this.password).pipe(
      tap(() => {
      }),
      catchError((errorMessage) => {
        this.openSnackBar(errorMessage,"X");
        return of(this.password);
      }),
    ).subscribe(res =>this.openSnackBar(res.messageCode?"Password Update Successful":res,"!!"));
  }

  cancel() {
    this.password ='';
    this.loadForm();
  }
  public showPassword(event:any):void
  {
    if(event.target.checked){
      //alert('Checked');
      this.inputType="text";
    }
    else
    {
      this.inputType="password";
    }
  }

  public newpassword(event:any):void
  {
    if(event.target.checked){
      //alert('Checked');
      this.inputType1="text";
    }
    else
    {
      this.inputType1="password";
    }
  }
  // helpers for View
  isControlValid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.valid && (control.dirty || control.touched);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGroup.controls[controlName];
    return control.invalid && (control.dirty || control.touched);
  }

  controlHasError(validation, controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.hasError(validation) && (control.dirty || control.touched);
  }

  isControlTouched(controlName): boolean {
    const control = this.formGroup.controls[controlName];
    return control.dirty || control.touched;
  }
}

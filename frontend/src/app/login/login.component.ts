import {Component} from '@angular/core';
import {Router, RouterOutlet} from "@angular/router";
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import {PokeerbaseService} from "../_services/pokeerbase.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    RouterOutlet,
    ReactiveFormsModule,
    NgIf
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  formGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]]
  });
  authFailed: string | null = null;

  constructor(private pb: PokeerbaseService, private fb: FormBuilder, private router: Router) {
  }

  public login() {
    if (this.formGroup.valid) {
      const authData = this.pb.login(this.formGroup.get('email')!.value!, this.formGroup.get('password')!.value!);
      authData.catch(reason => reason.toString() === 'ClientResponseError 400: Failed to authenticate.' ?
            this.authFailed = 'Auth failed. Verify your email and password are correct or register first.' :
            reason.toString() === 'ClientResponseError 403: Please verify your email first.' ?
              this.authFailed = 'Please verify your email first.' :
              this.authFailed = 'Some wierd happened'
      ).finally(() => {
        if (this.pb.isLoggedIn()) {
          this.router.navigate(['tables']);
        }
      })
    }
  }

  public register() {
    if (this.formGroup.valid) {
      const authData = this.pb.register(this.formGroup.get('email')!.value!, this.formGroup.get('password')!.value!);
      authData.catch(reason => {
          return reason.toString() === 'ClientResponseError 400: Failed to create record.' ?
            this.authFailed = 'Register validation failed.' :
            this.authFailed = 'Some wierd happened'
        }
      ).finally(() => {
        if (!this.authFailed) {
          alert("Confirm your email, then log in.");
          this.router.navigate(['/login']);
        }
      })
    }
  }

  public forgotPassword() {
    if (this.formGroup.get('email')?.valid) {
      this.pb.forgotPassword(this.formGroup.get('email')!.value!);
      alert('You will get an email with instructions to reset your password.')
      this.router.navigate(['/login']);
    } else {
      alert('Please enter your email-address and try again.')
    }
  }
}

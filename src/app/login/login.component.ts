import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfigService } from '../config.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm!: FormGroup;
  isError = false;

  constructor(private service: ConfigService, private router: Router) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl(''),
      password: new FormControl('')
    });

  }

  Login() {
    console.log(this.loginForm.value);
    // this.router.navigate(['/home']);
    this.service.getLoginData(this.loginForm.controls['username'].value, this.loginForm.controls['password'].value).subscribe(
      data => {
        console.log("response : ", data)
        this.router.navigate(['/home']);
        this.isError = false;
      },
      error => {
        console.log("error : ", error);
        this.isError = true;
      })
  }

}

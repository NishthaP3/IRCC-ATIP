import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe } from '@angular/common'

export interface DataObject {
  age: number,
  application_date: Date,
  biometric_date: Date,
  birth_date: Date,
  citizenship: string,
  course_name: string,
  email_address: string,
  full_name: string,
  gender: string,
  institution_name: string,
  intake: string,
  marital_status: string,
  medical_date: Date,
  medical_update_date: Date,
  passport_issue_date: Date,
  passport_number: string,
  phone_number: number,
  visa_category: string,
  _id: string
}


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  // animations: [
  //   trigger('detailExpand', [
  //     state('collapsed', style({ height: '0px', minHeight: '0' })),
  //     state('expanded', style({ height: '*' })),
  //     transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
  //   ])
  // ]
})
export class HomeComponent implements OnInit, AfterViewInit {

  currentFile?: File;
  progress = 0;
  message = '';
  fileName = '';
  fileInfos?: Observable<any>;
  uploadSuccessful = false;
  fileControl!: FormControl;
  color: ThemePalette = 'primary';
  accept: string = '.csv';
  files: any;

  displayedColumns = ['id', 'full_name', 'passport_number', 'visa_category', 'intake', 'application_date', 'biometric_date', 'medical_update_date'];
  // 'medical_date',
  columnNames: any = {
    'full_name': 'Name', 'visa_category': 'Visa Category', 'intake': 'Intake',
    'application_date': 'Application Date', 'biometric_date': 'Biometric Date',
    'medical_date': 'Medical Date', 'medical_update_date': 'Medical Update Date',
    'passport_number': 'Passport Number', 'id': 'ID'
  }
  // displayedColumnsRest = ['name', 'weight', 'symbol', 'name2', 'weight2', 'symbol2'];
  dataSource = new MatTableDataSource<DataObject>([]);

  // @ViewChild(MatPaginator, {read: true}) private paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;

  private paginator!: MatPaginator;
  private sort!: MatSort;

  isSuccessMessage = "";
  isErrorMessage = "";

  filterValue!: FormControl;
  priorities = [
    { value: "app_pri", viewValue: "Application Priority" },
    { value: "med_pri", viewValue: "Medical Priority" },
    { value: "bio_pri", viewValue: "Biometric Priority" },]


  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    if (this.paginator && this.sort) {
      this.applyFilter('');
    }
  }


  constructor(private service: ConfigService, public datepipe: DatePipe) {
    this.fileControl = new FormControl(this.files, [
      // Validators.required
    ])
    this.filterValue = new FormControl('')
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
    this.loadData();
  }

  selectFile(event: any): void {
    if (event.target.files && event.target.files[0]) {
      const file: File = event.target.files[0];
      this.currentFile = file;
      this.fileName = this.currentFile.name;
    } else {
      // this.fileName = 'Select File';
    }
  }

  upload(): void {
    this.progress = 0;
    // this.message = "";
    console.log("current file : ", this.fileControl.value)
    if (this.fileControl.value) {
      this.service.upload(this.fileControl.value).subscribe(
        (event: any) => {
          this.uploadSuccessful = true;
          this.isSuccessMessage = "File uploaded successfully"
          // this.issucc = true
        },
        (err: any) => {
          console.log(err);
          this.progress = 0;
          this.uploadSuccessful = false
          if (err.error && err.error.message) {
            this.isErrorMessage = err.error.message;
          } else {
            this.isErrorMessage = 'Could not upload the file!';
          }
          // this.isMessage = true;
        });
    }
  }

  dataReceived = false;
  loadData() {
    this.isSuccessMessage = "";
    this.isErrorMessage = "";
    this.fileControl.setValue(null);
    this.service.getData().subscribe(
      (data: any) => {
        console.log("response : ", data)
        // this.router.navigate(['/home']);
        const tempData: DataObject[] | undefined = []
        let i = 0;
        for (let d of data) {
          d.id = ++i;
          if (d.birth_date) {
            d.birth_date = this.datepipe.transform(new Date(d.birth_date['$date']), 'yyyy-MM-dd');
          }
        }
        this.dataReceived = true
        this.dataSource.data = data;
        console.log("datasource : ", this.dataSource.data)
      },
      error => {
        console.log("error : ", error)
      })
  }

  getUpdatedData() {
    this.isSuccessMessage = "";
    this.isErrorMessage = "";
    this.fileControl.setValue(null);
    this.service.updatedData().subscribe(
      (res: any) => {
        console.log("response : ", res)
        // this.router.navigate(['/home']);
        // const tempData: DataObject[] | undefined = []
        this.service.getData().subscribe(
          (data: any) => {
            const i = 0;
            for (let d of data) {
              d.id = i + 1;
              if (d.birth_date) {
                d.birth_date = this.datepipe.transform(new Date(d.birth_date['$date']), 'yyyy-MM-dd');
              }
            }
            this.dataReceived = true
            this.dataSource.data = data;
            console.log("datasource : ", this.dataSource.data)
          }
          ,
          error => {
            console.log("error : ", error)
          }
        )

      },
      error => {
        console.log("error : ", error)
      })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}

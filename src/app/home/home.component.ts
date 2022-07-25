import { HttpEventType, HttpResponse } from '@angular/common/http';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { Observable } from 'rxjs';
import { ConfigService } from '../config.service';

import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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

  displayedColumns = ['full_name', 'visa_category', 'intake', 'application_date', 'biometric_date', 'medical_date', 'medical_update_date'];
  columnNames: any = {
    'full_name': 'Name', 'visa_category': 'Visa Category', 'intake': 'Intake',
    'application_date': 'Application Date', 'biometric_date': 'Biometric Date',
    'medical_date': 'Medical Date', 'medical_update_date': 'Medical Update Date'
  }
  // displayedColumnsRest = ['name', 'weight', 'symbol', 'name2', 'weight2', 'symbol2'];
  dataSource = new MatTableDataSource<DataObject>([]);

  // @ViewChild(MatPaginator, {read: true}) private paginator!: MatPaginator;
  // @ViewChild(MatSort, { static: true }) sort!: MatSort;

  private paginator!: MatPaginator;
  private sort!: MatSort;

  isSuccessMessage = "";
  isErrorMessage = "";


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
  }

  ngAfterViewInit() {
    // this.dataSource.paginator = this.paginator
  }

  ngOnInit(): void {
    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
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
  getData() {
    this.isSuccessMessage = "";
    this.isErrorMessage = "";
    this.fileControl.setValue(null);
    this.service.getData().subscribe(
      (data: any) => {
        console.log("response : ", data)
        // this.router.navigate(['/home']);
        const tempData: DataObject[] | undefined = []

        for (let d of data) {
          //   if (d.application_date) {
          //     d.application_date = this.datepipe.transform(new Date(d.application_date['$date']), 'yyyy-MM-dd');
          //   }
          //   if (d.biometric_date) {
          //     d.biometric_date = this.datepipe.transform(new Date(d.biometric_date['$date']), 'yyyy-MM-dd');
          //   }
          if (d.birth_date) {
            d.birth_date = this.datepipe.transform(new Date(d.birth_date['$date']), 'yyyy-MM-dd');
          }
          //   if (d.medical_date) {
          //     d.medical_date = this.datepipe.transform(new Date(d.medical_date['$date']), 'yyyy-MM-dd');
          //   }
          //   if (d.medical_update_date) {
          //     d.medical_update_date = this.datepipe.transform(new Date(d.medical_update_date['$date']), 'yyyy-MM-dd');
          //   }
          //   if (d.passport_issue_date) {
          //     d.passport_issue_date = this.datepipe.transform(new Date(d.passport_issue_date['$date']), 'yyyy-MM-dd');
          //   }
        }
        this.dataReceived = true
        this.dataSource.data = data;
        console.log("datasource : ", this.dataSource.data)
        console.log(this.dataSource.paginator)
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;
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

  // ELEMENT_DATA: PeriodicElement[] = [
  //   { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H', name2: 'Hydrogen', weight2: 1.0079, symbol2: 'H' },
  //   { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He', name2: 'Helium', weight2: 4.0026, symbol2: 'He' },
  //   { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li', name2: 'Lithium', weight2: 6.941, symbol2: 'Li' },
  //   { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be', name2: 'Beryllium', weight2: 9.0122, symbol2: 'Be' },
  //   { position: 5, name: 'Boron', weight: 10.811, symbol: 'B', name2: 'Boron', weight2: 10.811, symbol2: 'B' },
  //   { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C', name2: 'Carbon', weight2: 12.0107, symbol2: 'C' },
  //   { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N', name2: 'Nitrogen', weight2: 14.0067, symbol2: 'N' },
  //   { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O', name2: 'Oxygen', weight2: 15.9994, symbol2: 'O' },
  //   { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F', name2: 'Fluorine', weight2: 18.9984, symbol2: 'F' },
  //   { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne', name2: 'Neon', weight2: 20.1797, symbol2: 'Ne' },
  //   { position: 11, name: 'Neon2', weight: 20.1797, symbol: 'Ne', name2: 'Neon2', weight2: 20.1797, symbol2: 'Ne' },
  //   { position: 12, name: 'Neon3', weight: 20.1797, symbol: 'Ne', name2: 'Neon3', weight2: 20.1797, symbol2: 'Ne' }
  // ];


}

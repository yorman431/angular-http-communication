import { Component, OnInit } from '@angular/core';

import { Reader } from 'app/models/reader';
import { DataService } from '../core/data.service';

@Component({
  selector: 'app-add-reader',
  templateUrl: './add-reader.component.html',
  styles: []
})
export class AddReaderComponent implements OnInit {

  constructor(private dataService: DataService) { }

  ngOnInit(): void { }

  saveReader(formValues: any): void {
    const newReader: Reader = formValues as Reader;
    newReader.readerID = 0;
    console.log(newReader);
    this.dataService.addReader(newReader)
      .subscribe(
        (data: Reader) => console.log(`${data} added successfully`),
        (err: any) => console.warn(err)
      );
  }

}

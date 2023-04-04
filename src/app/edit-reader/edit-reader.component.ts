import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Reader } from 'app/models/reader';
import { DataService } from 'app/core/data.service';
import { BadgeService } from 'app/core/badge.service';

@Component({
  selector: 'app-edit-reader',
  templateUrl: './edit-reader.component.html',
  styles: [],
  providers: [BadgeService]
})
export class EditReaderComponent implements OnInit {

  selectedReader: Reader;
  currentBadge: string;

  constructor(private route: ActivatedRoute,
              private dataService: DataService,
              private badgeService: BadgeService) { }

  ngOnInit(): void {
    const readerID: number = parseInt(this.route.snapshot.params.id, 10);
    this.dataService.getReaderById(readerID)
      .subscribe(
        (data: Reader) => this.selectedReader = data,
        (err: any) => console.warn(err)
      );
    this.currentBadge = this.badgeService.getReaderBadge(this.selectedReader.totalMinutesRead);
  }

  saveChanges(): void {
    this.dataService.updateReader(this.selectedReader)
      .subscribe(
        () => console.log(`${this.selectedReader} update successfully`),
        (err: any) => console.warn(err)
      );
  }
}

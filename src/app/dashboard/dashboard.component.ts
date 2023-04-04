import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

import { Book } from 'app/models/book';
import { Reader } from 'app/models/reader';
import { DataService } from 'app/core/data.service';
import { BookTrackerError } from '../models/bookTrackerError';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styles: []
})
export class DashboardComponent implements OnInit {

  allBooks: Book[];
  allReaders: Reader[];
  mostPopularBook: Book;

  constructor(private dataService: DataService,
              private title: Title) { }

  ngOnInit(): void {
    this.dataService.getAllBooks()
      .subscribe(
        (data: Book[] | BookTrackerError) => this.allBooks = (data as Book[]),
        (err: BookTrackerError) => console.log(err.friendlyMessage)
      );
    this.dataService.getAllReaders()
      .subscribe(
        (data: Reader[]) => this.allReaders = data,
        (err: any) => console.warn(err)
      );
    this.mostPopularBook = this.dataService.mostPopularBook;

    this.title.setTitle(`Book Tracker`);
  }

  deleteBook(bookID: number): void {
    this.dataService.deleteBook(bookID)
      .subscribe(
        () => {
          const index: number = this.allBooks.findIndex(book => book.bookID === bookID);
          this.allBooks.splice(index, 1);
        },
        (err: any) => console.warn(err)
      );
  }

  deleteReader(readerID: number): void {
    this.dataService.deleteReader(readerID)
      .subscribe(
        () => {
          const index: number = this.allReaders.findIndex(reader => reader.readerID === readerID);
          this.allReaders.splice(index, 1);
        }
      );
  }

}

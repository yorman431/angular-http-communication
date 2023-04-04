import { Injectable } from '@angular/core';
import {HttpClient, HttpContext, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import { map, tap, catchError } from 'rxjs/operators';

import { allBooks } from 'app/data';
import { Reader } from 'app/models/reader';
import { Book } from 'app/models/book';
import { BookTrackerError } from 'app/models/bookTrackerError';
import { Observable, throwError } from 'rxjs';
import { OldBook } from '../models/oldBook';
import {CONTENT_TYPE} from './add-header.interceptor';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  mostPopularBook: Book = allBooks[0];

  setMostPopularBook(popularBook: Book): void {
    this.mostPopularBook = popularBook;
  }

  getAllReaders(): Observable<Reader[]> {
    return this.http.get<Reader[]>(`api/readers`);
  }

  getReaderById(id: number): Observable<Reader> {
    return this.http.get<Reader>(`api/readers/${id}`, {
      headers: new HttpHeaders({
        Accept: 'application/json'
      })
    });
  }

  addReader(newReader: Reader): Observable<Reader> {
    return this.http.post<Reader>('api/readers', newReader, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateReader(updatedReader: Reader): Observable<void> {
    return this.http.put<void>(`api/readers/${updatedReader.readerID}`, updatedReader, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteReader(readerID: number): Observable<void> {
    return this.http.delete<void>(`api/readers/${readerID}`);
  }

  getAllBooks(): Observable<Book[] | BookTrackerError> {
    return this.http.get<Book[]>('api/books', {
      context: new HttpContext().set(CONTENT_TYPE, 'application/xml')
    })
      .pipe(
        catchError(err => this.handleHttpError(err))
      );
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`api/books/${id}`, {
      headers: new HttpHeaders({
        Accept: 'application/json',
        Authorization: 'my-token'
      })
    });
  }

  getOldBookById(id: number): Observable<OldBook> {
    return this.http.get<Book>(`api/books/${id}`)
      .pipe(
        map(b => {
          return {
            bookTitle: b.title,
            year: b.publicationYear
          } as OldBook;
        }),
        tap(classicBook => console.log(classicBook))
      );
  }

  addBook(newBook: Book): Observable<Book> {
    return this.http.post<Book>('api/books', newBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  updateBook(updatedBook: Book): Observable<void> {
    return this.http.put<void>(`api/books/${updatedBook.bookID}`, updatedBook, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    });
  }

  deleteBook(bookID: number): Observable<void> {
    return this.http.delete<void>(`api/books/${bookID}`);
  }

  private handleHttpError(err: HttpErrorResponse): Observable<BookTrackerError> {
    const dataError = new BookTrackerError();
    dataError.errorNumber = err.status;
    dataError.message = err.message;
    dataError.friendlyMessage = 'An error occurred retrieving data';
    return throwError(dataError);
  }
}

import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, catchError, tap } from "rxjs/operators";
import { Post } from "./post.model";
import { Subject, throwError } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class PostService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  CreatePost(titlePost: string, contentPost: string) {
    const postData: Post = { title: titlePost, content: contentPost };
    this.http
      .post<{ name: string }>(
        "https://ng-complete-guide-ca764-default-rtdb.firebaseio.com/posts.json",
        postData,
        {
          observe: "response",
        }
      )
      .subscribe(
        (responseData) => {
          console.log(responseData);
        },
        (error) => {
          this.error.next(error.message);
        }
      );
  }

  FetchPost() {
    return this.http
      .get<{ [key: string]: Post }>(
        "https://ng-complete-guide-ca764-default-rtdb.firebaseio.com/posts.json",
        {
          headers: new HttpHeaders({ "Custom-Header": "Hello" }),
          params: new HttpParams().set("print", "pretty"),
        }
      )
      .pipe(
        // map((responseData: { [key: string]: Post }) => {
        map((responseData) => {
          const postsArray: Post[] = [];
          // tslint:disable-next-line:forin
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              postsArray.push({ ...responseData[key], id: key });
            }
          }
          return postsArray;
        }),
        catchError((errorRes) => {
          return throwError(errorRes);
        })
      );
  }

  DeletePosts() {
    return this.http
      .delete(
        "https://ng-complete-guide-ca764-default-rtdb.firebaseio.com/posts.json",
        {
          observe: "events",
        }
      )
      .pipe(
        tap((event) => {
          console.log(event);
        })
      );
  }
}

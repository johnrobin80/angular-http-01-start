import { Component, OnDestroy, OnInit } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, catchError } from "rxjs/operators";
import { Post } from "./post.model";
import { PostService } from "./post.service";
import { ThrowStmt } from "@angular/compiler";
import { Subscription } from "rxjs";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit, OnDestroy {
  loadedPosts: Post[] = [];
  isFetching = true;
  error = null;

  private subscription: Subscription;
  constructor(private http: HttpClient, private postService: PostService) {}

  ngOnInit() {
    this.subscription = this.postService.error.subscribe((errorMessage) => {
      this.error = errorMessage;
    });

    this.postService.FetchPost().subscribe((posts) => {
      if (posts.length > 0) {
        this.isFetching = false;
      }
      this.loadedPosts = posts;
    });
  }

  // onCreatePost(postData: { title: string; content: string }) {
  onCreatePost(postData: Post) {
    // Send Http request
    // console.log(postData);
    this.postService.CreatePost(postData.title, postData.content);
  }

  onFetchPosts() {
    // Send Http request
    this.isFetching = true;

    this.postService.FetchPost().subscribe(
      (posts) => {
        if (posts.length > 0) {
          this.isFetching = false;
        }
        this.loadedPosts = posts;
      },
      (error) => {
        this.isFetching = false;
        this.error = error.message;
      }
    );
  }

  onClearPosts() {
    // Send Http request
    this.postService.DeletePosts().subscribe(() => {
      this.loadedPosts = [];
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onHandleError() {
    this.error = null;
  }
}

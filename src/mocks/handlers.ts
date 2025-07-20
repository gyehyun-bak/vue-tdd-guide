import type { Post } from "@/types/Post";
import type { Posts } from "@/types/Posts";
import { http, HttpResponse } from "msw";

export const handlers = [
  http.get("https://api.example.com/user", () => {
    return HttpResponse.json({
      id: "abc-123",
      firstName: "John",
      lastName: "Maverick",
    });
  }),
  http.get<never, never, Posts>("https://api.example.com/posts", () =>
    HttpResponse.json({
      posts: [
        {
          id: 0,
          author: "author0",
          title: "title0",
          content: "content0",
        },
        {
          id: 1,
          author: "author1",
          title: "title1",
          content: "content1",
        },
      ],
    })
  ),
  http.post<never, Omit<Post, "id">>("https://api.example.com/posts", async () => {
    return HttpResponse.json({});
  }),
];

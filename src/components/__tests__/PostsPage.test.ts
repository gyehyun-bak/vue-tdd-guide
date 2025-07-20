import { describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/vue";
import "@testing-library/jest-dom";
import { server } from "../../mocks/node";
import { userEvent } from "@testing-library/user-event";
import PostsPage from "../PostsPage.vue";
import type { Posts } from "../../types/Posts";
import { http, HttpResponse } from "msw";
import { mockPush } from "../../../__mocks__/vue-router";

import { vi } from "vitest";

vi.mock("vue-router");

describe("PostsPage", () => {
  it("마운트 시 기존 게시물을 표시합니다", async () => {
    // given
    // Mock 데이터
    const response: Posts = {
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
    };

    // 서버 응답 Mocking
    server.use(http.get("https://api.example.com/posts", () => HttpResponse.json(response)));

    // when
    render(PostsPage);

    // then
    await waitFor(() => {
      response.posts.forEach((post) => {
        expect(screen.getByText(post.author)).toBeInTheDocument();
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
      });
    });
  });

  it('"Create Post" 버튼을 클릭하면 /posts/create로 이동합니다', async () => {
    // given
    render(PostsPage);

    const createPostButton = screen.getByTestId("create-post-button");
    const user = userEvent.setup();

    // when
    await user.click(createPostButton);

    // then
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith("/posts/create");
    });
  });
});

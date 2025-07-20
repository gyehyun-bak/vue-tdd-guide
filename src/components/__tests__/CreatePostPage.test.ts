import { vi } from "vitest";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/vue";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "../../mocks/node";
import { mockPush } from "../../../__mocks__/vue-router";
import type { Post } from "@/types/Post";
import CreatePostPage from "@/components/CreatePostPage.vue";

vi.mock("vue-router");

describe("CreatePostPage", () => {
  const user = userEvent.setup();

  it("작성자, 제목, 내용을 작성하고 Save 버튼을 누르면 post 요청 후 /posts로 이동", async () => {
    // given
    const author = "Test Author";
    const title = "Test Title";
    const content = "Test Content";

    let requestBody: Omit<Post, "id"> = {
      author: "",
      title: "",
      content: "",
    };

    server.use(
      http.post<never, Omit<Post, "id">>("https://api.example.com/posts", async ({ request }) => {
        requestBody = await request.clone().json();
        return HttpResponse.json({});
      })
    );

    render(CreatePostPage);

    // when
    await user.type(screen.getByTestId("author-input"), author);
    await user.type(screen.getByTestId("title-input"), title);
    await user.type(screen.getByTestId("content-input"), content);
    await user.click(screen.getByTestId("save-button"));

    // then
    expect(requestBody.author).toEqual(author);
    expect(requestBody.title).toEqual(title);
    expect(requestBody.content).toEqual(content);
    expect(mockPush).toHaveBeenCalledWith("/posts");
  });

  it("Cancel 버튼 클릭 시 /posts로 이동", async () => {
    // given
    render(CreatePostPage);

    // when
    await user.click(screen.getByTestId("cancel-button"));

    // then
    expect(mockPush).toHaveBeenCalledWith("/posts");
  });

  it("입력값 중 하나라도 비어 있으면 이동하지 않음", async () => {
    // given
    render(CreatePostPage);

    // when
    await user.type(screen.getByTestId("author-input"), "Only Author");
    await user.click(screen.getByTestId("save-button"));

    // then
    expect(mockPush).not.toHaveBeenCalled();
  });
});

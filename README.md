## 목차

- [Overview](#Overview)
- [TDD](#TDD)
- [Getting Started](#Getting-Started)
- [MSW 설정](#MSW-설정)
- [TDD in Vue](#TDD-in-Vue)
- [실전 예제: PostsPage.vue](#실전-예제-PostsPagevue)
- [Other Scenarios](#Other-Scenarios)
  - [Mocking Functions](#Mocking-Functions)
  - [UserEvent](#UserEvent)
- [References](#References)

## Overview

해당 문서는 *KB IT’s Your Life*의 19반 2팀(계모임)에서 활용하기 위한 개발 가이드로 작성되었습니다. Vue를 활용한 프론트엔드 개발에서 TDD(Test Driven Development)를 적용할 수 있도록 TDD에 대한 간략한 소개와 Vue에서의 적용 방법을 기술합니다.

본 문서에는 다음과 같은 기술을 사용합니다:

-   [**Vue.js**](https://vuejs.org/)
-   [**vitest**](https://vitest.dev/)
-   [**axios**](https://axios-http.com/kr/docs/intro)
-   [**@testing-library/vue**](https://testing-library.com/docs/vue-testing-library/intro): 사용자 상호작용을 기반으로 컴포넌트의 행위를 테스트하도록 돕습니다.
-   [**@testing-library/jest-dom**](https://testing-library.com/docs/ecosystem-jest-dom/): DOM 요소에 대해 보다 직관적이고 읽기 쉬운 matcher(`toBeInTheDocument()`, `toHaveTextContent()` 등)를 제공합니다.
-   [**@testing-library/user-event**](https://testing-library.com/docs/user-event/intro/): 실제 사용자의 입력 및 행동(클릭, 입력 등)을 시뮬레이션하여 사용자 관점의 테스트를 작성할 수 있도록 돕습니다.
-   [**msw**](https://mswjs.io/docs) (Mock Service Worker): 서버 응답 등의 네트워크 계층에 대한 mocking을 제공합니다.

## TDD

TDD(Test Driven Development, 테스트 주도 개발)는 실제 코드를 작성하기 전 테스트를 먼저 작성하므로써, 자연스럽게 테스트할 수 있는(Testable) 컴포넌트를 개발할 수 있도록 유도하는 프로그래밍 패러다임입니다.

### Red-Green-Refactor

TDD는 다음과 같은 라이프사이클을 통해 개발을 하도록 권장합니다:

-   Red: 실패하는 테스트를 작성합니다.
-   Green: 테스트 통과를 위해 최소한의 구현을 합니다.
-   Refactor: 작성한 코드를 리펙토링합니다.

테스트는 그것이 의미하는 기능이 작고 독립적일 것이 권장됩니다.

### What to Test?

Component(컴포넌트)는 Vue 애플리케이션의 핵심 구성 요소입니다. 따라서 격리된 테스트의 주요 대상도 주로 컴포넌트가 됩니다. 컴포넌트는 사용자 행위에 대해 반응하고, 필요한 정보를 표시하며, 서버에 요청을 전달해 응답에 따라 진행할 로직을 결정합니다.

컴포넌트 테스트는 자세한 내부 구현보다는 public interface, 즉, 유저와의 상호작용으로 인한 결과를 테스트하는 것이 권장됩니다. 특정 유틸 함수나 컴포저블(훅)의 동작을 테스트 할 때는 별도의 테스트를 작성하는 것이 좋습니다.

다르게 말하면 이렇게 표현할 수 있습니다: **Test what a component does, not how it does.**

컴포넌트 테스트에서는 주로 다음과 같은 요소를 다룹니다:

-   올바른 요소가 보여지는가? (ex: 버튼, 컴포넌트, 서버에서 받아온 데이터)
-   올바른 행위를 하는가? (ex: 컴포저블의 호출, 다른 페이지로의 네비게이션)

## Getting Started

테스트 작성에 앞서 프로젝트를 세팅합니다.

### Creating a Vue Application

Vue 프로젝트를 생성합니다. 보다 자세한 Vue 프로젝트 생성 방법은 [여기](https://vuejs.org/guide/quick-start.html)를 참고하세요.

```bash
npm create vue@latest
```

TypeScript, Routing, Vitest를 포함한 Vue 프로젝트를 생성합니다.

```bash
✔ Project name: … <your-project-name>
✔ Add TypeScript? … Yes
✔ Add JSX Support? … No
✔ Add Vue Router for Single Page Application development? … Yes
✔ Add Pinia for state management? … No
✔ Add Vitest for Unit testing? … Yes
✔ Add an End-to-End Testing Solution? … No
✔ Add ESLint for code quality? … Yes
✔ Add Prettier for code formatting? … No
✔ Add Vue DevTools 7 extension for debugging? (experimental) … No

Scaffolding project in ./<your-project-name>...
Done.
```

### Command Line Interface

`package.json`에 아래와 같이 추가하면 터미널 명령어로 테스트를 실행할 수 있습니다.

```json
{
    "scripts": {
        "test": "vitest",
        "coverage": "vitest run --coverage"
    }
}
```

### Install Dependencies

프로젝트에 필요한 추가 라이브러리를 설치합니다.

```bash
npm install axios
npm install --save-dev @testing-library/vue @testing-library/user-event @testing-library/jest-dom msw
```

### Create Your First Test

Vitest를 포함하여 프로젝트를 만들었다면 `src/components/__tests__` 디렉토리가 자동으로 생성되어 있을 것입니다. 해당 디렉토리에 `PostsPage.test.ts` 파일을 생성합니다.

```tsx
import { describe, expect, it } from "vitest";

describe("PostsPage", () => {
    it("should", () => {
        expect(true).toBeTruthy();
    });
});
```

`Vitest`는 테스트에 대해서 BDD(Behaviour Driven Development, 행위 주도 개발)을 위한 테스트 문법을 지원합니다. 현재 작성한 문법은 각각 다음을 의미합니다.

-   `describe`: 테스트 대상을 설명합니다. 관련된 테스트들을 그룹화합니다.
-   `it`: 각 테스트 케이스를 정의합니다. BDD에서 테스트를 “it should do …” 식으로 행위를 완전히 설명하도록 작성하기 때문에 `it("", () => {})`으로 표현되어 있으며, `test("", () => {})`로 작성해도 완전히 동일하게 동작합니다.
    -   `"should"` 자리에 테스트에 대해 설명합니다. 자연어 형태로 작성하는 것이 권장됩니다.
    -   `() => {}` 에 실제 테스트 코드를 작성합니다.
-   `expect`: 매개변수로 전달되는 요소에 대해 단언(Assert)합니다. 체인메서드로 다양한 메서드가 제공됩니다. 이를 통해 전달된 요소에 대한 테스트 통과 조건을 설정합니다.

Vitest 플러그인이 있다면 플러그인을 통해, 아니라면 터미널에 `npm run test`를 입력하여 테스트 동작을 확인합니다. (`package.json` 설정이 되어있어야 합니다)

```bash
> vue-tdd-guide@0.0.0 test
> vitest

 DEV  v3.2.4 C:/home/dev/projects/vue-tdd-guide

 ✓ src/components/__tests__/PostsPage.test.ts (1 test) 2ms
 ✓ src/components/__tests__/HelloWorld.spec.ts (1 test) 14ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  19:33:35
   Duration  994ms (transform 102ms, setup 0ms, collect 215ms, tests 16ms, environment 1.06s, prepare 179ms)

 PASS  Waiting for file changes...
       press h to show help, press q to quit
```

## MSW 설정

MSW(Mock Service Worker)를 사용하기 위한 설정을 진행합니다. MSW는 테스트에서 미리 설정한 HTTP 응답에 대해 정해진 Mock 데이터를 반환하도록 네트워크 레이어를 Mocking 합니다.

### Handlers.ts

`src/mocks/handlers.ts` 파일을 생성하고 아래와 같이 작성합니다.

```tsx
// src/mocks/handlers.ts
import { http, HttpResponse } from "msw";

export const handlers = [
    http.get("https://api.example.com/user", () => {
        return HttpResponse.json({
            id: "abc-123",
            firstName: "John",
            lastName: "Maverick",
        });
    }),
];
```

이곳에 앞으로 서버로부터 받을 응답을 정의해서 테스트에서 활용할 수 있습니다.

### node.ts

`src/mocks/node.ts` 파일을 생성하고 아래와 같이 작성합니다.

```tsx
// src/mocks/node.ts
import { setupServer } from "msw/node";
import { handlers } from "./handlers.js";

export const server = setupServer(...handlers);
```

### vitest.setup.ts

Vitest를 위한 Set Up 파일을 생성하고 `vitest.config.ts`에 추가합니다. 루트 디렉토리에 `vitest.setup.ts` 파일을 생성하고 아래와 같이 작성합니다.

```tsx
// vitest.setup.ts
import { beforeAll, afterEach, afterAll } from "vitest";
import { server } from "./src/mocks/node.js";

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

`vitest.config.ts` 에 다음을 추가합니다.

```tsx
export default mergeConfig(
    // ...
    defineConfig({
        test: {
            // ...
            globals: true, // Vitest API를 글로벌 스코프에서 사용 가능 (describe, it 등)
            setupFiles: ["./vitest.setup.ts"], // MSW 초기 설정을 위한 파일
        },
    })
);
```

### example.test.ts

아래와 같이 `example.test.ts`를 작성하고 테스트를 실행했을 때 통과한다면, 정상적으로 적용된 것입니다.

```tsx
// src/components/__test__/example.test.ts
// @vitest-environment node
import { test, expect } from "vitest";

test("responds with the user", async () => {
    const response = await fetch("https://api.example.com/user");

    await expect(response.json()).resolves.toEqual({
        id: "abc-123",
        firstName: "John",
        lastName: "Maverick",
    });
});
```

## TDD in Vue

앞서 설명한 내용들을 바탕으로 해당 프로젝트에서는 간단한 게시판 서비스를 TDD 방식으로 만들어보겠습니다.

### 요구사항 정의

아주 단순한 게시판 서비스를 만들어봅니다. 아래는 각 페이지와 행위를 기반으로 하는 요구사항입니다.

-   `PostsPage.vue`: 게시물을 조회하여 보여줍니다.
    -   Behaviour 1: 컴포넌트 마운트 시 기존 게시물을 표시합니다.
    -   Behaviour 2: `Create Post` 버튼을 클릭하면 `/posts/create`로 이동합니다.
-   `CreatePostPage.vue`: 새로운 게시물을 생성합니다.
    -   Behaviour 1: 작성자, 제목, 내용을 작성하고 `Save` 버튼을 클릭하면 서버로 요청을 보내고, 요청 성공 시 `/posts`로 이동합니다.
    -   Behaviour 2: `Cancel` 버튼을 클릭하면 `/posts`로 이동합니다.
    -   Behaviour 3: 작성자, 제목, 내용 중 하나라도 작성되지 않았다면 API를 호출하지 않고, 페이지 이동이 발생하지 않습니다.

### 타입 정의

서버로부터 받는 응답 객체를 정의합니다.

-   `Post.ts`

```tsx
// src/types/Post.ts
export interface Post {
    id: number;
    author: string;
    title: string;
    content: string;
}
```

-   `Posts.ts`

```tsx
// src/types/Posts.ts
import type { Post } from "./Post";

export interface Posts {
    posts: Post[];
}
```

### API 정의

서버에 호출할 API를 정의합니다.

```tsx
// src/api/post.api.ts
import type { Post } from "@/types/Post";
import type { Posts } from "@/types/Posts";
import axios from "axios";

export const getPosts = async (): Promise<Posts> => {
    return (await axios.get<Posts>("https://api.example.com/posts")).data;
};

export const createPost = async (data: Omit<Post, "id">) => {
    await axios.post("https://api.example.com/posts", data);
};
```

### Given-When-Then

각 테스트 케이스를 표현하는 데에 given-when-then 구조를 이용하겠습니다. given-when-then 구조는 각각 다음처럼 표현할 수 있습니다:

-   given: 어떤 상황이 주어졌을 때
-   when: 이런 행동이 발생하면
-   then: 이런 결과가 나와야 한다

## 실전 예제: PostsPage.vue

### Red

우선 실패하는 테스트를 작성합니다.

```tsx
// src/components/__tests__/PostsPage.test.vue
import { describe, expect, it } from "vitest";

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
        server.use(
            http.get("https://api.example.com/posts", () =>
                HttpResponse.json(response)
            )
        );

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
});
```

각각을 given-when-then의 부분으로 나누어 설명하겠습니다.

-   given

```tsx
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
server.use(
    http.get("https://api.example.com/posts", () => HttpResponse.json(response))
);
```

given은 테스트를 위한 전제 조건입니다. 서버로부터 특정 API에 요청을 보냈을 때 MSW가 반환할 Mock 데이터를 정의하고 MSW를 통해 설정합니다. 자주 사용되는 응답의 경우 `src/mocks/handlers.ts`에 직접 추가할 수도 있습니다.

-   when

```tsx
// when
render(PostsPage);
```

현재 테스트 케이스는 컴포넌트가 “마운트 시 기존 게시물을 표시”하는 것을 확인합니다. 따라서 테스트를 위한 동작은 컴포넌트의 렌더링입니다. `render()` 함수는 `testing-library/vue`의 함수로 브라우저를 통해 애플리케이션 전체를 직접 그리는 것이 아닌, 테스트를 동작하는 엔진 내부에 가상 DOM을 렌더링하고, 그 내부 요소에 접근할 수 있도록 합니다.

-   then

```tsx
// then
await waitFor(() => {
    response.posts.forEach((post) => {
        expect(screen.getByText(post.author)).toBeInTheDocument();
        expect(screen.getByText(post.title)).toBeInTheDocument();
        expect(screen.getByText(post.content)).toBeInTheDocument();
    });
});
```

-   `waitFor()`는 `@testing-library/vue`가 제공하는 비동기 테스트 함수입니다. 마운트와 동시에 확인할 수 없고, 비동기 처리가 완료된 후에 확인할 수 있는 테스트 단언(Assertion)을 담습니다.
-   여기서는 응답(`response`)으로 받은 데이터가 모두 화면에 표시되는지 확인합니다.
-   `expect()`는 앞서 설명한 데로 매개변수로 전달된 객체에 대한 단언을 진행합니다.
-   `screen`은 `@testing-library/vue`가 제공하는, 내부 렌더링된 DOM에 접근할 수 있도록 하는 객체입니다. `getByText()`는 매개변수로 주어진 string을 child로 가진 DOM 객체를 찾습니다.
-   `toBeInTheDocument()` 는 `@testing-library/jest-dom`에서 제공하는 단언 함수로, 특정 요소가 화면에 있음을 단언합니다. 없음을 단언하고자 하는 경우 `expect(...).not.toBeInTheDocument()` 와 같은 식으로 사용할 수 있습니다.

아직 구현된 컴포넌트가 없기 때문에 테스트는 컴파일되지 않습니다. `PostsPage.vue` 컴포넌트를 생성하고 나면, 테스트가 실행되지만 실패합니다. 아무래도 아직 아무 코드도 작성하지 않았기 때문입니다.

### Green

다음으로 테스트를 우선 통과하는 컴포넌트를 최소한으로 구현합니다.

```vue
// src/components/PostsPage.vue
<script setup lang="ts">
import { getPosts } from "@/api/post.api";
import type { Post } from "@/types/Post";
import { onMounted, ref } from "vue";

const posts = ref<Post[]>([]);

onMounted(async () => {
    const data = await getPosts();
    posts.value = data.posts;
});
</script>

<template>
    <div>
        <div v-for="post in posts" :key="post.id">
            <p>{{ post.author }}</p>
            <p>{{ post.title }}</p>
            <p>{{ post.content }}</p>
        </div>
    </div>
</template>
```

컴포넌트는 `onMounted()`를 통해 마운트 시에 `getPosts()`를 호출하고, 내용을 화면에 단순히 표시합니다. 다시 테스트를 실행하면 테스트가 통과하는 것을 확인할 수 있습니다.

<img width="1096" height="312" alt="image" src="https://github.com/user-attachments/assets/8eeb8883-f6f5-45ad-8e7f-f58d42267c5f" />

### Refactor

테스트가 Green 상태를 유지하는 선에서 코드 구조를 개선합니다. 구체적인 스타일보다는 팀의 코드 컨벤션을 잘 지키고 있는지, 혹은 유지보수 등의 측면에서 개선하는 것이 좋습니다.

각 게시글을 표시하는 부분은 별도의 컴포넌트로 분리할 수 있을 것 같습니다:

```vue
// src/components/PostItem.vue
<script setup lang="ts">
import type { Post } from "@/types/Post";

defineProps<{ post: Post }>();
</script>

<template>
    <article>
        <h2>{{ post.title }}</h2>
        <p>{{ post.author }}</p>
        <p>{{ post.content }}</p>
    </article>
</template>
```

`PostsPage.vue`는 다음과 같이 수정합니다.

```vue
// src/components/PostsPage.vue
<script setup lang="ts">
import { getPosts } from "@/api/post.api";
import type { Post } from "@/types/Post";
import { onMounted, ref } from "vue";
import PostItem from "./PostItem.vue";

const posts = ref<Post[]>([]);

onMounted(async () => {
    const data = await getPosts();
    posts.value = data.posts;
});
</script>

<template>
    <div>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
    </div>
</template>
```

동일한 테스트를 다시 실행합니다. 여전히 통과하는 것을 볼 수 있습니다. 같은 방식으로 다른 테스트도 작성하고 구현을 이어갑니다. 필요한 기능을 모두 구현할 때까지 Red-Green-Refactor 과정을 반복합니다.

## Other Scenarios

```tsx
// src/components/__tests__/PostsPage.test.ts

...

it('"Create Post" 버튼을 클릭하면 /posts/create로 이동합니다', async () => {
  // given

  // when

  // then
});
```

위와 같은 테스트 케이스를 표현하기 위해서는 다음과 같은 기능이 추가적으로 필요합니다.

-   특정 함수에 대한 Mocking (라우팅 함수가 호출되었는가 단언)
-   사용자의 상호작용(userEvent)

둘 다 테스트 케이스를 작성할 때 자주 활용되는 기능이기 때문에 하나씩 설명합니다.

### Mocking Functions

Vitest의 `vi.mock()` 함수는 특정 모듈을 가짜로(mock) 대체하여 테스트 상황을 제어할 수 있도록 돕습니다. 예를 들어, Vue Router의 `useRouter()`를 사용하는 컴포넌트에서 라우팅 동작을 확인하려면 해당 훅을 모킹해야 합니다.

```tsx
// src/components/__tests__/PostsPage.test.ts

// router.push를 모킹하기 위한 함수 선언
const mockPush = vi.fn();

// vue-router 모듈의 useRouter를 직접 모킹
vi.mock("vue-router", async () => {
  const actual = await vi.importActual<typeof import("vue-router")>("vue-router");
  return {
    ...actual,
    useRouter: () => ({
      push: mockPush,
    }),
  };
});

describe("PostsPage", () => { ... });
```

이제 `mockPush` 객체를 통해 `vue-router`의 `push()`가 호출되었는지를 검증할 수 있습니다.

```tsx
// src/components/__tests__/PostsPage.test.ts

// then
expect(mockPush).toHaveBeenCalledWith("/posts/create");
```

`vue-router` 의 `push()` 등에 대한 검증은 테스트에서 자주 사용되기 때문에, 별도의 파일로 모듈화할 수 있습니다. `vitest`는 기본적으로 `__mocks__` 폴더에 있는 파일을 테스트 실행 시 자동으로 불러옵니다.

```tsx
// __mocks__/vue-router.ts
import { vi, afterEach } from "vitest";
export * from "vue-router";

export const mockPush = vi.fn();

export const useRouter = () => ({
    push: mockPush,
});

afterEach(() => {
    mockPush.mockReset();
});
```

기존 테스트에서는 단순히 `vue-router`에 대한 모킹을 호출하고, `mockPush()`를 import 하여 사용합니다.

```tsx
// src/components/__tests__/PostsPage.test.ts
import { mockPush } from "../../../__mocks__/vue-router";

vi.mock("vue-router");

// 생략...

// then
expect(mockPush).toHaveBeenCalledWith("/posts/create");
```

### UserEvent

`@testing-library/user-event`는 사용자의 행동을 시뮬레이션하는 기능을 제공합니다. 버튼 클릭, 키보드 입력, 포커스 이동 등을 테스트할 수 있습니다.

다음과 같은 방식으로 사용됩니다:

```tsx
const user = userEvent.setup();

await user.type(input, "name");
await user.click(saveButton);
```

`user` 객체를 setup 해주고 나면 연속적인 사용자와 컴포넌트의 인터렉션을 테스트할 수 있습니다. 테스트 내 `await`가 붙은 user 관련 함수들은 모두 차례대로 실행됩니다.

### Example

설명한 두 기능을 바탕으로 최종 테스트를 작성해봅니다:

```tsx
// src/components/__tests__/PostsPage.test.ts
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
	const user = userEvent.setup(); // <-- 추가

  it("마운트 시 기존 게시물을 표시합니다", async () => {...});

  it('"Create Post" 버튼을 클릭하면 /posts/create로 이동합니다', async () => {
    // given
    render(PostsPage);
    const createPostButton = screen.getByTestId("create-post-button");

    // when
    await user.click(createPostButton);

    // then
    expect(mockPush).toHaveBeenCalledWith("/posts/create");
  });
});
```

테스트를 각각 given-when-then으로 설명할 수 있습니다:

-   given: `PostsPage.vue`를 렌더링하고 `screen.getByTestId()`로 버튼을 찾아옵니다. `getByTestId()`는 html 태그의 `data-testid` 속성을 통해 DOM 요소를 찾을 수 있게 해줍니다. DOM 요소의 내부 값이 변해도 `data-testid`는 변하지 않으므로 유지보수에 유리합니다.
-   when: `userEvent`의 `user` 객체로 찾아온 버튼을 클릭하는 이벤트를 실행합니다.
-   then: 버튼을 클릭하면 `vue-router`의 `push()`가 `/posts/create`를 매개변수로 실행되었는지 검증합니다.

테스트를 작성했으니 이제 실제 구현을 진행합니다.

```vue
// src/components/PostsPage.vue
<script setup lang="ts">
import { getPosts } from "@/api/post.api";
import type { Post } from "@/types/Post";
import { onMounted, ref } from "vue";
import PostItem from "./PostItem.vue";
import { useRouter } from "vue-router";

const posts = ref<Post[]>([]);
const router = useRouter();

onMounted(async () => {
    const data = await getPosts();
    posts.value = data.posts;
});

const onClick = () => {
    router.push("/posts/create");
};
</script>

<template>
    <div>
        <PostItem v-for="post in posts" :key="post.id" :post="post" />
        <button data-testid="create-post-button" @click="onClick">
            새 게시물
        </button>
    </div>
</template>
```

테스트 실행 시 통과되는 것을 확인할 수 있습니다. 여기에서는 Refactor 과정을 생략합니다.

나머지 테스트와 구현은 소스 코드를 통해 확인하실 수 있습니다.

## References

-   서적 <테스트 주도 개발> - 켄트 벡
-   https://velog.io/@gyehyunbak/Spring-With-TDD
-   https://vuejs.org/guide/scaling-up/testing.html
-   https://vitest.dev/guide/
-   https://testing-library.com/docs/
-   https://mswjs.io/

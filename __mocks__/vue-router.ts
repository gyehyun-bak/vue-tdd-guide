import { vi, afterEach } from "vitest";
export * from "vue-router";

export const mockPush = vi.fn();

export const useRouter = () => ({
  push: mockPush,
});

afterEach(() => {
  mockPush.mockReset();
});

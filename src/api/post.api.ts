import type Post from "@/types/Post";
import type Posts from "@/types/Posts";
import axios from "axios";

export const getPosts = async (): Promise<Posts> => {
  return (await axios.get<Posts>("https://api.example.com/posts")).data;
};

export const createPost = async (data: Omit<Post, "id">) => {
  await axios.post("https://api.example.com/posts", data);
};

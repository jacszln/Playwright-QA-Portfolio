import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { NewPost } from '../schemas/post.schema';

/**
 * Thin wrapper around Playwright's APIRequestContext for the JSONPlaceholder
 * endpoints under test. Returns raw APIResponse objects so tests stay in
 * control of status/header/body assertions; the client only owns routing.
 */
export class JsonPlaceholderClient {
  constructor(private readonly request: APIRequestContext) {}

  getPosts(params?: { userId?: number }): Promise<APIResponse> {
    return this.request.get('/posts', { params });
  }

  getPostById(id: number): Promise<APIResponse> {
    return this.request.get(`/posts/${id}`);
  }

  createPost(payload: NewPost): Promise<APIResponse> {
    return this.request.post('/posts', { data: payload });
  }

  getUsers(): Promise<APIResponse> {
    return this.request.get('/users');
  }

  getUserById(id: number): Promise<APIResponse> {
    return this.request.get(`/users/${id}`);
  }

  getCommentsByPostId(postId: number): Promise<APIResponse> {
    return this.request.get('/comments', { params: { postId } });
  }
}

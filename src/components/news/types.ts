import type { FeedAuthor } from "@/components/campfire/types";

// Per-news engagement, aggregated server-side and kept live on the client.
export type NewsEngagement = {
  like_count: number;
  liked_by_me: boolean;
  comment_count: number;
};

export type NewsComment = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: FeedAuthor | null;
  like_count: number;
  liked_by_me: boolean;
};

export type EngagementMap = Record<string, NewsEngagement>;

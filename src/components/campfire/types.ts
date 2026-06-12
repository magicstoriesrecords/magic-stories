export type FeedAuthor = {
  username: string;
  display_name: string | null;
  avatar_url: string | null;
  role: "member" | "artist";
  author_slug: string | null;
};

export type FeedPost = {
  id: string;
  author_id: string;
  body: string;
  link_url: string | null;
  link_type: "youtube" | "soundcloud" | "x" | "link" | null;
  created_at: string;
  author: FeedAuthor | null;
  like_count: number;
  liked_by_me: boolean;
  reply_count: number;
};

export type Reply = {
  id: string;
  author_id: string;
  body: string;
  created_at: string;
  author: FeedAuthor | null;
  like_count: number;
  liked_by_me: boolean;
};

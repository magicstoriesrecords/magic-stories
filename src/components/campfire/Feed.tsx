"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Composer from "@/components/campfire/Composer";
import PostCard from "@/components/campfire/PostCard";
import { createClient } from "@/lib/supabase/client";
import type { FeedAuthor, FeedPost } from "@/components/campfire/types";

const POST_SELECT =
  "id, author_id, body, link_url, link_type, created_at, author:profiles!posts_author_id_fkey(username, display_name, avatar_url, role, author_slug)";

export default function Feed({
  initialPosts,
  authorId,
  author,
}: {
  initialPosts: FeedPost[];
  authorId: string | null;
  author: FeedAuthor | null;
}) {
  const [posts, setPosts] = useState<FeedPost[]>(initialPosts);

  function handlePosted(post: FeedPost) {
    setPosts((prev) => [post, ...prev]);
  }

  function handleReplyAdded(postId: string) {
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, reply_count: p.reply_count + 1 } : p)),
    );
  }

  function handleUpdated(updated: FeedPost) {
    setPosts((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
  }

  function handleDeleted(postId: string) {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  }

  async function handleToggleLike(post: FeedPost) {
    if (!authorId) return;
    const next = !post.liked_by_me;
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? { ...p, liked_by_me: next, like_count: p.like_count + (next ? 1 : -1) }
          : p,
      ),
    );
    const supabase = createClient();
    const { error } = next
      ? await supabase.from("likes").insert({ post_id: post.id, user_id: authorId })
      : await supabase.from("likes").delete().eq("post_id", post.id).eq("user_id", authorId);
    if (error) {
      setPosts((prev) =>
        prev.map((p) =>
          p.id === post.id
            ? { ...p, liked_by_me: !next, like_count: p.like_count + (next ? -1 : 1) }
            : p,
        ),
      );
    }
  }

  // Realtime: reflect other people's posts, edits, deletes, likes and replies.
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel("library-feed")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "posts" },
        async (payload) => {
          const row = payload.new as { id: string; author_id: string };
          if (row.author_id === authorId) return;
          const { data } = await supabase.from("posts").select(POST_SELECT).eq("id", row.id).single();
          if (!data) return;
          const newPost = {
            ...(data as object),
            like_count: 0,
            liked_by_me: false,
            reply_count: 0,
          } as FeedPost;
          setPosts((prev) => (prev.some((p) => p.id === newPost.id) ? prev : [newPost, ...prev]));
        },
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.new as {
            id: string;
            author_id: string;
            body: string;
            link_url: string | null;
            link_type: FeedPost["link_type"];
          };
          if (row.author_id === authorId) return;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.id
                ? { ...p, body: row.body, link_url: row.link_url, link_type: row.link_type }
                : p,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "posts" },
        (payload) => {
          const row = payload.old as { id: string };
          setPosts((prev) => prev.filter((p) => p.id !== row.id));
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "likes" },
        (payload) => {
          const row = payload.new as { post_id: string; user_id: string };
          if (row.user_id === authorId) return;
          setPosts((prev) =>
            prev.map((p) => (p.id === row.post_id ? { ...p, like_count: p.like_count + 1 } : p)),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "likes" },
        (payload) => {
          const row = payload.old as { post_id: string; user_id: string };
          if (row.user_id === authorId) return;
          setPosts((prev) =>
            prev.map((p) =>
              p.id === row.post_id ? { ...p, like_count: Math.max(0, p.like_count - 1) } : p,
            ),
          );
        },
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "replies" },
        (payload) => {
          const row = payload.new as { post_id: string; author_id: string };
          if (row.author_id === authorId) return;
          setPosts((prev) =>
            prev.map((p) => (p.id === row.post_id ? { ...p, reply_count: p.reply_count + 1 } : p)),
          );
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authorId]);

  return (
    <div className="mx-auto max-w-2xl space-y-5">
      {authorId && author ? (
        <Composer authorId={authorId} author={author} onPosted={handlePosted} />
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center">
          <p className="font-sans text-cream/80">Zaloguj się, aby dopisać swój rozdział.</p>
          <Link
            href="/account"
            className="liquid-glass mt-4 inline-block rounded-full px-7 py-2.5 text-sm"
          >
            Zaloguj się przez Google
          </Link>
        </div>
      )}

      {posts.length === 0 ? (
        <p className="py-12 text-center font-sans text-cream/50">
          Biblioteka jest jeszcze pusta. Dopisz pierwszy rozdział.
        </p>
      ) : (
        posts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            meId={authorId}
            meAuthor={author}
            onToggleLike={handleToggleLike}
            onReplyAdded={handleReplyAdded}
            onUpdated={handleUpdated}
            onDeleted={handleDeleted}
          />
        ))
      )}
    </div>
  );
}

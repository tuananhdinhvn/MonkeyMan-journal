import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export const metadata = {
  title: "Blog",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();

  return (
    <div className="py-10">
      <h1 className="text-2xl font-bold">Blog</h1>
      <ul className="mt-8 space-y-6">
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="text-lg font-medium underline-offset-4 hover:underline"
            >
              {post.title}
            </Link>
            <p className="text-sm text-neutral-500">{post.date}</p>
            <p className="mt-1 text-neutral-600 dark:text-neutral-400">
              {post.summary}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

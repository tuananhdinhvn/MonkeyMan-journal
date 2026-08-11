import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);
  return { title: post.title, description: post.summary };
}

export default function BlogPostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = getPostBySlug(params.slug);

  return (
    <article className="prose prose-neutral dark:prose-invert py-10">
      <h1>{post.title}</h1>
      <p className="text-sm text-neutral-500">{post.date}</p>
      <MDXRemote source={post.content} />
    </article>
  );
}

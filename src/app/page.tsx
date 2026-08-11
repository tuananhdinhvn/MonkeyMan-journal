export default function HomePage() {
  return (
    <div className="space-y-16 py-10">
      <section>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Xin chào, mình là Monkey Man 👋
        </h1>
        <p className="mt-4 max-w-xl text-neutral-600 dark:text-neutral-400">
          Mình xây dựng sản phẩm và viết về những gì mình học được. Đây là nơi
          giới thiệu bản thân, các dự án, và bài viết cá nhân.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Dự án</h2>
        <ul className="mt-4 space-y-3">
          <li className="rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
            <p className="font-medium">Tên dự án</p>
            <p className="text-sm text-neutral-500">Mô tả ngắn gọn về dự án.</p>
          </li>
        </ul>
      </section>

      <section id="contact">
        <h2 className="text-xl font-semibold">Liên hệ</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-400">
          Email:{" "}
          <a className="underline" href="mailto:tuananhdinh.vn@gmail.com">
            tuananhdinh.vn@gmail.com
          </a>
        </p>
      </section>
    </div>
  );
}

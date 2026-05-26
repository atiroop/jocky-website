export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center px-6">
      <section className="max-w-3xl text-center">
        <p className="mb-4 text-sm uppercase tracking-[0.3em] text-neutral-400">
          Jocky Website
        </p>

        <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
          Personal Blog, Articles & Diary
        </h1>

        <p className="mt-6 text-lg leading-8 text-neutral-300">
          พื้นที่สำหรับบันทึกความคิด บทความ เรื่องเล่า และไอเดียส่วนตัวของเต้อ
          สร้างด้วย Next.js
        </p>
      </section>
    </main>
  );
}
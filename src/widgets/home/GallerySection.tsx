"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";

interface GalleryPost {
  id: number;
  title?: string;
  subtitle?: string;
  image_url: string;
  active: boolean;
}

export default function GallerySection() {
  const [posts, setPosts] = useState<GalleryPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/gallery")
      .then((res) => {
        setPosts(res.data);
      })
      .catch((err) => {
        console.error("Ошибка загрузки галереи:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="py-24 bg-[#202030]" id="gallery">
      <div className="max-w-7xl mx-auto px-6">
        {/* Заголовок */}
        <div className="mb-16">
          <span className="inline-block text-start bg-[#1E79AD] text-white px-8 py-4 rounded-xl text-xl font-semibold">
            ГАЛЕРЕЯ
          </span>
          <h2 className="mt-6 text-4xl text-center md:text-5xl font-bold text-white">
            Наши <span className="text-[#1E79AD]">лучшие</span> программы
          </h2>
        </div>

        {/* Сетка */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-[#121212] rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-center text-white/60 text-xl">
            В настоящее время галерея пуста
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.id}
                className="
                  group
                  relative
                  aspect-[3/4]
                  rounded-2xl
                  overflow-hidden
                  shadow-2xl
                  hover:shadow-[#1E79AD]/40
                  transition-all duration-500
                "
              >
                {/* Фото */}
                <img
                  src={post.image_url}
                  alt={post.title || "Фитнес-программа"}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Градиент */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                {/* Текст внизу */}
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  {post.subtitle && (
                    <p className="text-[#1E79AD] text-sm font-bold uppercase tracking-wider mb-2">
                      {post.subtitle}
                    </p>
                  )}

                  <h3 className="text-white text-2xl font-bold">
                    {post.title || "ARE YOU READY?"}
                  </h3>
                </div>

                {/* Логотип в углу */}
                <div className="absolute top-6 right-6 text-white/80 text-xs font-medium">
                  ADRENALINE-FITNESS.COM
                </div>

                {/* Hover-эффект */}
                <div className="absolute inset-0 bg-[#1E79AD]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
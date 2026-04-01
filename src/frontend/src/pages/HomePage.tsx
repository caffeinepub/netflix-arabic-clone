import {
  Download,
  Gamepad2,
  Home,
  Play,
  Plus,
  Search,
  Smile,
  TrendingUp,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import type { Show } from "../backend.d";
import {
  FALLBACK_SHOWS,
  useGetAllShows,
  useGetFeaturedShow,
} from "../hooks/useQueries";

const CATEGORIES = [
  { id: "all", label: "مسلسلات وبرامج" },
  { id: "movies", label: "الأفلام" },
  { id: "genres", label: "الفئات ▼" },
];

const NAV_ITEMS = [
  { id: "home", label: "الصفحة الرئيسية", Icon: Home, active: true },
  { id: "games", label: "الألعاب", Icon: Gamepad2, active: false },
  { id: "trending", label: "الجديد والرائج", Icon: TrendingUp, active: false },
  { id: "my-space", label: "مساحتي على Netflix", Icon: Smile, active: false },
];

function extractDominantColor(imageUrl: string): Promise<string> {
  return new Promise((resolve) => {
    const fallback = "#40302B";
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = 50;
        canvas.height = 50;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve(fallback);
          return;
        }
        ctx.drawImage(img, 0, 0, 50, 50);
        const data = ctx.getImageData(0, 0, 50, 50).data;
        let r = 0;
        let g = 0;
        let b = 0;
        let count = 0;
        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        r = Math.floor((r / count) * 0.6);
        g = Math.floor((g / count) * 0.6);
        b = Math.floor((b / count) * 0.6);
        resolve(`rgb(${r},${g},${b})`);
      } catch {
        resolve(fallback);
      }
    };
    img.onerror = () => resolve(fallback);
    img.src = imageUrl;
  });
}

function ShowCard({ show, isNew }: { show: Show; isNew?: boolean }) {
  return (
    <div
      className="relative flex-shrink-0 overflow-hidden"
      style={{ width: 100, height: 150, borderRadius: 8 }}
    >
      <img
        src={show.posterUrl}
        alt={show.title}
        className="w-full h-full object-cover"
        loading="lazy"
      />
      {isNew && (
        <div
          className="absolute bottom-1 right-1 text-white font-bold leading-tight text-center"
          style={{
            backgroundColor: "#E50914",
            fontSize: 8,
            padding: "2px 4px",
            borderRadius: 4,
          }}
        >
          حلقة جديدة
          <br />
          شاهد الآن
        </div>
      )}
    </div>
  );
}

function ContentRow({
  title,
  shows,
  compact,
}: {
  title: string;
  shows: Show[];
  compact?: boolean;
}) {
  return (
    <section style={{ marginTop: compact ? 4 : 16 }}>
      <h2
        className="font-bold text-right px-4 mb-3"
        style={{ color: "#FFFFFF", fontSize: 14 }}
      >
        {title}
      </h2>
      <div
        className="flex gap-2 overflow-x-auto px-4 pb-2"
        style={
          {
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          } as React.CSSProperties
        }
      >
        {shows.map((show, i) => (
          <ShowCard
            key={show.id.toString()}
            show={show}
            isNew={show.isNew && i === 2}
          />
        ))}
      </div>
    </section>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [heroColor, setHeroColor] = useState("#40302B");
  const { data: allShows = FALLBACK_SHOWS } = useGetAllShows();
  const { data: featuredShow = FALLBACK_SHOWS[0] } = useGetFeaturedShow();

  useEffect(() => {
    if (!featuredShow?.posterUrl) return;
    extractDominantColor(featuredShow.posterUrl).then(setHeroColor);
  }, [featuredShow?.posterUrl]);

  const criticsShows = allShows.filter((s) => !s.isFeatured).slice(0, 5);
  const recommendedShows = allShows.filter((s) => !s.isFeatured).slice(2, 7);

  return (
    <div
      dir="rtl"
      className="min-h-screen"
      style={{ backgroundColor: "#000000", fontFamily: "'Cairo', sans-serif" }}
    >
      <div className="max-w-[430px] mx-auto relative">
        {/* Header */}
        <header
          className="sticky top-0 z-50 flex items-center justify-between"
          style={{
            padding: "10px 16px",
            backgroundColor: "#000000",
            backdropFilter: "blur(8px)",
          }}
        >
          <div
            className="font-black leading-none select-none"
            style={{
              color: "#E50914",
              fontSize: 26,
              fontFamily: "Georgia, serif",
            }}
          >
            N
          </div>
          <span style={{ color: "#FFFFFF", fontWeight: 600, fontSize: 16 }}>
            الصفحة الرئيسية
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              data-ocid="header.search_input"
              style={{
                color: "#FFFFFF",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="بحث"
            >
              <Search size={20} />
            </button>
            <button
              type="button"
              data-ocid="header.download_button"
              style={{
                color: "#FFFFFF",
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
              aria-label="تحميل"
            >
              <Download size={20} />
            </button>
          </div>
        </header>

        {/* Category pills */}
        <nav
          className="flex overflow-x-auto"
          style={
            {
              gap: 8,
              padding: "6px 16px",
              scrollbarWidth: "none",
              backgroundColor: "#000000",
            } as React.CSSProperties
          }
        >
          {CATEGORIES.map((cat) => (
            <button
              type="button"
              key={cat.id}
              data-ocid={`category.${cat.id}.tab`}
              onClick={() => setActiveCategory(cat.id)}
              className="flex-shrink-0 transition-all"
              style={{
                padding: "5px 14px",
                borderRadius: 9999,
                fontSize: 12,
                fontWeight: 400,
                fontFamily: "'Cairo', sans-serif",
                cursor: "pointer",
                background: "transparent",
                color: "#FFFFFF",
                border:
                  activeCategory === cat.id
                    ? "1px solid rgba(255,255,255,0.8)"
                    : "1px solid rgba(255,255,255,0.3)",
              }}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Main scrollable content */}
        <main className="pb-24">
          {/* Hero Featured Card */}
          {featuredShow && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div style={{ padding: 0, overflow: "hidden" }}>
                <div
                  className="relative"
                  style={{
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    borderBottomLeftRadius: 0,
                    borderBottomRightRadius: 0,
                    overflow: "hidden",
                  }}
                >
                  {/* Poster — 60vh tall */}
                  <img
                    src={featuredShow.posterUrl}
                    alt={featuredShow.title}
                    style={{
                      width: "100%",
                      height: "60vh",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />

                  {/* Dense gradient — starts at 20% from bottom, covers bottom 80% */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, #000000 0%, #000000 20%, rgba(0,0,0,0.97) 35%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.4) 65%, transparent 80%)",
                    }}
                  />

                  {/* Dynamic color top bleed */}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to bottom, ${heroColor} 0%, transparent 40%)`,
                      opacity: 0.45,
                    }}
                  />

                  {/* Content block — floats in bottom 20% of poster */}
                  <div
                    className="absolute left-0 right-0"
                    style={{ padding: "0 16px 20px 16px", bottom: 0 }}
                  >
                    {/* Title */}
                    <h1
                      style={{
                        color: "#FFFFFF",
                        fontSize: 26,
                        fontWeight: 700,
                        fontFamily: "'Cairo', sans-serif",
                        lineHeight: 1.2,
                        textAlign: "right",
                        letterSpacing: -0.5,
                        margin: 0,
                      }}
                    >
                      {featuredShow.title}
                    </h1>

                    {/* Genre tags */}
                    <p
                      style={{
                        color: "#B3B3B3",
                        fontSize: 12,
                        textAlign: "right",
                        fontFamily: "'Cairo', sans-serif",
                        margin: "6px 0 0 0",
                      }}
                    >
                      {featuredShow.genres.join(" • ")}
                    </p>

                    {/* Action buttons */}
                    <div className="flex" style={{ marginTop: 10, gap: 8 }}>
                      {/* Play button */}
                      <button
                        type="button"
                        data-ocid="hero.primary_button"
                        className="flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style={{
                          flex: 0.6,
                          background: "#FFFFFF",
                          color: "#000000",
                          fontWeight: 700,
                          fontSize: 17,
                          padding: "11px 0",
                          borderRadius: 4,
                          border: "none",
                          cursor: "pointer",
                          fontFamily: "'Cairo', sans-serif",
                        }}
                      >
                        <Play size={22} fill="#000000" color="#000000" />
                        عرض
                      </button>

                      {/* My List button */}
                      <button
                        type="button"
                        data-ocid="hero.secondary_button"
                        className="flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style={{
                          flex: 0.4,
                          background: "rgba(30,30,30,0.82)",
                          color: "#FFFFFF",
                          fontWeight: 700,
                          fontSize: 16,
                          padding: "11px 0",
                          borderRadius: 4,
                          border: "1px solid rgba(255,255,255,0.3)",
                          cursor: "pointer",
                          fontFamily: "'Cairo', sans-serif",
                        }}
                      >
                        <Plus size={16} />
                        قائمتي
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Content Row 1: Critics' Picks */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ContentRow
              title="عروض تلفزيونيّة نالت إعجاب النقّاد"
              shows={criticsShows}
            />
          </motion.div>

          {/* Content Row 2: Recommended */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.4 }}
          >
            <ContentRow
              title="👍 نظن أنك ستحب ما يلي"
              shows={recommendedShows}
            />
          </motion.div>
        </main>

        {/* Bottom Navigation */}
        <nav
          data-ocid="bottom_nav.panel"
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] flex items-center justify-around z-50"
          style={{
            padding: "8px 0",
            backgroundColor: "#000000",
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const iconColor =
              item.id === "my-space"
                ? "#F5A623"
                : item.active
                  ? "#FFFFFF"
                  : "#808080";
            const labelColor = item.active ? "#FFFFFF" : "#808080";
            return (
              <button
                type="button"
                key={item.id}
                data-ocid={`bottom_nav.${item.id}.tab`}
                className="flex flex-col items-center gap-1"
                style={{
                  padding: "2px 8px",
                  minWidth: 60,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif",
                }}
              >
                <item.Icon
                  size={22}
                  color={iconColor}
                  fill={
                    item.active && item.id !== "my-space" ? "#FFFFFF" : "none"
                  }
                />
                <span
                  className="leading-tight text-center line-clamp-2"
                  style={{ fontSize: 10, color: labelColor, maxWidth: 60 }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

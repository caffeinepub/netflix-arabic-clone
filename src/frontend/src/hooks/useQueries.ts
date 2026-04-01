import { useQuery } from "@tanstack/react-query";
import type { Show } from "../backend.d";
import { useActor } from "./useActor";

const FALLBACK_SHOWS: Show[] = [
  {
    id: BigInt(1),
    title: "مطاردة اليشم",
    isFeatured: true,
    posterUrl: "https://picsum.photos/seed/jade/400/600",
    genres: ["رومانسي", "عمل تاريخي", "صيني"],
    showType: "series" as never,
    isNew: true,
  },
  {
    id: BigInt(2),
    title: "La Casa de Papel",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/casa/300/450",
    genres: ["إثارة", "جريمة"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(3),
    title: "The Vampire Diaries",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/vampire/300/450",
    genres: ["خيال علمي", "رومانسي"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(4),
    title: "Wednesday",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/wednesday/300/450",
    genres: ["مغامرة", "غموض"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(5),
    title: "Spartacus",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/spartacus/300/450",
    genres: ["أكشن", "تاريخي"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(6),
    title: "خطايا لا توصف",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/sins/300/450",
    genres: ["دراما", "جريمة"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(7),
    title: "Stranger Things",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/stranger/300/450",
    genres: ["خيال علمي", "رعب"],
    showType: "series" as never,
    isNew: false,
  },
  {
    id: BigInt(8),
    title: "Squid Game",
    isFeatured: false,
    posterUrl: "https://picsum.photos/seed/squid/300/450",
    genres: ["إثارة", "أكشن"],
    showType: "series" as never,
    isNew: true,
  },
];

export function useGetAllShows() {
  const { actor, isFetching } = useActor();
  return useQuery<Show[]>({
    queryKey: ["shows"],
    queryFn: async () => {
      if (!actor) return FALLBACK_SHOWS;
      try {
        const result = await actor.getAllShows();
        return result.length > 0 ? result : FALLBACK_SHOWS;
      } catch {
        return FALLBACK_SHOWS;
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_SHOWS,
  });
}

export function useGetFeaturedShow() {
  const { actor, isFetching } = useActor();
  return useQuery<Show | null>({
    queryKey: ["featuredShow"],
    queryFn: async () => {
      if (!actor) return FALLBACK_SHOWS[0];
      try {
        const result = await actor.getFeaturedShow();
        return result ?? FALLBACK_SHOWS[0];
      } catch {
        return FALLBACK_SHOWS[0];
      }
    },
    enabled: !isFetching,
    placeholderData: FALLBACK_SHOWS[0],
  });
}

export { FALLBACK_SHOWS };

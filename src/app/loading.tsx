import { PageTransition, SkeletonOut } from "@/components/motion/page-transition";
import { HeroSearchPill } from "@/components/search/hero-search-pill";
import { Bone, RailSkeleton, TileGridSkeleton } from "@/components/skeletons";

/**
 * Home loading state (DESIGN §8.11): the hero frame, headline and a working search pill render for
 * real (static copy, no data), live numbers are bones; the category rak and the first rail show
 * shape-exact skeletons with the 400 ms-delayed shimmer wave and one rotating loading line.
 */
export default function HomeLoading() {
  return (
    <PageTransition>
      <SkeletonOut>
        <div aria-busy="true">
          <section className="relative isolate mx-3 mt-3 overflow-hidden rounded-sheet border-2 border-ink bg-gula-kapas shadow-pop-lg md:mx-6 md:rounded-panel">
            <div className="mesh" aria-hidden />
            <div className="relative grid gap-10 px-4 pt-5 pb-7 sm:px-8 sm:pt-7 lg:grid-cols-12 lg:gap-8 lg:px-14 lg:pt-11 lg:pr-10 lg:pb-12">
              <div className="flex min-w-0 flex-col lg:col-span-7">
                <Bone className="h-7 w-52 bg-putih/80" />
                <p className="mt-4 max-w-[13ch] text-display font-extrabold text-ink lg:mt-5 lg:max-w-[12.5ch]">
                  Semua jenama <span className="text-grad-lokal">lokal</span>, sentiasa up to date.
                </p>
                <div className="mt-5 flex max-w-[40ch] flex-col gap-2.5">
                  <Bone i={1} className="h-4 w-full bg-putih/70" />
                  <Bone i={2} className="h-4 w-[92%] bg-putih/70" />
                  <Bone i={3} className="h-4 w-[70%] bg-putih/70" />
                </div>
                <HeroSearchPill className="mt-16 lg:max-w-[520px]" />
                <div className="mt-5 grid grid-cols-3 gap-2.5 sm:gap-3 lg:mt-[92px] lg:max-w-[520px]">
                  {[0, 1, 2].map((i) => (
                    <Bone key={i} i={i + 4} className="h-[76px] rounded-[18px] bg-putih/80 lg:h-[88px]" />
                  ))}
                </div>
              </div>
              <div className="relative hidden h-[540px] self-center lg:col-span-5 lg:block">
                <Bone i={2} className="absolute inset-x-0 top-[92px] bottom-2 rounded-panel bg-putih/60" />
              </div>
            </div>
          </section>
          <div className="mt-6 h-11 bg-ink md:mt-8" />
          <div className="container-page mt-(--section-y)">
            <Bone className="mb-2 h-3 w-28" />
            <Bone className="mb-7 h-8 w-64 max-w-[80%] rounded-[10px]" />
            <TileGridSkeleton line={false} />
          </div>
          <div className="mt-(--section-y)">
            <RailSkeleton count={3} line />
          </div>
        </div>
      </SkeletonOut>
    </PageTransition>
  );
}

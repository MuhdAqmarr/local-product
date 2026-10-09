/**
 * Server-safe lucide icons. lucide-react 1.x marks its Icon component "use client", so every
 * icon rendered by a Server Component became a client island (148 on Home) with its props
 * serialised into the RSC payload. These render plain SVG from the vanilla `lucide` icon
 * data instead, with the same props (size, strokeWidth, absoluteStrokeWidth, className, …),
 * and work in Server and Client Components alike.
 *
 * Paths are inlined rather than drawn from a <symbol> sprite: measured on Home, a sprite cut
 * raw HTML by 1% but grew the gzipped page, because repeated paths compress almost for free.
 *
 * Add an icon: import its node from "lucide" and add it to ICONS below.
 */
import { createElement, type SVGProps } from "react";
import {
  ArrowLeft as ArrowLeftNode,
  ArrowRight as ArrowRightNode,
  ArrowUp as ArrowUpNode,
  ArrowUpDown as ArrowUpDownNode,
  ArrowUpRight as ArrowUpRightNode,
  Baby as BabyNode,
  BadgePercent as BadgePercentNode,
  Bike as BikeNode,
  CalendarDays as CalendarDaysNode,
  CalendarHeart as CalendarHeartNode,
  Camera as CameraNode,
  Check as CheckNode,
  ChevronDown as ChevronDownNode,
  ChevronLeft as ChevronLeftNode,
  ChevronRight as ChevronRightNode,
  CircleAlert as CircleAlertNode,
  CircleCheck as CircleCheckNode,
  CircleDot as CircleDotNode,
  Clock3 as Clock3Node,
  Coffee as CoffeeNode,
  Cookie as CookieNode,
  Dices as DicesNode,
  Droplets as DropletsNode,
  ExternalLink as ExternalLinkNode,
  Flame as FlameNode,
  Gift as GiftNode,
  Globe as GlobeNode,
  Handbag as HandbagNode,
  Headphones as HeadphonesNode,
  Heart as HeartNode,
  HeartPulse as HeartPulseNode,
  House as HouseNode,
  Info as InfoNode,
  LayoutGrid as LayoutGridNode,
  MapPin as MapPinNode,
  Megaphone as MegaphoneNode,
  Music2 as Music2Node,
  PackageX as PackageXNode,
  Pause as PauseNode,
  Play as PlayNode,
  RefreshCw as RefreshCwNode,
  RefreshCwOff as RefreshCwOffNode,
  RotateCcw as RotateCcwNode,
  Rows3 as Rows3Node,
  Search as SearchNode,
  Send as SendNode,
  Share2 as Share2Node,
  Shirt as ShirtNode,
  ShoppingBag as ShoppingBagNode,
  SlidersHorizontal as SlidersHorizontalNode,
  Sofa as SofaNode,
  Sparkles as SparklesNode,
  Store as StoreNode,
  Tag as TagNode,
  Trash2 as Trash2Node,
  TrendingDown as TrendingDownNode,
  TrendingUp as TrendingUpNode,
  Wallet as WalletNode,
  WifiOff as WifiOffNode,
  X as XNode,
} from "lucide";

type IconNode = ReadonlyArray<readonly [string, Record<string, string | number | undefined>]>;

export interface LucideProps extends Omit<SVGProps<SVGSVGElement>, "ref"> {
  size?: number | string;
  strokeWidth?: number | string;
  absoluteStrokeWidth?: boolean;
}

export type LucideIcon = ((props: LucideProps) => React.JSX.Element) & { displayName?: string };

const camel = (key: string) => key.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

const ICONS = {
  "arrow-left": ArrowLeftNode,
  "arrow-right": ArrowRightNode,
  "arrow-up": ArrowUpNode,
  "arrow-up-down": ArrowUpDownNode,
  "arrow-up-right": ArrowUpRightNode,
  "baby": BabyNode,
  "badge-percent": BadgePercentNode,
  "bike": BikeNode,
  "calendar-days": CalendarDaysNode,
  "calendar-heart": CalendarHeartNode,
  "camera": CameraNode,
  "check": CheckNode,
  "chevron-down": ChevronDownNode,
  "chevron-left": ChevronLeftNode,
  "chevron-right": ChevronRightNode,
  "circle-alert": CircleAlertNode,
  "circle-check": CircleCheckNode,
  "circle-dot": CircleDotNode,
  "clock3": Clock3Node,
  "coffee": CoffeeNode,
  "cookie": CookieNode,
  "dices": DicesNode,
  "droplets": DropletsNode,
  "external-link": ExternalLinkNode,
  "flame": FlameNode,
  "gift": GiftNode,
  "globe": GlobeNode,
  "handbag": HandbagNode,
  "headphones": HeadphonesNode,
  "heart": HeartNode,
  "heart-pulse": HeartPulseNode,
  "house": HouseNode,
  "info": InfoNode,
  "layout-grid": LayoutGridNode,
  "map-pin": MapPinNode,
  "megaphone": MegaphoneNode,
  "music2": Music2Node,
  "package-x": PackageXNode,
  "pause": PauseNode,
  "play": PlayNode,
  "refresh-cw": RefreshCwNode,
  "refresh-cw-off": RefreshCwOffNode,
  "rotate-ccw": RotateCcwNode,
  "rows3": Rows3Node,
  "search": SearchNode,
  "send": SendNode,
  "share2": Share2Node,
  "shirt": ShirtNode,
  "shopping-bag": ShoppingBagNode,
  "sliders-horizontal": SlidersHorizontalNode,
  "sofa": SofaNode,
  "sparkles": SparklesNode,
  "store": StoreNode,
  "tag": TagNode,
  "trash2": Trash2Node,
  "trending-down": TrendingDownNode,
  "trending-up": TrendingUpNode,
  "wallet": WalletNode,
  "wifi-off": WifiOffNode,
  "x": XNode,
} satisfies Record<string, unknown>;

type IconId = keyof typeof ICONS;

function make(id: IconId): LucideIcon {
  const children = (ICONS[id] as IconNode).map(([tag, attrs], i) =>
    createElement(tag, { key: i, ...Object.fromEntries(Object.entries(attrs).map(([k, v]) => [camel(k), v])) }),
  );
  function Icon({ size = 24, strokeWidth = 2, absoluteStrokeWidth, color = "currentColor", className, ...rest }: LucideProps) {
    const labelled = rest["aria-label"] !== undefined || rest["aria-labelledby"] !== undefined || rest.role === "img";
    return createElement(
      "svg",
      {
        width: size,
        height: size,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: color,
        strokeWidth: absoluteStrokeWidth ? (Number(strokeWidth) * 24) / Number(size) : strokeWidth,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        className: className ? `lucide lucide-${id} ${className}` : `lucide lucide-${id}`,
        ...(labelled ? {} : { "aria-hidden": true }),
        ...rest,
      },
      children,
    );
  }
  Icon.displayName = id;
  return Icon;
}

export const ArrowLeft = make("arrow-left");
export const ArrowRight = make("arrow-right");
export const ArrowUp = make("arrow-up");
export const ArrowUpDown = make("arrow-up-down");
export const ArrowUpRight = make("arrow-up-right");
export const Baby = make("baby");
export const BadgePercent = make("badge-percent");
export const Bike = make("bike");
export const CalendarDays = make("calendar-days");
export const CalendarHeart = make("calendar-heart");
export const Camera = make("camera");
export const Check = make("check");
export const ChevronDown = make("chevron-down");
export const ChevronLeft = make("chevron-left");
export const ChevronRight = make("chevron-right");
export const CircleAlert = make("circle-alert");
export const CircleCheck = make("circle-check");
export const CircleDot = make("circle-dot");
export const Clock3 = make("clock3");
export const Coffee = make("coffee");
export const Cookie = make("cookie");
export const Dices = make("dices");
export const Droplets = make("droplets");
export const ExternalLink = make("external-link");
export const Flame = make("flame");
export const Gift = make("gift");
export const Globe = make("globe");
export const Handbag = make("handbag");
export const Headphones = make("headphones");
export const Heart = make("heart");
export const HeartPulse = make("heart-pulse");
export const House = make("house");
export const Info = make("info");
export const LayoutGrid = make("layout-grid");
export const MapPin = make("map-pin");
export const Megaphone = make("megaphone");
export const Music2 = make("music2");
export const PackageX = make("package-x");
export const Pause = make("pause");
export const Play = make("play");
export const RefreshCw = make("refresh-cw");
export const RefreshCwOff = make("refresh-cw-off");
export const RotateCcw = make("rotate-ccw");
export const Rows3 = make("rows3");
export const Search = make("search");
export const Send = make("send");
export const Share2 = make("share2");
export const Shirt = make("shirt");
export const ShoppingBag = make("shopping-bag");
export const SlidersHorizontal = make("sliders-horizontal");
export const Sofa = make("sofa");
export const Sparkles = make("sparkles");
export const Store = make("store");
export const Tag = make("tag");
export const Trash2 = make("trash2");
export const TrendingDown = make("trending-down");
export const TrendingUp = make("trending-up");
export const Wallet = make("wallet");
export const WifiOff = make("wifi-off");
export const X = make("x");

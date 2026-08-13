import type { SvgComponent } from "astro/types"
import GitHub from "@/assets/icons/github.svg"
import RSS from "@/assets/icons/rss.svg"

export const SITE = {
  title: "Light",
  description:
    "International B2B sales, electronics manufacturing, and AI-assisted workflows.",
  locale: "en-US",
  dir: "ltr",
  defaultPageImage: "/static/site-card.svg",
  defaultPostImage: "/static/site-card.svg",
} as const

export const NAVIGATION = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/projects", label: "Projects" },
  { href: "/#contact", label: "Contact" },
]

export const SOCIALS: { href: string; label: string; icon: SvgComponent }[] = [
  {
    href: "https://github.com/lightzhan6-create",
    label: "GitHub",
    icon: GitHub,
  },
  { href: "/rss.xml", label: "RSS", icon: RSS },
]

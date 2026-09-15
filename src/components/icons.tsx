import {
  Mic, Gem, Briefcase, PartyPopper, Church, Martini, Ticket, Flower2,
  GraduationCap, Shirt, Wrench, Speaker, Clock, SlidersHorizontal, BadgeCheck,
  Cable, Building2, MessageCircle, FileText, Zap, Camera, Play, Gift, Check,
  X, Headphones, Package, CalendarCheck, Ruler, Smartphone, Music, AtSign,
  Clapperboard, type LucideIcon,
} from "lucide-react";

const MAP: Record<string, LucideIcon> = {
  mic: Mic, gem: Gem, briefcase: Briefcase, party: PartyPopper, church: Church,
  martini: Martini, ticket: Ticket, flower: Flower2, graduation: GraduationCap,
  shirt: Shirt, wrench: Wrench, speaker: Speaker, clock: Clock, sliders: SlidersHorizontal,
  badge: BadgeCheck, cable: Cable, building: Building2, chat: MessageCircle,
  file: FileText, zap: Zap, camera: Camera, play: Play, gift: Gift, check: Check,
  x: X, headphones: Headphones, package: Package, calendar: CalendarCheck,
  ruler: Ruler, phone: Smartphone, music: Music, instagram: AtSign, clapper: Clapperboard,
};

/** Icônes ligne monochromes, neutres (style Chariow / lucide). */
export function Icon({ name, className = "h-5 w-5" }: { name: string; className?: string }) {
  const C = MAP[name] ?? Mic;
  return <C className={className} strokeWidth={1.6} aria-hidden />;
}

/** Icône dans une tuile sobre, couleur neutre. */
export function IconTile({ name, className = "h-12 w-12", iconClass = "h-5 w-5 text-ivory/80" }: { name: string; className?: string; iconClass?: string }) {
  return (
    <span className={`flex items-center justify-center rounded-xl border border-ivory/12 bg-white/[0.04] ${className}`}>
      <Icon name={name} className={iconClass} />
    </span>
  );
}

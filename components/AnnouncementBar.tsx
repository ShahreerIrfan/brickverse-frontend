import { IconSpark } from "./icons";

export default function AnnouncementBar() {
  return (
    <div className="bg-grad-top text-white text-center py-2 px-4 flex items-center justify-center gap-2 text-xs sm:text-sm">
      <IconSpark className="w-3.5 h-3.5 shrink-0" />
      <span className="font-semibold">Nationwide delivery in Bangladesh</span>
      <span className="hidden sm:inline w-1 h-1 rounded-full bg-white/70" />
      <span className="hidden sm:inline opacity-90 font-medium">
        Code BUILD10 saves you 10% on your first order
      </span>
    </div>
  );
}

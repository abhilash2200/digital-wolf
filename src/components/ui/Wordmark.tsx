import Image from "next/image";
import { SmartLink as Link } from "@/components/ui/SmartLink";
import { cn } from "@/lib/cn";
import { SITE } from "@/constants/site";

export function Wordmark({
  className,
  priority = false,
  onClick,
}: {
  className?: string;
  priority?: boolean;
  onClick?: () => void;
}) {
  return (
    <Link
      href="/"
      onClick={onClick}
      aria-label={`${SITE.name} — home`}
      className={cn(
        "inline-flex items-center",
        className,
      )}
    >
      <Image
        src="/images/dw-logo.webp"
        alt={SITE.name}
        width={124}
        height={44}
        priority={priority}
        className="h-8 w-auto object-contain md:h-9"
      />
    </Link>
  );
}

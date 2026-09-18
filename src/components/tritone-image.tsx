import Image from "next/image";
import { cn } from "@/lib/utils";

interface TritoneImageProps {
	src: string;
	alt: string;
	sizes: string;
	priority?: boolean;
	/** Sizing for the plate itself, e.g. an aspect-ratio utility. */
	className?: string;
}

/**
 * A photograph printed in the site's three inks — ink for the shadows, the
 * signal for the mid-tones, paper for the highlights — via the gradient-map
 * filters in `PrintFilters`. Unlike a halftone screen it keeps continuous
 * tone, so screenshots and type inside the image stay legible.
 *
 * Hovering or focusing the nearest `.group` ancestor crossfades to the
 * original colour photograph laid over it. Pure CSS; no client JavaScript.
 */
export function TritoneImage({ src, alt, sizes, priority, className }: TritoneImageProps) {
	return (
		<div className={cn("ed-tritone relative overflow-hidden bg-[var(--card)]", className)}>
			<Image
				src={src}
				alt={alt}
				fill
				sizes={sizes}
				priority={priority}
				className="ed-tritone-print object-cover"
			/>
			<Image
				src={src}
				alt=""
				aria-hidden="true"
				fill
				sizes={sizes}
				className="ed-tritone-photo object-cover"
			/>
		</div>
	);
}

/**
 * The gradient maps behind `TritoneImage`, one per theme. Channel tables run
 * shadow → mid → highlight, from the palette tokens converted to sRGB:
 * light is ink → signal → paper; dark is card → signal → ink, so an image on
 * dark paper stays a positive rather than turning into a negative.
 *
 * Rendered once in the root layout.
 */
export function PrintFilters() {
	return (
		<svg aria-hidden="true" width="0" height="0" className="absolute size-0 overflow-hidden">
			<filter id="ed-tritone-light" colorInterpolationFilters="sRGB">
				<feColorMatrix type="saturate" values="0" />
				<feComponentTransfer>
					<feFuncR type="table" tableValues="0.079 0.838 0.977" />
					<feFuncG type="table" tableValues="0.072 0.295 0.968" />
					<feFuncB type="table" tableValues="0.066 0.174 0.949" />
				</feComponentTransfer>
			</filter>
			<filter id="ed-tritone-dark" colorInterpolationFilters="sRGB">
				<feColorMatrix type="saturate" values="0" />
				<feComponentTransfer>
					<feFuncR type="table" tableValues="0.105 0.942 0.912" />
					<feFuncG type="table" tableValues="0.095 0.387 0.901" />
					<feFuncB type="table" tableValues="0.086 0.236 0.88" />
				</feComponentTransfer>
			</filter>
		</svg>
	);
}

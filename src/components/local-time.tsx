"use client";

import { useEffect, useState } from "react";

const TIME_ZONE = "Asia/Colombo";
const OFFSET_LABEL = "UTC+5:30";

const clock = new Intl.DateTimeFormat("en-GB", {
	hour: "2-digit",
	minute: "2-digit",
	hourCycle: "h23",
	timeZone: TIME_ZONE,
});

/**
 * The time where I am, for anyone deciding when to write. It ticks once a
 * minute, aligned to the minute boundary; the only continuous motion is the
 * colon, which uses the same `ed-blink` as every other "live" indicator.
 *
 * The server can't know the reader's moment, so it renders a fixed-width
 * placeholder and the client fills it in after mount — no hydration mismatch.
 */
export function LocalTime({ className }: { className?: string }) {
	const [now, setNow] = useState<Date | null>(null);

	useEffect(() => {
		let timer: ReturnType<typeof setTimeout>;
		const tick = () => {
			const date = new Date();
			setNow(date);
			timer = setTimeout(tick, 60_000 - (date.getTime() % 60_000) + 25);
		};
		tick();
		return () => clearTimeout(timer);
	}, []);

	const parts = now ? clock.formatToParts(now) : null;
	const hour = parts?.find((p) => p.type === "hour")?.value ?? "--";
	const minute = parts?.find((p) => p.type === "minute")?.value ?? "--";

	return (
		<span className={className}>
			<time dateTime={now?.toISOString()} data-numeric>
				<span aria-hidden="true">
					{hour}
					<span className={now ? "animate-ed-blink" : undefined}>:</span>
					{minute}
				</span>
				<span className="sr-only">{now ? `${hour}:${minute}` : "Loading local time"}</span>
			</time>
			<span className="ml-1.5 font-mono text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
				{OFFSET_LABEL}
			</span>
		</span>
	);
}

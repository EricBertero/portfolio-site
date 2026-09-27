"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@/components/ui/icons";

interface YoutubeEmbedProps {
  /** YouTube video id, or null to show a "coming soon" state. */
  youtubeId: string | null;
  /** Local poster image path, shown before the video loads. */
  poster: string;
  /** Descriptive title used for the iframe and the play button's accessible name. */
  title: string;
}

/**
 * Click-to-load YouTube facade. No request to YouTube is made until the
 * visitor clicks play, and privacy-enhanced mode (youtube-nocookie.com) is
 * used once they do.
 */
export function YoutubeEmbed({ youtubeId, poster, title }: YoutubeEmbedProps) {
  const [playing, setPlaying] = useState(false);

  return (
    // Always dark: the poster and play overlay are dark imagery in both color schemes.
    <div className="theme-dark relative aspect-video w-full overflow-hidden rounded-xl border border-line bg-surface-2">
      {playing && youtubeId ? (
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <>
          <Image
            src={poster}
            alt=""
            fill
            sizes="(min-width: 1152px) 1104px, 100vw"
            className="object-cover"
          />
          {youtubeId ? (
            <button
              type="button"
              onClick={() => setPlaying(true)}
              aria-label={`Play: ${title}`}
              className="group absolute inset-0 flex items-center justify-center bg-black/40 transition-colors hover:bg-black/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
            >
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand text-white shadow-lg motion-safe:transition-transform motion-safe:group-hover:scale-105">
                <PlayIcon className="ml-1 h-6 w-6" />
              </span>
            </button>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <p className="text-sm font-medium text-soft">Demo coming soon</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

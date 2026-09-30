interface DemoVideoProps {
  video: string;
  captions: string;
  poster: string;
  title: string;
  caption: string;
}

/**
 * Self-hosted walkthrough video with English captions. Nothing loads until the visitor presses
 * play (`preload="none"`), and the native controls give them pause, captions and full screen.
 */
export function DemoVideo({ video, captions, poster, title, caption }: DemoVideoProps) {
  return (
    <figure className="flex flex-col gap-4">
      <div className="overflow-hidden rounded-2xl border border-line bg-surface-2">
        <video
          controls
          playsInline
          preload="none"
          poster={poster}
          aria-label={title}
          className="block aspect-video h-auto w-full"
        >
          <source src={video} type="video/mp4" />
          <track kind="captions" src={captions} srcLang="en" label="English" default />
        </video>
      </div>
      <figcaption className="max-w-[65ch] text-sm leading-6 text-muted">{caption}</figcaption>
    </figure>
  );
}

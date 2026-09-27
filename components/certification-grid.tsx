import Image from "next/image";
import type { Certification } from "@/content/site";
import { BadgeIcon, CheckIcon } from "@/components/ui/icons";
import { RevealGroup, RevealItem } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";

interface CertificationGridProps {
  certifications: Certification[];
}

export function CertificationGrid({ certifications }: CertificationGridProps) {
  return (
    <RevealGroup as="ul" className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
      {certifications.map((cert) => (
        <RevealItem as="li" key={cert.name} className="flex">
          <CertificationCard cert={cert} />
        </RevealItem>
      ))}
    </RevealGroup>
  );
}

function CertificationCard({ cert }: { cert: Certification }) {
  const clickable = Boolean(cert.verifyUrl);
  const issuerInitial = cert.issuer.trim().charAt(0).toUpperCase();

  const content = (
    <>
      {cert.badge ? (
        <Image
          src={cert.badge}
          alt=""
          width={72}
          height={72}
          className="h-[72px] w-[72px] object-contain"
        />
      ) : (
        <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full border border-line bg-surface-2">
          {issuerInitial ? (
            <span className="text-xl font-semibold text-brand-text" aria-hidden="true">
              {issuerInitial}
            </span>
          ) : (
            <BadgeIcon aria-hidden="true" className="h-8 w-8 text-brand" />
          )}
        </div>
      )}

      <p className="mt-4 font-semibold text-foreground">{cert.name}</p>
      <p className="mt-1 text-sm text-muted">
        {cert.issuer}
        {!cert.inProgress && cert.year ? ` · ${cert.year}` : ""}
      </p>

      {cert.inProgress ? (
        <span className="mt-3 inline-flex w-fit items-center rounded-full border border-brand/40 px-2 py-0.5 text-[11px] font-medium text-brand-text">
          In Progress
        </span>
      ) : null}

      {cert.verifyUrl ? (
        <p className="mt-auto flex flex-wrap items-baseline gap-x-2 pt-4 text-xs">
          <span className="inline-flex items-center gap-1 self-center font-medium text-brand-text">
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Verified
          </span>
          {cert.verifyCode ? (
            <span className="text-muted">
              Code <span className="font-mono text-soft">{cert.verifyCode}</span>
            </span>
          ) : null}
        </p>
      ) : null}
    </>
  );

  const cardClasses = cn(
    "flex w-full flex-col rounded-xl border border-line bg-surface p-6",
    clickable
      ? cn(
          "transition-[transform,box-shadow,border-color] duration-300 ease-out hover:border-brand/40",
          "motion-safe:hover:-translate-y-1 motion-safe:hover:-rotate-1",
          "hover:shadow-[0_12px_32px_-12px] hover:shadow-brand/50",
        )
      : "transition-colors duration-300 hover:border-line-strong",
  );

  if (cert.verifyUrl) {
    return (
      <a
        href={cert.verifyUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={
          cert.verifyCode
            ? `Verify ${cert.name} on ${cert.issuer} (verification code ${cert.verifyCode})`
            : `Verify ${cert.name} on ${cert.issuer}`
        }
        className={cn(
          cardClasses,
          "block focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        )}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={cardClasses}>
      {content}
    </div>
  );
}

import type { Service, ServiceGroup } from "@/content/homelab";
import { monogram, readableOn, toolHex, ToolIcon } from "@/components/ui/tool-icons";

/** The service's logo on its brand color, or a neutral monogram when there's no open logo. */
function ServiceMark({ service }: { service: Service }) {
  if (!service.icon) {
    return (
      <span
        aria-hidden="true"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line-strong bg-surface-2 text-sm font-bold tracking-tight text-foreground"
      >
        {monogram(service.name)}
      </span>
    );
  }

  const background = toolHex(service.icon);
  return (
    <span
      aria-hidden="true"
      style={{ backgroundColor: background, color: readableOn(background) }}
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-line"
    >
      <ToolIcon name={service.icon} className="h-5 w-5" />
    </span>
  );
}

export function ServiceGroups({ groups }: { groups: ServiceGroup[] }) {
  return (
    <div className="flex flex-col gap-12">
      {groups.map((group) => (
        <div key={group.title}>
          <h3 className="text-base font-semibold text-foreground">{group.title}</h3>
          <ul className="mt-4 grid gap-x-10 sm:grid-cols-2">
            {group.services.map((service) => (
              <li key={service.name} className="flex gap-4 border-t border-line py-4">
                <ServiceMark service={service} />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-3 font-medium text-foreground">
                    {service.name}
                    {service.status === "Planned" ? (
                      <span className="text-xs font-semibold tracking-[0.2em] text-brand-text uppercase">Planned</span>
                    ) : null}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-muted">{service.purpose}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

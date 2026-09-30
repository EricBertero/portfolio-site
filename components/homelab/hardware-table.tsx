import type { HardwareNode } from "@/content/homelab";
import { RouterIcon, ServerIcon } from "@/components/ui/icons";

type SpecKey = "os" | "cpu" | "memory" | "storage";

const SPECS: { key: SpecKey; label: string }[] = [
  { key: "os", label: "OS" },
  { key: "cpu", label: "CPU" },
  { key: "memory", label: "Memory" },
  { key: "storage", label: "Storage" },
];

function NodeName({ node }: { node: HardwareNode }) {
  const Icon = node.kind === "router" ? RouterIcon : ServerIcon;
  return (
    <span className="inline-flex items-center gap-2.5 font-medium text-foreground">
      <Icon className="h-5 w-5 shrink-0 text-brand-text" aria-hidden="true" />
      {node.name}
    </span>
  );
}

/**
 * One row per physical node. A spec column only appears once some node has a value for it,
 * so unfilled specs never show as empty cells. Stacks into one block per node on small screens.
 */
export function HardwareTable({ nodes }: { nodes: HardwareNode[] }) {
  const specs = SPECS.filter(({ key }) => nodes.some((node) => node[key]));

  return (
    <>
      <div className="hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line-strong text-muted">
              <th scope="col" className="py-3 pr-6 font-medium">
                Node
              </th>
              <th scope="col" className="py-3 pr-6 font-medium">
                Role
              </th>
              {specs.map(({ key, label }) => (
                <th key={key} scope="col" className="py-3 pr-6 font-medium">
                  {label}
                </th>
              ))}
              <th scope="col" className="py-3 font-medium">
                Runs
              </th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            {nodes.map((node) => (
              <tr key={node.id} className="border-b border-line align-top">
                <th scope="row" className="py-4 pr-6 font-normal whitespace-nowrap">
                  <NodeName node={node} />
                </th>
                <td className="py-4 pr-6 text-soft">{node.role}</td>
                {specs.map(({ key }) => (
                  <td key={key} className="py-4 pr-6 whitespace-nowrap text-soft">
                    {node[key] ?? "—"}
                  </td>
                ))}
                <td className="py-4 text-soft">{node.workloads.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="flex flex-col md:hidden">
        {nodes.map((node) => (
          <li key={node.id} className="border-b border-line py-5 first:pt-0">
            <NodeName node={node} />
            <dl className="mt-3 grid grid-cols-[6rem_minmax(0,1fr)] gap-x-4 gap-y-2 text-sm tabular-nums">
              <dt className="text-muted">Role</dt>
              <dd className="text-soft">{node.role}</dd>
              {specs.map(({ key, label }) =>
                node[key] ? (
                  <div key={key} className="contents">
                    <dt className="text-muted">{label}</dt>
                    <dd className="text-soft">{node[key]}</dd>
                  </div>
                ) : null,
              )}
              <dt className="text-muted">Runs</dt>
              <dd className="text-soft">{node.workloads.join(", ")}</dd>
            </dl>
          </li>
        ))}
      </ul>
    </>
  );
}

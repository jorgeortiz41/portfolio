import { Container } from "@/components/ui/Container";
import { Github, LinkedIn, Mail } from "@/components/icons";
import { site } from "@/lib/site";

const socials = [
  { href: site.socials.github, label: "GitHub", Icon: Github },
  { href: site.socials.linkedin, label: "LinkedIn", Icon: LinkedIn },
  { href: `mailto:${site.email}`, label: "Email", Icon: Mail },
];

export function SiteFooter() {
  return (
    <footer className="mt-32 border-t border-rule py-12">
      <Container className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-mono text-xs tracking-wide text-ink-faint">
          © {new Date().getFullYear()} {site.name} · {site.location}
        </p>

        <ul className="-m-2 flex items-center gap-1 sm:m-0 sm:gap-5">
          {socials.map(({ href, label, Icon }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                {...(href.startsWith("http")
                  ? { target: "_blank", rel: "noopener noreferrer" }
                  : {})}
                className="inline-flex size-11 items-center justify-center text-ink-faint transition-colors hover:text-accent sm:size-auto"
              >
                <Icon className="size-5" />
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </footer>
  );
}

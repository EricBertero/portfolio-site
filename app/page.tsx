import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import SkillsSection from "@/components/sections/skills-section";
import ProjectsSection from "@/components/sections/projects-section";
import ExperienceSection from "@/components/sections/experience-section";
import ContactSection from "@/components/sections/contact-section";
import { certifications, contact, homeSeo, profile, skillCategories } from "@/content/site";
import { JsonLd, PERSON_ID, absoluteUrl, personNode } from "@/lib/seo";
import { siteUrl } from "@/lib/site-url";

// The home page is a profile page about one person, published on the site of the same name.
const homeGraph = [
  {
    "@type": "ProfilePage",
    "@id": absoluteUrl("/#profile"),
    url: siteUrl.href,
    name: `${profile.name} — ${homeSeo.title}`,
    description: homeSeo.description,
    inLanguage: "en",
    mainEntity: { "@id": PERSON_ID },
  },
  {
    ...personNode(),
    description: profile.tagline,
    email: `mailto:${contact.email}`,
    image: absoluteUrl("/opengraph-image"),
    ...(profile.location ? { homeLocation: { "@type": "Place", name: profile.location } } : {}),
    knowsAbout: skillCategories.flatMap((category) => category.groups.flatMap((group) => group.items)),
    hasCredential: certifications
      .filter((cert) => !cert.inProgress)
      .map((cert) => ({
        "@type": "EducationalOccupationalCredential",
        name: cert.name,
        credentialCategory: "certification",
        recognizedBy: { "@type": "Organization", name: cert.issuer },
        ...(cert.verifyUrl ? { url: cert.verifyUrl } : {}),
      })),
  },
  {
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    url: siteUrl.href,
    name: profile.name,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  },
];

export default function Home() {
  return (
    <>
      <JsonLd graph={homeGraph} />
      <SiteNav />
      <main id="main-content" className="flex flex-1 flex-col">
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <ProjectsSection />
        <ExperienceSection />
        <ContactSection />
      </main>
      <SiteFooter />
    </>
  );
}

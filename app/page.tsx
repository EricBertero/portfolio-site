import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import HeroSection from "@/components/sections/hero-section";
import AboutSection from "@/components/sections/about-section";
import SkillsSection from "@/components/sections/skills-section";
import ProjectsSection from "@/components/sections/projects-section";
import ExperienceSection from "@/components/sections/experience-section";
import ContactSection from "@/components/sections/contact-section";
import { certifications, contact, profile, skillCategories, socials } from "@/content/site";
import { siteUrl } from "@/lib/site-url";

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.title,
  description: profile.tagline,
  url: siteUrl.href,
  email: `mailto:${contact.email}`,
  ...(profile.location ? { homeLocation: { "@type": "Place", name: profile.location } } : {}),
  sameAs: socials.filter((social) => social.href.startsWith("https://")).map((social) => social.href),
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
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
      />
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

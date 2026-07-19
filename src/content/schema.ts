export type Locale = "en" | "fa";

export interface NavContent {
  home: string;
  about: string;
  portfolio: string;
  services: string;
  contact: string;
  order: string;
  cta: string;
  brand: string;
  brandTagline: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface HeroContent {
  eyebrow: string;
  titleLine1: string;
  titleHighlight: string;
  titleLine2: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  stats: StatItem[];
  badges: string[];
}

export interface FeatureItem {
  title: string;
  description: string;
  icon: "brain" | "fiber" | "atom" | "automation" | "web" | "chart";
}

export interface HomeContent {
  hero: HeroContent;
  introEyebrow: string;
  introTitle: string;
  introBody: string;
  features: FeatureItem[];
  portfolioTeaserTitle: string;
  portfolioTeaserSubtitle: string;
  processTitle: string;
  processSubtitle: string;
  processSteps: { title: string; description: string }[];
  ctaBannerTitle: string;
  ctaBannerSubtitle: string;
  ctaBannerButton: string;
}

export interface TimelineItem {
  period: string;
  title: string;
  place: string;
  description: string;
}

export interface SkillGroup {
  title: string;
  skills: string[];
}

export interface AboutContent {
  eyebrow: string;
  title: string;
  intro: string;
  bio: string[];
  photoAlt: string;
  skillsTitle: string;
  skillGroups: SkillGroup[];
  educationTitle: string;
  education: TimelineItem[];
  experienceTitle: string;
  experience: TimelineItem[];
  publicationsTitle: string;
  publications: string[];
  resumeCta: string;
}

export interface ServiceItem {
  title: string;
  description: string;
  bullets: string[];
  startingPrice: string;
  icon: FeatureItem["icon"];
}

export interface ServicesContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  items: ServiceItem[];
  processNote: string;
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButton: string;
}

export interface PortfolioProject {
  slug: string;
  title: string;
  category: string;
  summary: string;
  description: string[];
  tags: string[];
  role: string;
  year: string;
  results: string[];
  icon: FeatureItem["icon"];
}

export interface PortfolioContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  filterAll: string;
  viewCase: string;
  backToPortfolio: string;
  projects: PortfolioProject[];
}

export interface ContactContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  formName: string;
  formEmail: string;
  formSubject: string;
  formMessage: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccess: string;
  formError: string;
  directTitle: string;
  directEmail: string;
  directLocation: string;
  locationValue: string;
}

export interface OrderContent {
  eyebrow: string;
  title: string;
  subtitle: string;
  steps: string[];
  formName: string;
  formEmail: string;
  formPhone: string;
  formServiceType: string;
  serviceOptions: string[];
  formBudget: string;
  budgetOptions: string[];
  formTimeline: string;
  timelineOptions: string[];
  formDescription: string;
  formDescriptionPlaceholder: string;
  depositNote: string;
  formSubmit: string;
  formSubmitting: string;
  formSuccessTitle: string;
  formSuccessBody: string;
  formError: string;
  payNow: string;
  paySkip: string;
}

export interface FooterContent {
  tagline: string;
  rights: string;
  quickLinksTitle: string;
  contactTitle: string;
  legalPrivacy: string;
  legalTerms: string;
}

export interface LegalContent {
  privacyTitle: string;
  privacyBody: string[];
  termsTitle: string;
  termsBody: string[];
}

export interface MetaContent {
  title: string;
  description: string;
  keywords: string[];
}

export interface SiteContent {
  locale: Locale;
  meta: MetaContent;
  nav: NavContent;
  home: HomeContent;
  about: AboutContent;
  services: ServicesContent;
  portfolio: PortfolioContent;
  contact: ContactContent;
  order: OrderContent;
  footer: FooterContent;
  legal: LegalContent;
  common: {
    switchLang: string;
    langName: string;
    notFoundTitle: string;
    notFoundBody: string;
    notFoundCta: string;
  };
}

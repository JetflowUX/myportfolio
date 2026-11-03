"use client";

import Link from "next/link";
import { LogoMark } from "@/components/logo-mark";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  ExternalLink,
  FileText,
  LayoutGrid,
  LogOut,
  Pencil,
  Plus,
  Quote,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Button,
  Field,
  FormSection,
  GalleryField,
  ImageField,
  TextArea,
  TextInput,
  Toast,
  Toggle,
  type Notice,
} from "@/components/admin/ui";
import { projects, type Experience, type Project, type Testimonial } from "@/lib/data";
import { homeCases } from "@/lib/home-work";
import {
  deleteAdminExperience,
  deleteAdminProject,
  deleteAdminResume,
  deleteAdminTestimonial,
  getSiteContent,
  saveAdminExperience,
  saveAdminProject,
  saveAdminResume,
  saveAdminTestimonial,
  slugify,
  uploadAdminFile,
} from "@/lib/project-store";

/* The admin (redesigned 2026-11-03, Jethro: "CHANGE THE ADMIN VIES TO SOMETHING GOOD"). Three
   views in a side menu: projects (a list, then an editor with a live preview of the home panel),
   work history, and the résumé. What it saves and how is unchanged: lib/project-store.ts talks to
   the /api/admin routes, which keep everything in Vercel Blob (lib/blob-content.ts). */

type View = "projects" | "history" | "testimonials" | "resume";

type FormState = {
  title: string;
  slug: string;
  year: string;
  category: "engineering" | "design";
  description: string;
  problem: string;
  solution: string;
  role: string;
  context: string;
  objectives: string;
  audience: string;
  process: string;
  researchInsights: string;
  informationArchitecture: string;
  wireframes: string;
  visualDesign: string;
  prototypeTesting: string;
  outcomes: string;
  learnings: string;
  nextSteps: string;
  tech: string;
  image: string;
  caseStudyImage: string;
  caseStudyGallery: string[];
  projectLink: string;
  caseStudy: string;
  showOnHome: boolean;
  homeOrder: string;
  homeTitle: string;
  homeMeta: string;
  homeLine: string;
  cover: string;
  coverBg: string;
  coverDark: boolean;
};

type ExperienceFormState = { when: string; role: string; note: string; order: string };
type TestimonialFormState = { quote: string; name: string; role: string; photo: string; order: string };

const initialForm: FormState = {
  title: "",
  slug: "",
  year: new Date().getFullYear().toString(),
  category: "design",
  description: "",
  problem: "",
  solution: "",
  role: "",
  context: "",
  objectives: "",
  audience: "",
  process: "",
  researchInsights: "",
  informationArchitecture: "",
  wireframes: "",
  visualDesign: "",
  prototypeTesting: "",
  outcomes: "",
  learnings: "",
  nextSteps: "",
  tech: "",
  image: "",
  caseStudyImage: "",
  caseStudyGallery: [],
  projectLink: "",
  caseStudy: "",
  showOnHome: true,
  homeOrder: "",
  homeTitle: "",
  homeMeta: "",
  homeLine: "",
  cover: "",
  coverBg: "",
  coverDark: false,
};

const initialExperienceForm: ExperienceFormState = { when: "", role: "", note: "", order: "" };
const initialTestimonialForm: TestimonialFormState = { quote: "", name: "", role: "", photo: "", order: "" };

const DEFAULT_RESUME_URL = "/resume.pdf";
const BUILT_IN_SLUGS = new Set(projects.map((item) => item.slug));

function toForm(project: Project): FormState {
  return {
    title: project.title,
    slug: project.slug,
    year: project.year,
    category: project.category,
    description: project.description,
    problem: project.problem,
    solution: project.solution ?? "",
    role: project.role,
    context: project.context ?? "",
    objectives: project.objectives ?? "",
    audience: project.audience ?? "",
    process: project.process ?? "",
    researchInsights: project.researchInsights ?? "",
    informationArchitecture: project.informationArchitecture ?? "",
    wireframes: project.wireframes ?? "",
    visualDesign: project.visualDesign ?? "",
    prototypeTesting: project.prototypeTesting ?? "",
    outcomes: project.outcomes ?? "",
    learnings: project.learnings ?? "",
    nextSteps: project.nextSteps ?? "",
    tech: project.tech.join(", "),
    image: project.image,
    caseStudyImage: project.caseStudyImage ?? "",
    caseStudyGallery: project.caseStudyGallery ?? [],
    projectLink: project.projectLink ?? "",
    caseStudy: project.caseStudy ?? "",
    showOnHome: project.showOnHome !== false,
    homeOrder: project.homeOrder?.toString() ?? "",
    homeTitle: project.homeTitle ?? "",
    homeMeta: project.homeMeta ?? "",
    homeLine: project.homeLine ?? "",
    cover: project.cover ?? "",
    coverBg: project.coverBg ?? "",
    coverDark: Boolean(project.coverDark),
  };
}

function toProject(form: FormState, slug: string): Project {
  return {
    slug,
    title: form.title.trim(),
    year: form.year.trim() || new Date().getFullYear().toString(),
    description: form.description.trim() || "No short description provided yet.",
    problem: form.problem.trim() || "No problem statement provided yet.",
    solution: form.solution.trim() || "No solution summary provided yet.",
    role: form.role.trim() || "Role not specified",
    context: form.context.trim(),
    objectives: form.objectives.trim(),
    audience: form.audience.trim(),
    process: form.process.trim(),
    researchInsights: form.researchInsights.trim(),
    informationArchitecture: form.informationArchitecture.trim(),
    wireframes: form.wireframes.trim(),
    visualDesign: form.visualDesign.trim(),
    prototypeTesting: form.prototypeTesting.trim(),
    outcomes: form.outcomes.trim(),
    learnings: form.learnings.trim(),
    nextSteps: form.nextSteps.trim(),
    tech: form.tech
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
    category: form.category,
    // Blank stays blank, so a cleared image really clears; the hero falls back to the thumbnail.
    image: form.image.trim(),
    caseStudyImage: form.caseStudyImage.trim() || form.image.trim(),
    caseStudyGallery: form.caseStudyGallery.map((item) => item.trim()).filter(Boolean),
    projectLink: form.projectLink.trim(),
    caseStudy: form.caseStudy.trim(),
    showOnHome: form.showOnHome,
    homeOrder: form.homeOrder.trim() ? Number(form.homeOrder) : undefined,
    homeTitle: form.homeTitle.trim(),
    homeMeta: form.homeMeta.trim(),
    homeLine: form.homeLine.trim(),
    cover: form.cover.trim(),
    coverBg: form.coverBg.trim(),
    coverDark: form.coverDark,
  };
}

function fileName(url: string): string {
  if (!url || url === DEFAULT_RESUME_URL) return "resume.pdf (built in)";
  const last = decodeURIComponent(url.split("?")[0].split("/").pop() ?? url);
  // Blob uploads carry a random suffix before the extension: name-AbC123xyz.pdf
  return last.replace(/-[A-Za-z0-9]{20,}(\.[a-z0-9]+)$/i, "$1");
}

export function AdminDashboard() {
  const router = useRouter();
  const [view, setView] = useState<View>("projects");
  const [notice, setNotice] = useState<Notice>(null);
  const [isBusy, setIsBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [adminProjectSlugs, setAdminProjectSlugs] = useState<Set<string>>(new Set());
  const [availableExperience, setAvailableExperience] = useState<Experience[]>([]);
  const [availableTestimonials, setAvailableTestimonials] = useState<Testimonial[]>([]);
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);

  // The project editor: null = the list; "new" or a slug = the editor.
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialForm);
  const [savedForm, setSavedForm] = useState<FormState>(initialForm);

  const notify = useCallback((text: string, tone: "ok" | "error" | "info" = "ok") => setNotice({ text, tone }), []);
  const closeNotice = useCallback(() => setNotice(null), []);
  const fail = (error: unknown, fallback: string) => notify(error instanceof Error ? error.message : fallback, "error");

  async function refreshAll() {
    // Always fresh: it runs on load and after each save, and must show the save just made.
    const content = await getSiteContent({ fresh: true });
    setAvailableProjects(content.projects);
    setAdminProjectSlugs(new Set(content.adminProjectSlugs));
    setAvailableExperience(content.experience);
    setAvailableTestimonials(content.testimonials);
    setResumeUrl(content.resumeUrl || DEFAULT_RESUME_URL);
    setLoaded(true);
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const isDirty = useMemo(() => JSON.stringify(form) !== JSON.stringify(savedForm), [form, savedForm]);

  // Leaving the page with unsaved changes asks first.
  useEffect(() => {
    if (!editing || !isDirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [editing, isDirty]);

  function confirmLeave() {
    return !editing || !isDirty || window.confirm("You have unsaved changes. Leave without saving?");
  }

  function go(next: View) {
    if (!confirmLeave()) return;
    setEditing(null);
    setView(next);
    window.scrollTo({ top: 0 });
  }

  async function upload(file: File): Promise<string | null> {
    if (!file.type.startsWith("image/") && !file.name.endsWith(".svg")) {
      notify("That file is not an image.", "error");
      return null;
    }
    try {
      return await uploadAdminFile(file);
    } catch (error) {
      fail(error, "Could not upload the image.");
      return null;
    }
  }

  async function uploadMany(files: File[]): Promise<string[]> {
    const urls = await Promise.all(files.map((file) => upload(file)));
    return urls.filter((url): url is string => Boolean(url));
  }

  /* ------------------------------------------------------------ projects */

  const homeOrder = useMemo(() => {
    const order = new Map<string, number>();
    homeCases(availableProjects).forEach((c, i) => order.set(c.slug, i + 1));
    return order;
  }, [availableProjects]);

  // by year, newest first, then by title (his ask, 2026-11-03); each row still shows its home position
  const listed = useMemo(
    () =>
      [...availableProjects].sort(
        (a, b) => (Number.parseInt(b.year, 10) || 0) - (Number.parseInt(a.year, 10) || 0) || a.title.localeCompare(b.title),
      ),
    [availableProjects],
  );

  const effectiveSlug = editing && editing !== "new" ? editing : slugify(form.slug.trim() || form.title);

  function openEditor(project?: Project) {
    if (!confirmLeave()) return;
    const next = project ? toForm(project) : initialForm;
    setForm(next);
    setSavedForm(next);
    setEditing(project ? project.slug : "new");
    window.scrollTo({ top: 0 });
  }

  function closeEditor() {
    if (!confirmLeave()) return;
    setEditing(null);
    window.scrollTo({ top: 0 });
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onSaveProject(event?: FormEvent) {
    event?.preventDefault();
    if (!form.title.trim()) {
      notify("Give the project a title first.", "error");
      return;
    }
    if (!effectiveSlug) {
      notify("Could not make a web address from that title.", "error");
      return;
    }
    if (editing === "new" && availableProjects.some((p) => p.slug === effectiveSlug)) {
      notify(`A project already uses /projects/${effectiveSlug}. Change the title or the address.`, "error");
      return;
    }

    const project = toProject(form, effectiveSlug);
    setIsBusy(true);
    try {
      await saveAdminProject(project);
      await refreshAll();
      const next = toForm(project);
      setForm(next);
      setSavedForm(next);
      setEditing(project.slug);
      notify(
        `Saved ${project.title}. ${project.showOnHome ? "It shows on the home page, " : "It is hidden from the home page; it shows on "}The Shelf (/work) and /projects/${project.slug}.`,
      );
    } catch (error) {
      fail(error, "Could not save the project.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDeleteProject(project: Project) {
    const builtIn = BUILT_IN_SLUGS.has(project.slug);
    const question = builtIn
      ? `Undo your edits to "${project.title}" and go back to the built-in version?`
      : `Delete "${project.title}"? Its case-study page goes too. This cannot be undone.`;
    if (!window.confirm(question)) return;

    setIsBusy(true);
    try {
      await deleteAdminProject(project.slug);
      await refreshAll();
      if (editing === project.slug) setEditing(null);
      notify(builtIn ? `${project.title} is back to its built-in version.` : `Deleted ${project.title}.`);
    } catch (error) {
      fail(error, "Could not delete the project.");
    } finally {
      setIsBusy(false);
    }
  }

  /* ---------------------------------------------------------- work history */

  const [experienceForm, setExperienceForm] = useState<ExperienceFormState>(initialExperienceForm);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);

  function openExperience(entry?: Experience) {
    setExperienceForm(
      entry
        ? { when: entry.when, role: entry.role, note: entry.note, order: entry.order?.toString() ?? "" }
        : { ...initialExperienceForm, order: String(availableExperience.length + 1) },
    );
    setEditingExperienceId(entry ? entry.id : "new");
  }

  async function onSaveExperience(event: FormEvent) {
    event.preventDefault();
    if (!experienceForm.role.trim() || !experienceForm.when.trim()) {
      notify("An entry needs a role and its dates.", "error");
      return;
    }
    const entry: Experience = {
      id:
        editingExperienceId && editingExperienceId !== "new"
          ? editingExperienceId
          : slugify(`${experienceForm.role} ${experienceForm.when}`),
      when: experienceForm.when.trim(),
      role: experienceForm.role.trim(),
      note: experienceForm.note.trim(),
      order: experienceForm.order.trim() ? Number(experienceForm.order) : undefined,
    };
    setIsBusy(true);
    try {
      await saveAdminExperience(entry);
      await refreshAll();
      setEditingExperienceId(null);
      notify(`Saved "${entry.role}" to your work history.`);
    } catch (error) {
      fail(error, "Could not save the entry.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDeleteExperience(entry: Experience) {
    if (!window.confirm(`Remove "${entry.role}" from your work history?`)) return;
    setIsBusy(true);
    try {
      await deleteAdminExperience(entry.id);
      await refreshAll();
      setEditingExperienceId(null);
      notify(`Removed "${entry.role}".`);
    } catch (error) {
      fail(error, "Could not remove the entry.");
    } finally {
      setIsBusy(false);
    }
  }

  /* ---------------------------------------------------------- testimonials */

  const [testimonialForm, setTestimonialForm] = useState<TestimonialFormState>(initialTestimonialForm);
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);

  function openTestimonial(entry?: Testimonial) {
    setTestimonialForm(
      entry
        ? { quote: entry.quote, name: entry.name, role: entry.role, photo: entry.photo ?? "", order: entry.order?.toString() ?? "" }
        : { ...initialTestimonialForm, order: String(availableTestimonials.length + 1) },
    );
    setEditingTestimonialId(entry ? entry.id : "new");
  }

  async function onSaveTestimonial(event: FormEvent) {
    event.preventDefault();
    if (!testimonialForm.quote.trim() || !testimonialForm.name.trim()) {
      notify("A testimonial needs the quote and the name of who said it.", "error");
      return;
    }
    const entry: Testimonial = {
      id:
        editingTestimonialId && editingTestimonialId !== "new"
          ? editingTestimonialId
          : slugify(`${testimonialForm.name} ${Date.now().toString(36)}`),
      quote: testimonialForm.quote.trim().replace(/^["\u201c]+|["\u201d]+$/g, ""),
      name: testimonialForm.name.trim(),
      role: testimonialForm.role.trim(),
      photo: testimonialForm.photo.trim() || undefined,
      order: testimonialForm.order.trim() ? Number(testimonialForm.order) : undefined,
    };
    setIsBusy(true);
    try {
      await saveAdminTestimonial(entry);
      await refreshAll();
      setEditingTestimonialId(null);
      notify(`Saved ${entry.name}'s testimonial. It shows on the home page under "What people say".`);
    } catch (error) {
      fail(error, "Could not save the testimonial.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDeleteTestimonial(entry: Testimonial) {
    if (!window.confirm(`Remove ${entry.name}'s testimonial?`)) return;
    setIsBusy(true);
    try {
      await deleteAdminTestimonial(entry.id);
      await refreshAll();
      setEditingTestimonialId(null);
      notify(`Removed ${entry.name}'s testimonial.`);
    } catch (error) {
      fail(error, "Could not remove the testimonial.");
    } finally {
      setIsBusy(false);
    }
  }

  /* ---------------------------------------------------------------- résumé */

  const [resumeLink, setResumeLink] = useState("");

  async function onResumeUpload(file?: File) {
    if (!file) return;
    if (!(file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"))) {
      notify("The résumé has to be a PDF.", "error");
      return;
    }
    setIsBusy(true);
    try {
      const url = await uploadAdminFile(file);
      await saveAdminResume(url);
      setResumeUrl(url);
      notify("Résumé replaced. Every résumé button on the site now opens it.");
    } catch (error) {
      fail(error, "Could not upload the résumé.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onResumeLink() {
    const value = resumeLink.trim();
    if (!value) return;
    setIsBusy(true);
    try {
      await saveAdminResume(value);
      setResumeUrl(value);
      setResumeLink("");
      notify("Résumé link saved.");
    } catch (error) {
      fail(error, "Could not save the link.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onResetResume() {
    if (!window.confirm("Go back to the built-in résumé (resume.pdf)?")) return;
    setIsBusy(true);
    try {
      await deleteAdminResume();
      setResumeUrl(DEFAULT_RESUME_URL);
      notify("Back to the built-in résumé.");
    } catch (error) {
      fail(error, "Could not reset the résumé.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onLogout() {
    if (!confirmLeave()) return;
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  /* ----------------------------------------------------------------- shell */

  const nav: { id: View; label: string; icon: ReactNode; count?: number }[] = [
    { id: "projects", label: "Projects", icon: <LayoutGrid className="h-4 w-4" />, count: availableProjects.length },
    { id: "history", label: "Work history", icon: <Briefcase className="h-4 w-4" />, count: availableExperience.length },
    { id: "testimonials", label: "Testimonials", icon: <Quote className="h-4 w-4" />, count: availableTestimonials.length },
    { id: "resume", label: "Résumé", icon: <FileText className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-bg text-text lg:grid lg:grid-cols-[240px_1fr]">
      {/* side menu (wide screens) */}
      <aside className="sticky top-0 hidden h-screen flex-col border-r border-border px-5 py-7 lg:flex">
        <Link href="/" className="inline-flex items-center gap-2.5 px-2 text-[13px] font-bold uppercase tracking-[0.16em]">
          <LogoMark className="h-[18px] w-[18px]" />
          Jethro Adebisi
        </Link>
        <p className="mt-1 px-2 text-[12px] text-text-tertiary">Site admin</p>
        <nav className="mt-10 space-y-0.5" aria-label="Admin">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              aria-current={view === item.id ? "page" : undefined}
              className={`relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px] transition-colors ${
                view === item.id ? "bg-ink/[0.06] font-semibold" : "text-text-secondary hover:bg-ink/[0.04] hover:text-text"
              }`}
            >
              {view === item.id ? <span className="absolute inset-y-0 left-0 w-[3px] bg-accent" /> : null}
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.count !== undefined && loaded ? (
                <span className="text-[12px] tabular-nums text-text-tertiary">{item.count}</span>
              ) : null}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-0.5 border-t border-border pt-4">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 px-3 py-2.5 text-[14px] text-text-secondary transition-colors hover:bg-ink/[0.04] hover:text-text"
          >
            <ArrowUpRight className="h-4 w-4" /> View site
          </a>
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 px-3 py-2.5 text-left text-[14px] text-text-secondary transition-colors hover:bg-ink/[0.04] hover:text-text"
          >
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </aside>

      {/* top bar (phones and tablets) */}
      <header className="sticky top-0 z-30 border-b border-border bg-bg/95 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 pt-4">
          <Link href="/" className="inline-flex items-center gap-2 text-[12px] font-bold uppercase tracking-[0.16em]">
            <LogoMark className="h-4 w-4" />
            Jethro Adebisi <span className="font-medium normal-case tracking-normal text-text-tertiary">· admin</span>
          </Link>
          <button type="button" onClick={onLogout} aria-label="Log out" className="flex h-10 w-10 items-center justify-center">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 pt-2" aria-label="Admin">
          {nav.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => go(item.id)}
              className={`flex shrink-0 items-center gap-2 px-3 py-2 text-[13px] ${
                view === item.id ? "bg-ink text-bg" : "text-text-secondary"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="min-w-0 px-5 pb-28 pt-8 sm:px-8 lg:px-14 lg:pt-12">
        <div className="mx-auto max-w-[1040px]">
          {view === "projects" && !editing ? (
            <ProjectList
              loaded={loaded}
              projects={listed}
              homeOrder={homeOrder}
              adminSlugs={adminProjectSlugs}
              busy={isBusy}
              onNew={() => openEditor()}
              onEdit={openEditor}
              onDelete={onDeleteProject}
            />
          ) : null}

          {view === "projects" && editing ? (
            <ProjectEditor
              form={form}
              set={set}
              isNew={editing === "new"}
              slug={effectiveSlug}
              dirty={isDirty}
              busy={isBusy}
              onBack={closeEditor}
              onSave={onSaveProject}
              upload={upload}
              uploadMany={uploadMany}
            />
          ) : null}

          {view === "history" ? (
            <HistoryView
              entries={availableExperience}
              loaded={loaded}
              editingId={editingExperienceId}
              form={experienceForm}
              setForm={setExperienceForm}
              busy={isBusy}
              onAdd={() => openExperience()}
              onEdit={openExperience}
              onCancel={() => setEditingExperienceId(null)}
              onSave={onSaveExperience}
              onDelete={onDeleteExperience}
            />
          ) : null}

          {view === "testimonials" ? (
            <TestimonialsView
              entries={availableTestimonials}
              loaded={loaded}
              editingId={editingTestimonialId}
              form={testimonialForm}
              setForm={setTestimonialForm}
              busy={isBusy}
              upload={upload}
              onAdd={() => openTestimonial()}
              onEdit={openTestimonial}
              onCancel={() => setEditingTestimonialId(null)}
              onSave={onSaveTestimonial}
              onDelete={onDeleteTestimonial}
            />
          ) : null}

          {view === "resume" ? (
            <ResumeView
              url={resumeUrl}
              link={resumeLink}
              setLink={setResumeLink}
              busy={isBusy}
              onUpload={onResumeUpload}
              onSaveLink={onResumeLink}
              onReset={onResetResume}
            />
          ) : null}
        </div>
      </main>

      <Toast notice={notice} onClose={closeNotice} />
    </div>
  );
}

/* ----------------------------------------------------------------- views */

function PageHeader({ title, description, action }: { title: string; description: ReactNode; action?: ReactNode }) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-[32px] font-black leading-none tracking-[-0.035em] sm:text-[40px]">{title}</h1>
        <p className="mt-3 max-w-[560px] text-[14px] leading-[1.6] text-text-secondary">{description}</p>
      </div>
      {action}
    </header>
  );
}

function ProjectList({
  loaded,
  projects: items,
  homeOrder,
  adminSlugs,
  busy,
  onNew,
  onEdit,
  onDelete,
}: {
  loaded: boolean;
  projects: Project[];
  homeOrder: Map<string, number>;
  adminSlugs: Set<string>;
  busy: boolean;
  onNew: () => void;
  onEdit: (project: Project) => void;
  onDelete: (project: Project) => void;
}) {
  const shown = items.filter((p) => homeOrder.has(p.slug)).length;
  return (
    <>
      <PageHeader
        title="Projects"
        description={
          <>
            Every project has its own case-study page and a card on The Shelf (/work). {shown ? `${shown} of them show` : "None show"}{" "}
            on the home page; the list runs newest first.
          </>
        }
        action={
          <Button tone="primary" onClick={onNew}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        }
      />

      <div className="mt-10 border-t border-border">
        {!loaded
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-5 border-b border-border py-4">
                <div className="h-[60px] w-[96px] animate-pulse bg-ink/[0.05]" />
                <div className="h-4 w-48 animate-pulse bg-ink/[0.05]" />
              </div>
            ))
          : items.map((project) => {
              const position = homeOrder.get(project.slug);
              const edited = adminSlugs.has(project.slug);
              const builtIn = BUILT_IN_SLUGS.has(project.slug);
              const thumb = project.cover || project.image;
              return (
                <div
                  key={project.slug}
                  className="group grid grid-cols-[72px_1fr_auto] items-center gap-4 border-b border-border py-4 sm:grid-cols-[96px_1fr_auto] sm:gap-5"
                >
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    className="aspect-[16/10] overflow-hidden border border-border"
                    style={{ background: project.coverBg || undefined }}
                    aria-label={`Edit ${project.title}`}
                  >
                    {thumb ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" />
                    ) : null}
                  </button>

                  <button type="button" onClick={() => onEdit(project)} className="min-w-0 text-left">
                    <span className="block truncate text-[15px] font-semibold tracking-[-0.01em] group-hover:underline">
                      {project.title}
                    </span>
                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-text-tertiary">
                      <span>
                        {project.category === "design" ? "Design" : "Engineering"} · {project.year}
                      </span>
                      {position ? (
                        <span className="inline-flex items-center gap-1.5 font-medium text-text">
                          <span className="h-1.5 w-1.5 rounded-full bg-accent-ink" /> Home #{position}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5">
                          <span className="h-1.5 w-1.5 rounded-full bg-ink/25" /> Hidden from home
                        </span>
                      )}
                      {edited && builtIn ? <span>Edited</span> : null}
                    </span>
                  </button>

                  <div className="flex items-center gap-0.5">
                    <Button tone="ghost" onClick={() => onEdit(project)} className="!px-3" aria-label={`Edit ${project.title}`}>
                      <Pencil className="h-4 w-4" />
                      <span className="hidden md:inline">Edit</span>
                    </Button>
                    <a
                      href={`/projects/${project.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`Open ${project.title}`}
                      className="inline-flex min-h-[40px] items-center gap-2 px-3 text-[13px] font-semibold text-text-secondary transition-colors hover:bg-ink/[0.05] hover:text-text"
                    >
                      <ExternalLink className="h-4 w-4" />
                      <span className="hidden md:inline">View</span>
                    </a>
                    {edited ? (
                      <Button
                        tone="danger"
                        disabled={busy}
                        onClick={() => onDelete(project)}
                        className="!px-3"
                        aria-label={builtIn ? `Undo edits to ${project.title}` : `Delete ${project.title}`}
                        title={builtIn ? "Undo your edits" : "Delete"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    ) : (
                      <span className="w-[40px]" aria-hidden />
                    )}
                  </div>
                </div>
              );
            })}
      </div>
      <p className="mt-4 text-[12px] leading-[1.6] text-text-tertiary">
        Built-in projects can be edited and hidden but not deleted; deleting your edits to one puts it back as it was.
      </p>
    </>
  );
}

function ProjectEditor({
  form,
  set,
  isNew,
  slug,
  dirty,
  busy,
  onBack,
  onSave,
  upload,
  uploadMany,
}: {
  form: FormState;
  set: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  isNew: boolean;
  slug: string;
  dirty: boolean;
  busy: boolean;
  onBack: () => void;
  onSave: (event?: FormEvent) => void;
  upload: (file: File) => Promise<string | null>;
  uploadMany: (files: File[]) => Promise<string[]>;
}) {
  const text = (key: keyof FormState) => ({
    value: form[key] as string,
    onChange: (e: { target: { value: string } }) => set(key, e.target.value as never),
  });

  // The home panel exactly as the home page would draw it, blanks filled the same way.
  const preview = homeCases([{ ...toProject(form, slug || "preview"), showOnHome: true }])[0];

  return (
    <form onSubmit={onSave}>
      {/* the bar that stays on screen */}
      <div className="sticky top-[97px] z-20 -mx-5 flex items-center justify-between gap-3 border-b border-border bg-bg/95 px-5 py-3 backdrop-blur sm:-mx-8 sm:px-8 lg:top-0 lg:mx-0 lg:px-0">
        <button type="button" onClick={onBack} className="inline-flex min-h-[40px] items-center gap-2 text-[13px] font-semibold text-text-secondary hover:text-text">
          <ArrowLeft className="h-4 w-4" /> <span className="hidden sm:inline">All projects</span>
          <span className="sm:hidden">Back</span>
        </button>
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden text-[12px] text-text-tertiary sm:inline">
            {dirty ? "Unsaved changes" : isNew ? "Not saved yet" : "All changes saved"}
          </span>
          {!isNew ? (
            <a
              href={`/projects/${slug}`}
              target="_blank"
              rel="noreferrer"
              aria-label="View the case-study page"
              className="inline-flex min-h-[40px] items-center gap-2 border border-border bg-white px-3 text-[13px] font-semibold transition-colors hover:border-ink sm:px-4"
            >
              <span className="hidden sm:inline">View page</span> <ExternalLink className="h-3.5 w-3.5" />
            </a>
          ) : null}
          <Button tone="primary" type="submit" busy={busy} disabled={!dirty && !isNew}>
            {isNew ? "Create project" : "Save changes"}
          </Button>
        </div>
      </div>

      <div className="pt-10">
        <p className="label">{isNew ? "New project" : "Editing"}</p>
        <h1 className="mt-3 text-[32px] font-black leading-[1.05] tracking-[-0.035em] sm:text-[40px]">
          {form.title.trim() || "Untitled project"}
        </h1>
        <p className="mt-2 text-[13px] text-text-tertiary">
          jethrotheuxpert.vercel.app/projects/<span className="font-medium text-text">{slug || "…"}</span>
        </p>
      </div>

      <div className="mt-8">
        <FormSection title="Basics" description="The title, address and short facts used on every card and page.">
          <Field label="Title">
            <TextInput {...text("title")} placeholder="SabiBank - Personal Finance Management App" required />
          </Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Year">
              <TextInput {...text("year")} placeholder="2026" />
            </Field>
            <Field label="Type">
              <select
                value={form.category}
                onChange={(e) => set("category", e.target.value as FormState["category"])}
                className="w-full border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-ink"
              >
                <option value="design">Design</option>
                <option value="engineering">Engineering</option>
              </select>
            </Field>
            <Field label="Address" hint={isNew ? undefined : "Fixed once saved"}>
              <TextInput {...text("slug")} placeholder={slug || "made-from-the-title"} disabled={!isNew} />
            </Field>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Your role">
              <TextInput {...text("role")} placeholder="UX designer, researcher" />
            </Field>
            <Field label="Tools" hint="Separate with commas">
              <TextInput {...text("tech")} placeholder="Figma, React, Next.js" />
            </Field>
          </div>
          <Field label="Live link" hint="Optional: the live site or prototype">
            <TextInput {...text("projectLink")} placeholder="https://" />
          </Field>
        </FormSection>

        <FormSection
          id="home"
          title="Home page"
          description="How it shows in Selected work. Leave a field blank and the project's own title, year, description or thumbnail is used."
        >
          <Toggle
            checked={form.showOnHome}
            onChange={(v) => set("showOnHome", v)}
            label="Show on the home page"
            description={form.showOnHome ? "Shown in Selected work" : "Hidden: The Shelf and its own page only"}
          />
          {form.showOnHome ? (
            <>
              <div className="border border-border p-3" style={{ background: "rgb(var(--ink-rgb) / 0.02)" }}>
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-text-tertiary">Preview</p>
                <div className="flex gap-4 p-4" style={{ background: preview.bg }}>
                  <div className="aspect-[16/10] w-[44%] shrink-0 overflow-hidden border border-black/10 bg-black/[0.05]">
                    {preview.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={preview.image} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className={`min-w-0 self-center ${preview.dark ? "text-white" : "text-black"}`}>
                    <p className={`text-[10px] font-semibold uppercase tracking-[0.16em] ${preview.dark ? "text-white/70" : "text-black/70"}`}>
                      {preview.meta}
                    </p>
                    <p className="mt-2 text-[18px] font-bold leading-tight tracking-[-0.02em] [overflow-wrap:anywhere]">
                      {preview.title || "Untitled"}
                    </p>
                    <p className={`mt-2 line-clamp-3 text-[12px] leading-[1.55] ${preview.dark ? "text-white/75" : "text-black/70"}`}>
                      {preview.line}
                    </p>
                  </div>
                </div>
              </div>
              <div className="grid gap-5 sm:grid-cols-[1fr_160px]">
                <Field label="Short title" hint="On the spine">
                  <TextInput {...text("homeTitle")} placeholder={form.title || "SabiBank"} />
                </Field>
                <Field label="Position" hint="1 is first and opens first">
                  <TextInput
                    value={form.homeOrder}
                    onChange={(e) => set("homeOrder", e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    placeholder="Last"
                  />
                </Field>
              </div>
              <Field label="Small line above the title">
                <TextInput {...text("homeMeta")} placeholder="Fintech · 2024" />
              </Field>
              <Field label="What it is, in a sentence or two">
                <TextArea {...text("homeLine")} rows={3} placeholder="Blank uses the first sentence of the description" />
              </Field>
              <ImageField
                label="Cover image"
                hint="16:10 works best. Blank uses the thumbnail."
                value={form.cover}
                onChange={(v) => set("cover", v)}
                onUpload={upload}
              />
              <div className="grid gap-5 sm:grid-cols-2">
                <Field label="Panel colour">
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={/^#[0-9a-f]{6}$/i.test(form.coverBg) ? form.coverBg : "#e7e5e0"}
                      onChange={(e) => set("coverBg", e.target.value)}
                      className="h-[42px] w-12 shrink-0 cursor-pointer border border-border bg-white p-1"
                      aria-label="Pick the panel colour"
                    />
                    <TextInput {...text("coverBg")} placeholder="#DDE7FB" />
                  </div>
                </Field>
                <Field label="Text colour on the panel">
                  <div className="grid grid-cols-2 border border-border bg-white p-1">
                    {[
                      { dark: false, label: "Black" },
                      { dark: true, label: "White" },
                    ].map((o) => (
                      <button
                        key={o.label}
                        type="button"
                        onClick={() => set("coverDark", o.dark)}
                        aria-pressed={form.coverDark === o.dark}
                        className={`min-h-[34px] text-[13px] font-semibold ${form.coverDark === o.dark ? "bg-ink text-bg" : "text-text-secondary"}`}
                      >
                        {o.label}
                      </button>
                    ))}
                  </div>
                </Field>
              </div>
            </>
          ) : null}
        </FormSection>

        <FormSection title="Images" description="The thumbnail is used on cards; the hero sits at the top of the case study.">
          <ImageField label="Thumbnail" value={form.image} onChange={(v) => set("image", v)} onUpload={upload} />
          <ImageField
            label="Case-study hero"
            hint="Blank uses the thumbnail"
            value={form.caseStudyImage}
            onChange={(v) => set("caseStudyImage", v)}
            onUpload={upload}
          />
          <GalleryField value={form.caseStudyGallery} onChange={(v) => set("caseStudyGallery", v)} onUploadMany={uploadMany} />
        </FormSection>

        <FormSection title="Overview" description="The top of the case study: what it is, the problem, and what you did about it.">
          <Field label="Description" hint="Its first sentence is also the home-page line when that is blank">
            <TextArea {...text("description")} rows={4} />
          </Field>
          <Field label="The problem">
            <TextArea {...text("problem")} rows={4} />
          </Field>
          <Field label="The solution">
            <TextArea {...text("solution")} rows={4} />
          </Field>
        </FormSection>

        <FormSection title="Context" description="Background, goals and who it was for.">
          <Field label="Context">
            <TextArea {...text("context")} />
          </Field>
          <Field label="Goals">
            <TextArea {...text("objectives")} />
          </Field>
          <Field label="Audience">
            <TextArea {...text("audience")} />
          </Field>
        </FormSection>

        <FormSection title="Process and research" description="How you worked and what you found.">
          <Field label="Process">
            <TextArea {...text("process")} rows={5} />
          </Field>
          <Field label="Research findings" hint="Shown as a pull quote">
            <TextArea {...text("researchInsights")} />
          </Field>
          <Field label="Structure and flows">
            <TextArea {...text("informationArchitecture")} />
          </Field>
        </FormSection>

        <FormSection title="Design" description="From wireframes to the tested design.">
          <Field label="Wireframes and iterations">
            <TextArea {...text("wireframes")} />
          </Field>
          <Field label="Visual design">
            <TextArea {...text("visualDesign")} />
          </Field>
          <Field label="Prototype and testing">
            <TextArea {...text("prototypeTesting")} />
          </Field>
        </FormSection>

        <FormSection title="Results" description="What changed, what you learned, what comes next.">
          <Field label="Outcome" hint="The first sentence also fills 'The outcome' in the case study's summary">
            <TextArea {...text("outcomes")} />
          </Field>
          <Field label="What you learned" hint="Shown as a pull quote">
            <TextArea {...text("learnings")} />
          </Field>
          <Field label="Next steps">
            <TextArea {...text("nextSteps")} />
          </Field>
        </FormSection>

        <FormSection title="Long write-up" description="Optional. Shown at the end of the case study only when filled.">
          <Field label="Full story">
            <TextArea {...text("caseStudy")} rows={8} />
          </Field>
        </FormSection>
      </div>

      <div className="flex flex-wrap items-center justify-end gap-3 border-t border-border pt-6">
        <Button tone="ghost" onClick={onBack}>
          Cancel
        </Button>
        <Button tone="primary" type="submit" busy={busy} disabled={!dirty && !isNew}>
          {isNew ? "Create project" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}

function HistoryView({
  entries,
  loaded,
  editingId,
  form,
  setForm,
  busy,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  entries: Experience[];
  loaded: boolean;
  editingId: string | null;
  form: ExperienceFormState;
  setForm: (next: ExperienceFormState) => void;
  busy: boolean;
  onAdd: () => void;
  onEdit: (entry: Experience) => void;
  onCancel: () => void;
  onSave: (event: FormEvent) => void;
  onDelete: (entry: Experience) => void;
}) {
  const editor = (
    <form onSubmit={onSave} className="space-y-5 border border-ink bg-white p-5 sm:p-6">
      <Field label="Role, and where">
        <TextInput
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          placeholder="Designer, GDG UNILAG, Lagos"
          required
          autoFocus
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-[1fr_140px]">
        <Field label="When">
          <TextInput value={form.when} onChange={(e) => setForm({ ...form, when: e.target.value })} placeholder="2023 to now" required />
        </Field>
        <Field label="Position" hint="1 is the top">
          <TextInput
            value={form.order}
            onChange={(e) => setForm({ ...form, order: e.target.value.replace(/[^0-9]/g, "") })}
            inputMode="numeric"
          />
        </Field>
      </div>
      <Field label="One line on what you did">
        <TextArea value={form.note} onChange={(e) => setForm({ ...form, note: e.target.value })} rows={2} />
      </Field>
      <div className="flex justify-end gap-2">
        <Button tone="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button tone="primary" type="submit" busy={busy}>
          {editingId === "new" ? "Add entry" : "Save entry"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader
        title="Work history"
        description="The dated list under About on the home page, top to bottom. The first entry is highlighted."
        action={
          <Button tone="primary" onClick={onAdd} disabled={editingId === "new"}>
            <Plus className="h-4 w-4" /> Add entry
          </Button>
        }
      />
      <div className="mt-10">
        {editingId === "new" ? <div className="mb-6">{editor}</div> : null}
        <ol className="border-t border-border">
          {!loaded ? (
            <li className="h-20 animate-pulse border-b border-border bg-ink/[0.03]" />
          ) : entries.length === 0 ? (
            <li className="border-b border-border py-10 text-center text-[14px] text-text-tertiary">No entries yet.</li>
          ) : (
            entries.map((entry, i) =>
              editingId === entry.id ? (
                <li key={entry.id} className="py-4">
                  {editor}
                </li>
              ) : (
                <li key={entry.id} className="group grid gap-2 border-b border-border py-5 sm:grid-cols-[130px_1fr_auto] sm:gap-6">
                  <p className="text-[13px] font-medium text-text-tertiary sm:pt-0.5">{entry.when}</p>
                  <div className="min-w-0">
                    <p className={`text-[16px] font-semibold tracking-[-0.01em] ${i === 0 ? "text-accent-ink" : ""}`}>{entry.role}</p>
                    {entry.note ? <p className="mt-1 text-[14px] leading-[1.6] text-text-secondary">{entry.note}</p> : null}
                  </div>
                  <div className="flex items-start gap-0.5">
                    <Button tone="ghost" onClick={() => onEdit(entry)} className="!px-3">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button tone="danger" disabled={busy} onClick={() => onDelete(entry)} className="!px-3" aria-label={`Remove ${entry.role}`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ),
            )
          )}
        </ol>
      </div>
    </>
  );
}

function TestimonialsView({
  entries,
  loaded,
  editingId,
  form,
  setForm,
  busy,
  upload,
  onAdd,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  entries: Testimonial[];
  loaded: boolean;
  editingId: string | null;
  form: TestimonialFormState;
  setForm: (next: TestimonialFormState) => void;
  busy: boolean;
  upload: (file: File) => Promise<string | null>;
  onAdd: () => void;
  onEdit: (entry: Testimonial) => void;
  onCancel: () => void;
  onSave: (event: FormEvent) => void;
  onDelete: (entry: Testimonial) => void;
}) {
  const editor = (
    <form onSubmit={onSave} className="space-y-5 border border-ink bg-white p-5 sm:p-6">
      <Field label="What they said" hint="Their words, as they wrote them. Quotation marks are added for you.">
        <TextArea
          value={form.quote}
          onChange={(e) => setForm({ ...form, quote: e.target.value })}
          rows={4}
          placeholder="Jethro took our idea from a sketch to a tested prototype in three weeks..."
          required
          autoFocus
        />
      </Field>
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Name" hint="Required">
          <TextInput value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" required />
        </Field>
        <Field label="Role and where" hint="Optional">
          <TextInput value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} placeholder="Founder, Company" />
        </Field>
      </div>
      <ImageField
        label="Photo"
        hint="Optional. A square headshot works best."
        value={form.photo}
        onChange={(v) => setForm({ ...form, photo: v })}
        onUpload={upload}
        aspect="aspect-square"
      />
      <Field label="Position" hint="1 is first">
        <TextInput
          value={form.order}
          onChange={(e) => setForm({ ...form, order: e.target.value.replace(/[^0-9]/g, "") })}
          inputMode="numeric"
          className="max-w-[140px]"
        />
      </Field>
      <div className="flex justify-end gap-2">
        <Button tone="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button tone="primary" type="submit" busy={busy}>
          {editingId === "new" ? "Add testimonial" : "Save testimonial"}
        </Button>
      </div>
    </form>
  );

  return (
    <>
      <PageHeader
        title="Testimonials"
        description="What people you have worked with say, in their own words and with their permission. The home page shows a What people say section as soon as there is one."
        action={
          <Button tone="primary" onClick={onAdd} disabled={editingId === "new"}>
            <Plus className="h-4 w-4" /> Add testimonial
          </Button>
        }
      />
      <div className="mt-10">
        {editingId === "new" ? <div className="mb-6">{editor}</div> : null}
        <ol className="border-t border-border">
          {!loaded ? (
            <li className="h-20 animate-pulse border-b border-border bg-ink/[0.03]" />
          ) : entries.length === 0 ? (
            editingId === "new" ? null : (
              <li className="border-b border-border py-12 text-center">
                <p className="text-[15px] font-semibold">No testimonials yet</p>
                <p className="mx-auto mt-1 max-w-[380px] text-[13px] leading-[1.6] text-text-tertiary">
                  The section stays hidden on the home page until you add the first one.
                </p>
              </li>
            )
          ) : (
            entries.map((entry) =>
              editingId === entry.id ? (
                <li key={entry.id} className="py-4">
                  {editor}
                </li>
              ) : (
                <li key={entry.id} className="grid gap-4 border-b border-border py-5 sm:grid-cols-[1fr_auto] sm:gap-6">
                  <div className="flex min-w-0 gap-4">
                    {entry.photo ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={entry.photo} alt="" className="h-11 w-11 shrink-0 rounded-full object-cover" />
                    ) : (
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/[0.06] text-[14px] font-semibold">
                        {entry.name.charAt(0)}
                      </span>
                    )}
                    <div className="min-w-0">
                      <p className="line-clamp-2 text-[15px] leading-[1.55]">&ldquo;{entry.quote}&rdquo;</p>
                      <p className="mt-1.5 text-[13px] text-text-tertiary">
                        <span className="font-semibold text-text">{entry.name}</span>
                        {entry.role ? ` · ${entry.role}` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-0.5">
                    <Button tone="ghost" onClick={() => onEdit(entry)} className="!px-3">
                      <Pencil className="h-4 w-4" /> Edit
                    </Button>
                    <Button tone="danger" disabled={busy} onClick={() => onDelete(entry)} className="!px-3" aria-label={`Remove ${entry.name}'s testimonial`}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              ),
            )
          )}
        </ol>
      </div>
    </>
  );
}

function ResumeView({
  url,
  link,
  setLink,
  busy,
  onUpload,
  onSaveLink,
  onReset,
}: {
  url: string;
  link: string;
  setLink: (value: string) => void;
  busy: boolean;
  onUpload: (file?: File) => void;
  onSaveLink: () => void;
  onReset: () => void;
}) {
  const builtIn = !url || url === DEFAULT_RESUME_URL;
  return (
    <>
      <PageHeader title="Résumé" description="The PDF every résumé button on the site opens, in a new tab." />
      <div className="mt-10 border border-border bg-white">
        <div className="flex flex-col gap-5 p-6 sm:flex-row sm:items-center">
          <div className="flex h-16 w-14 shrink-0 items-center justify-center border border-border bg-bg text-[11px] font-bold tracking-[0.08em]">
            PDF
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold">{fileName(url)}</p>
            <p className="mt-1 text-[13px] text-text-tertiary">{builtIn ? "The file that ships with the site" : "Uploaded through the admin"}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <a
              href={url || DEFAULT_RESUME_URL}
              target="_blank"
              rel="noreferrer"
              className="inline-flex min-h-[40px] items-center gap-2 border border-border px-4 text-[13px] font-semibold transition-colors hover:border-ink"
            >
              Open <ExternalLink className="h-3.5 w-3.5" />
            </a>
            <label className={`inline-flex min-h-[40px] cursor-pointer items-center gap-2 bg-ink px-4 text-[13px] font-semibold text-bg transition-colors hover:bg-ink/85 ${busy ? "pointer-events-none opacity-50" : ""}`}>
              <Upload className="h-4 w-4" /> Replace PDF
              <input
                type="file"
                accept="application/pdf,.pdf"
                className="sr-only"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  onUpload(file);
                }}
              />
            </label>
          </div>
        </div>
        <div className="grid gap-5 border-t border-border p-6 sm:grid-cols-[1fr_auto] sm:items-end">
          <Field label="Or use a link" hint="A PDF hosted somewhere else, such as Google Drive">
            <TextInput value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://" />
          </Field>
          <Button onClick={onSaveLink} disabled={!link.trim()} busy={busy}>
            Save link
          </Button>
        </div>
      </div>
      {!builtIn ? (
        <Button tone="ghost" onClick={onReset} disabled={busy} className="mt-4">
          Go back to the built-in résumé
        </Button>
      ) : null}
    </>
  );
}

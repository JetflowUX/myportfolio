"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { CursorFollower } from "@/components/cursor-follower";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { projects, type Experience, type Project } from "@/lib/data";
import {
  deleteAdminExperience,
  deleteAdminProject,
  deleteAdminResume,
  getSiteContent,
  saveAdminExperience,
  saveAdminProject,
  saveAdminResume,
  slugify,
  uploadAdminFile,
} from "@/lib/project-store";

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
  caseStudyGallery: string;
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

type ExperienceFormState = {
  when: string;
  role: string;
  note: string;
  order: string;
};

const initialForm: FormState = {
  title: "",
  slug: "",
  year: new Date().getFullYear().toString(),
  category: "engineering",
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
  caseStudyGallery: "",
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

const initialExperienceForm: ExperienceFormState = {
  when: "",
  role: "",
  note: "",
  order: "",
};

const DEFAULT_RESUME_URL = "/resume.pdf";

export function AdminDashboard() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialForm);
  const [availableProjects, setAvailableProjects] = useState<Project[]>([]);
  const [adminProjectSlugs, setAdminProjectSlugs] = useState<Set<string>>(
    new Set(),
  );
  const [status, setStatus] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [experienceForm, setExperienceForm] =
    useState<ExperienceFormState>(initialExperienceForm);
  const [availableExperience, setAvailableExperience] = useState<Experience[]>([]);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  const [isExperienceFormOpen, setIsExperienceFormOpen] = useState(false);
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);
  const [isBusy, setIsBusy] = useState(false);

  const baseProjectSlugs = useMemo(
    () => new Set(projects.map((item) => item.slug)),
    [],
  );

  async function refreshAll() {
    // Always fresh — this only runs a handful of times per admin session
    // (on mount, and right after each save/delete), so bypassing the
    // public cache here costs nothing and guarantees the dashboard shows
    // its own edits immediately instead of possibly-stale cached data.
    const content = await getSiteContent({ fresh: true });
    setAvailableProjects(content.projects);
    setAdminProjectSlugs(new Set(content.adminProjectSlugs));
    setAvailableExperience(content.experience);
    setResumeUrl(content.resumeUrl || DEFAULT_RESUME_URL);
  }

  useEffect(() => {
    refreshAll();
  }, []);

  const liveSlug = useMemo(() => {
    if (form.slug.trim()) {
      return slugify(form.slug);
    }
    return slugify(form.title);
  }, [form.slug, form.title]);

  // When editing an existing project, keep its ORIGINAL slug no matter what
  // the title/slug fields say. Otherwise a title that doesn't slugify back to
  // the same slug (every default project except backup-line / speed-math-
  // battle) saves a brand-new overlay entry at a different slug instead of
  // overriding the project being edited — so the edit never shows up.
  const effectiveSlug = editingSlug ?? liveSlug;

  // A new entry's id comes from its role and dates; an edited one keeps its own.
  const experienceId =
    editingExperienceId ?? slugify(`${experienceForm.role} ${experienceForm.when}`);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onExperienceChange<K extends keyof ExperienceFormState>(
    key: K,
    value: ExperienceFormState[K],
  ) {
    setExperienceForm((prev) => ({ ...prev, [key]: value }));
  }

  async function onProjectImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    field: "image" | "caseStudyImage" | "cover",
  ) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Please upload an image file.");
      return;
    }

    setIsBusy(true);
    setStatus("Uploading image…");
    try {
      const url = await uploadAdminFile(file);
      setForm((prev) => ({ ...prev, [field]: url }));
      setStatus(
        field === "image"
          ? "Uploaded project thumbnail image."
          : field === "cover"
            ? "Uploaded home page cover image."
            : "Uploaded case study hero image.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not upload the selected image.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function onProjectGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      setStatus("Please select image files for the project gallery.");
      return;
    }

    setIsBusy(true);
    setStatus(`Uploading ${imageFiles.length} image(s)…`);
    try {
      const images = await Promise.all(imageFiles.map((file) => uploadAdminFile(file)));
      setForm((prev) => {
        const existing = prev.caseStudyGallery
          .split(/\n|,/)
          .map((item) => item.trim())
          .filter(Boolean);
        const merged = [...existing, ...images];
        return { ...prev, caseStudyGallery: merged.join("\n") };
      });
      setStatus(`Added ${images.length} image(s) to project gallery.`);
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not upload one or more gallery images.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function onResumeUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) {
      return;
    }

    const isPdf = file.type === "application/pdf" || file.name.endsWith(".pdf");
    if (!isPdf) {
      setStatus("Please upload a PDF file for the resume.");
      return;
    }

    setIsBusy(true);
    setStatus("Uploading resume…");
    try {
      const url = await uploadAdminFile(file);
      await saveAdminResume(url);
      setResumeUrl(url);
      setStatus(
        "Uploaded resume PDF. The homepage button now opens this file.",
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : "Could not upload the selected resume PDF.",
      );
    } finally {
      setIsBusy(false);
    }
  }

  async function onResetResume() {
    setIsBusy(true);
    try {
      await deleteAdminResume();
      setResumeUrl(DEFAULT_RESUME_URL);
      setStatus("Resume reset to the default PDF.");
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not reset the resume link.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus("Title is required.");
      return;
    }

    if (!effectiveSlug) {
      setStatus("Slug could not be generated.");
      return;
    }

    const project: Project = {
      slug: effectiveSlug,
      title: form.title.trim(),
      year: form.year.trim() || new Date().getFullYear().toString(),
      description:
        form.description.trim() || "No short description provided yet.",
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
      // Blank stays blank — no hardcoded stock-photo fallback, so a cleared
      // image genuinely clears. caseStudyImage still defaults to the
      // thumbnail when only the thumbnail is provided.
      image: form.image.trim(),
      caseStudyImage: form.caseStudyImage.trim() || form.image.trim(),
      caseStudyGallery: form.caseStudyGallery
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean),
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

    setIsBusy(true);
    try {
      await saveAdminProject(project);
      await refreshAll();
      const action = editingSlug ? "Updated" : "Saved";
      setEditingSlug(null);
      setForm(initialForm);
      setIsFormOpen(false);
      setStatus(
        `${action} ${project.title}. ${
          project.showOnHome ? "Shown on the home page, the archive" : "Shown on the archive"
        } and its case-study page: /projects/${project.slug}`,
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save project.");
    } finally {
      setIsBusy(false);
    }
  }

  function onEdit(project: Project) {
    setForm({
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
      caseStudyGallery: (project.caseStudyGallery ?? []).join("\n"),
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
    });
    setEditingSlug(project.slug);
    setIsFormOpen(true);
    setStatus(`Editing ${project.title}`);
  }

  function onCreateNew() {
    setForm(initialForm);
    setEditingSlug(null);
    setIsFormOpen(true);
    setStatus("Creating a new project entry.");
  }

  function onResetForm() {
    setForm(initialForm);
    setEditingSlug(null);
    setIsFormOpen(false);
    setStatus("Form cleared.");
  }

  async function onDelete(slug: string) {
    if (!adminProjectSlugs.has(slug)) {
      setStatus("Default portfolio entries cannot be deleted here.");
      return;
    }

    setIsBusy(true);
    try {
      await deleteAdminProject(slug);
      await refreshAll();
      setStatus(`Deleted ${slug}`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete project.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  function onCreateExperienceNew() {
    setExperienceForm(initialExperienceForm);
    setEditingExperienceId(null);
    setIsExperienceFormOpen(true);
    setStatus("Adding a work history entry.");
  }

  function onEditExperience(entry: Experience) {
    setExperienceForm({
      when: entry.when,
      role: entry.role,
      note: entry.note,
      order: entry.order?.toString() ?? "",
    });
    setEditingExperienceId(entry.id);
    setIsExperienceFormOpen(true);
    setStatus(`Editing ${entry.role}`);
  }

  function onResetExperienceForm() {
    setExperienceForm(initialExperienceForm);
    setEditingExperienceId(null);
    setIsExperienceFormOpen(false);
    setStatus("Work history form cleared.");
  }

  async function onSubmitExperience(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!experienceForm.role.trim() || !experienceForm.when.trim()) {
      setStatus("A work history entry needs a role and its dates.");
      return;
    }

    const entry: Experience = {
      id: experienceId,
      when: experienceForm.when.trim(),
      role: experienceForm.role.trim(),
      note: experienceForm.note.trim(),
      order: experienceForm.order.trim() ? Number(experienceForm.order) : undefined,
    };

    setIsBusy(true);
    try {
      await saveAdminExperience(entry);
      await refreshAll();
      const action = editingExperienceId ? "Updated" : "Added";
      setEditingExperienceId(null);
      setExperienceForm(initialExperienceForm);
      setIsExperienceFormOpen(false);
      setStatus(`${action} ${entry.role} in the work history.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not save the work history entry.");
    } finally {
      setIsBusy(false);
    }
  }

  async function onDeleteExperience(id: string) {
    setIsBusy(true);
    try {
      await deleteAdminExperience(id);
      await refreshAll();
      setStatus(`Removed ${id} from the work history.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Could not delete the work history entry.");
    } finally {
      setIsBusy(false);
    }
  }

  return (
    <main className="relative z-10 pt-28 sm:pt-32 px-4 sm:px-6 pb-16 sm:pb-24">
      <ScrollProgress />
      <CursorFollower />
      <TopNav />

      <section className="mx-auto max-w-7xl mb-8 sm:mb-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-black tracking-tight mb-4">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 max-w-2xl">
              Add or edit projects, the home page&apos;s Selected work, your work
              history and your résumé. Every saved project gets a page at
              <span className="text-accent-ink"> /projects/your-slug</span>, a card
              on the archive and, unless you hide it, a place on the home page.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onCreateNew}
              className="px-4 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
            >
              Add New Project
            </button>
            <Link
              href="/archive"
              className="px-4 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors"
            >
              Open Archive
            </Link>
            <button
              type="button"
              onClick={onLogout}
              className="px-4 py-3 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent hover:text-accent transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl mb-8 sm:mb-10">
        <div className="bento-card p-5 sm:p-8">
          <h2 className="text-2xl font-bold mb-2">Resume PDF</h2>
          <p className="text-xs text-gray-500 mb-6">
            Upload a PDF here and the homepage resume button will open this file
            in a new tab.
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
            <Field label="Current Resume URL / Data URL">
              <textarea
                value={resumeUrl}
                onChange={(e) => setResumeUrl(e.target.value)}
                onBlur={async (e) => {
                  const value = e.target.value.trim();
                  if (!value || value === DEFAULT_RESUME_URL) {
                    return;
                  }
                  setIsBusy(true);
                  try {
                    await saveAdminResume(value);
                    setStatus("Updated resume link.");
                  } catch (error) {
                    setStatus(
                      error instanceof Error ? error.message : "Could not save resume link.",
                    );
                  } finally {
                    setIsBusy(false);
                  }
                }}
                className="admin-input min-h-24 font-mono text-[11px]"
                placeholder="Upload a PDF or paste a PDF/data URL"
              />
            </Field>
            <Field label="Upload Resume PDF">
              <div className="space-y-3">
                <input
                  type="file"
                  accept="application/pdf,.pdf"
                  onChange={onResumeUpload}
                  className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                  title="Upload resume PDF"
                />
                <div className="flex flex-wrap gap-3">
                  <a
                    href={resumeUrl || DEFAULT_RESUME_URL}
                    target="_blank"
                    rel="noreferrer"
                    className="tag hover:border-accent hover:text-accent"
                  >
                    Preview Resume
                  </a>
                  <button
                    type="button"
                    onClick={onResetResume}
                    className="tag hover:border-red-400 hover:text-red-300"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </Field>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6">
        <aside className="bento-card p-5 sm:p-8 lg:col-span-5">
          <h2 className="text-2xl font-bold mb-2">Available Projects</h2>
          <p className="text-xs text-gray-500 mb-6">
            Edit any existing project, or create a new one with the Add New
            Project button.
          </p>
          <div className="space-y-3 max-h-[680px] overflow-auto pr-2">
            {availableProjects.length === 0 ? (
              <p className="text-sm text-gray-500">
                No projects available yet.
              </p>
            ) : (
              availableProjects.map((item) => {
                const isDefaultProject = baseProjectSlugs.has(item.slug);
                const isCustomOverride = adminProjectSlugs.has(item.slug);

                return (
                  <div key={item.slug} className="border border-white/10 p-4">
                    <p className="font-bold uppercase tracking-tight">
                      {item.title}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">
                      /{item.slug}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Link href={`/projects/${item.slug}`} className="tag">
                        Case Study
                      </Link>
                      <button
                        onClick={() => onEdit(item)}
                        className="tag hover:border-accent hover:text-accent"
                      >
                        Edit
                      </button>
                      {isCustomOverride ? (
                        <button
                          onClick={() => onDelete(item.slug)}
                          className="tag hover:border-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="tag text-gray-500 border-white/10">
                          {isDefaultProject ? "Default" : "Read Only"}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        <article className="bento-card p-5 sm:p-8 lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6">
            {isFormOpen
              ? editingSlug
                ? "Edit Project"
                : "Create Project"
              : "Project Form"}
          </h2>
          {!isFormOpen ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-sm text-gray-400 mb-5">
                Select a project from the list to edit, or add a new one.
              </p>
              <button
                type="button"
                onClick={onCreateNew}
                className="px-6 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Add New Project
              </button>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={onSubmit}>
              {/* ── 00 · BASICS ─────────────────────────────── */}
              <FormSection number="00" label="Project Basics">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Project Title *">
                    <input
                      value={form.title}
                      onChange={(e) => onChange("title", e.target.value)}
                      className="admin-input"
                      title="Project Title"
                      placeholder="AI-Powered Travel Planner (WanderSmart)"
                      required
                    />
                  </Field>
                  <Field label="Year">
                    <input
                      value={form.year}
                      onChange={(e) => onChange("year", e.target.value)}
                      className="admin-input"
                      placeholder="2026"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field
                    label={
                      editingSlug
                        ? "Slug (locked while editing)"
                        : "Slug (auto-generated if empty)"
                    }
                  >
                    <input
                      value={form.slug}
                      onChange={(e) => onChange("slug", e.target.value)}
                      disabled={editingSlug !== null}
                      className="admin-input disabled:opacity-60 disabled:cursor-not-allowed"
                      placeholder="auto-generated-from-title"
                    />
                  </Field>
                  <Field label="Category">
                    <select
                      value={form.category}
                      onChange={(e) =>
                        onChange(
                          "category",
                          e.target.value as FormState["category"],
                        )
                      }
                      className="admin-input"
                      title="Category"
                    >
                      <option value="engineering">Engineering</option>
                      <option value="design">Design</option>
                    </select>
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Role">
                    <input
                      value={form.role}
                      onChange={(e) => onChange("role", e.target.value)}
                      className="admin-input"
                      placeholder="UX Design / Front-End"
                    />
                  </Field>
                  <Field label="Tech Stack (comma separated)">
                    <input
                      value={form.tech}
                      onChange={(e) => onChange("tech", e.target.value)}
                      className="admin-input"
                      placeholder="Next.js, TypeScript, Tailwind"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Project Link (live site URL)">
                    <input
                      value={form.projectLink}
                      onChange={(e) => onChange("projectLink", e.target.value)}
                      className="admin-input"
                      placeholder="https://..."
                    />
                  </Field>
                </div>
              </FormSection>

              {/* ── 00 · OVERVIEW ───────────────────────────── */}
              <FormSection
                number="00"
                label="Overview — shown at top of case study"
              >
                <Field label="Project Description (overview paragraph)">
                  <textarea
                    value={form.description}
                    onChange={(e) => onChange("description", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Short project overview shown in the header and overview section"
                  />
                </Field>
              </FormSection>

              {/* ── 01 · PROBLEM & SOLUTION ─────────────────── */}
              <FormSection number="01" label="Problem & Solution">
                <Field label="Problem Statement — left panel (red dot)">
                  <textarea
                    value={form.problem}
                    onChange={(e) => onChange("problem", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Core problem this project solves"
                  />
                </Field>
                <Field label="Solution — right panel (teal dot) + hero overlay">
                  <textarea
                    value={form.solution}
                    onChange={(e) => onChange("solution", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="How the final solution addresses the core problem"
                  />
                </Field>
              </FormSection>

              {/* ── 02 · CONTEXT & OBJECTIVES ───────────────── */}
              <FormSection number="02" label="Context & Objectives">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Context — section 02.1">
                    <textarea
                      value={form.context}
                      onChange={(e) => onChange("context", e.target.value)}
                      className="admin-input min-h-24"
                      placeholder="Project background, constraints, and timeline"
                    />
                  </Field>
                  <Field label="Objectives — section 02.2">
                    <textarea
                      value={form.objectives}
                      onChange={(e) => onChange("objectives", e.target.value)}
                      className="admin-input min-h-24"
                      placeholder="Business and user goals"
                    />
                  </Field>
                </div>
                <Field label="Audience & Users — section 02.3">
                  <textarea
                    value={form.audience}
                    onChange={(e) => onChange("audience", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Who this was designed for"
                  />
                </Field>
              </FormSection>

              {/* ── 03 · DESIGN PROCESS ─────────────────────── */}
              <FormSection number="03" label="Design Process">
                <Field label="Process — section 03">
                  <textarea
                    value={form.process}
                    onChange={(e) => onChange("process", e.target.value)}
                    className="admin-input min-h-28"
                    placeholder="Your UX process from discovery to delivery"
                  />
                </Field>
              </FormSection>

              {/* ── 04 · RESEARCH & INSIGHTS ────────────────── */}
              <FormSection number="04" label="Research & Insights">
                <Field label="Research Insights — section 04 (shown as pull-quote if filled)">
                  <textarea
                    value={form.researchInsights}
                    onChange={(e) =>
                      onChange("researchInsights", e.target.value)
                    }
                    className="admin-input min-h-24"
                    placeholder="Findings, user pain points, and key insights"
                  />
                </Field>
                <Field label="Information Architecture — section 04.1">
                  <textarea
                    value={form.informationArchitecture}
                    onChange={(e) =>
                      onChange("informationArchitecture", e.target.value)
                    }
                    className="admin-input min-h-24"
                    placeholder="Flows, content structure, and navigation choices"
                  />
                </Field>
              </FormSection>

              {/* ── 05 · DESIGN EXECUTION ───────────────────── */}
              <FormSection number="05" label="Design Execution">
                <Field label="Wireframes & Iterations — section 05.1">
                  <textarea
                    value={form.wireframes}
                    onChange={(e) => onChange("wireframes", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Low-fidelity concepts and iterations"
                  />
                </Field>
                <Field label="Visual Design System — section 05.2">
                  <textarea
                    value={form.visualDesign}
                    onChange={(e) => onChange("visualDesign", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Typography, color, components, and interaction patterns"
                  />
                </Field>
                <Field label="Prototyping & Testing — section 05.3">
                  <textarea
                    value={form.prototypeTesting}
                    onChange={(e) =>
                      onChange("prototypeTesting", e.target.value)
                    }
                    className="admin-input min-h-24"
                    placeholder="Prototype validation, test outcomes, and refinements"
                  />
                </Field>
              </FormSection>

              {/* ── 06 · VISUAL ARTIFACTS ───────────────────── */}
              <FormSection
                number="06"
                label="Visual Artifacts — gallery images on case study"
              >
                <Field label="Case Study Hero Image URL (shown at top)">
                  <input
                    value={form.caseStudyImage}
                    onChange={(e) => onChange("caseStudyImage", e.target.value)}
                    className="admin-input"
                    placeholder="https://... (falls back to Thumbnail if empty)"
                  />
                </Field>
                <Field label="Upload Case Study Hero Image">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => onProjectImageUpload(e, "caseStudyImage")}
                    className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                    title="Upload case study hero image"
                  />
                </Field>
                <Field label="Gallery Images — URLs (one per line) — slots: Discovery · IA · Wireframes · Final UI">
                  <textarea
                    value={form.caseStudyGallery}
                    onChange={(e) =>
                      onChange("caseStudyGallery", e.target.value)
                    }
                    className="admin-input min-h-24"
                    placeholder={
                      "https://...\nhttps://...\nhttps://...\nhttps://..."
                    }
                  />
                </Field>
                <Field label="Upload Gallery Images (up to 4 — Discovery, IA, Wireframes, Final UI)">
                  <div className="space-y-2">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      multiple
                      onChange={onProjectGalleryUpload}
                      className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                      title="Upload gallery images"
                    />
                    <p className="text-[10px] text-gray-500">
                      Uploaded images are appended to the gallery list above.
                      Order = Discovery → IA → Wireframes → Final UI.
                    </p>
                  </div>
                </Field>
              </FormSection>

              {/* ── 07 · OUTCOMES ───────────────────────────── */}
              <FormSection number="07" label="Impact & Outcomes">
                <Field label="Outcomes — section 07">
                  <textarea
                    value={form.outcomes}
                    onChange={(e) => onChange("outcomes", e.target.value)}
                    className="admin-input min-h-24"
                    placeholder="Metrics, qualitative impact, and business outcomes"
                  />
                </Field>
              </FormSection>

              {/* ── 08 · LEARNINGS ──────────────────────────── */}
              <FormSection number="08" label="Learnings & Next Steps">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Key Learnings — section 08.1 (shown as pull-quote if filled)">
                    <textarea
                      value={form.learnings}
                      onChange={(e) => onChange("learnings", e.target.value)}
                      className="admin-input min-h-24"
                      placeholder="What you learned and what changed"
                    />
                  </Field>
                  <Field label="Next Steps — section 08.2">
                    <textarea
                      value={form.nextSteps}
                      onChange={(e) => onChange("nextSteps", e.target.value)}
                      className="admin-input min-h-24"
                      placeholder="Future iterations and roadmap ideas"
                    />
                  </Field>
                </div>
              </FormSection>

              {/* ── 09 · FULL NARRATIVE (optional) ─────────── */}
              <FormSection
                number="09"
                label="Full Narrative (optional — only shown if filled)"
              >
                <Field label="Extended Write-Up">
                  <textarea
                    value={form.caseStudy}
                    onChange={(e) => onChange("caseStudy", e.target.value)}
                    className="admin-input min-h-40"
                    placeholder="Free-form extended case study narrative..."
                  />
                </Field>
              </FormSection>

              {/* ── HOME PAGE ───────────────────────────────── */}
              <FormSection
                number="⌂"
                label="Home page — how it shows in Selected work"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Show on the home page">
                    <label className="admin-input flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.showOnHome}
                        onChange={(e) => onChange("showOnHome", e.target.checked)}
                      />
                      <span className="text-sm">
                        {form.showOnHome ? "Shown in Selected work" : "Hidden (archive only)"}
                      </span>
                    </label>
                  </Field>
                  <Field label="Position (1 is first and opens by default)">
                    <input
                      value={form.homeOrder}
                      onChange={(e) => onChange("homeOrder", e.target.value.replace(/[^0-9]/g, ""))}
                      inputMode="numeric"
                      className="admin-input"
                      placeholder="Blank = after the numbered ones, newest first"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Short title (on the spine)">
                    <input
                      value={form.homeTitle}
                      onChange={(e) => onChange("homeTitle", e.target.value)}
                      className="admin-input"
                      placeholder="Blank = the project title"
                    />
                  </Field>
                  <Field label="Small line above the title">
                    <input
                      value={form.homeMeta}
                      onChange={(e) => onChange("homeMeta", e.target.value)}
                      className="admin-input"
                      placeholder="Fintech · 2024 (blank = category · year)"
                    />
                  </Field>
                </div>
                <Field label="One or two sentences on what it is">
                  <textarea
                    value={form.homeLine}
                    onChange={(e) => onChange("homeLine", e.target.value)}
                    className="admin-input min-h-20"
                    placeholder="Blank = the first sentence of the description"
                  />
                </Field>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Cover image URL (16:10 works best)">
                    <input
                      value={form.cover}
                      onChange={(e) => onChange("cover", e.target.value)}
                      className="admin-input"
                      placeholder="Blank = the thumbnail"
                    />
                  </Field>
                  <Field label="Upload cover image">
                    <input
                      type="file"
                      accept="image/*,.svg"
                      onChange={(e) => onProjectImageUpload(e, "cover")}
                      className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                      title="Upload home page cover image"
                    />
                  </Field>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Panel colour">
                    <div className="flex items-center gap-3">
                      <input
                        type="color"
                        value={/^#[0-9a-f]{6}$/i.test(form.coverBg) ? form.coverBg : "#e7e5e0"}
                        onChange={(e) => onChange("coverBg", e.target.value)}
                        className="h-11 w-14 shrink-0 cursor-pointer border border-border bg-transparent"
                        title="Panel colour"
                      />
                      <input
                        value={form.coverBg}
                        onChange={(e) => onChange("coverBg", e.target.value)}
                        className="admin-input"
                        placeholder="#DDE7FB (blank = paper grey)"
                      />
                    </div>
                  </Field>
                  <Field label="Text on the panel">
                    <label className="admin-input flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={form.coverDark}
                        onChange={(e) => onChange("coverDark", e.target.checked)}
                      />
                      <span className="text-sm">
                        {form.coverDark ? "White text (for a dark colour)" : "Black text (for a light colour)"}
                      </span>
                    </label>
                  </Field>
                </div>
              </FormSection>

              {/* ── THUMBNAIL ───────────────────────────────── */}
              <FormSection
                number="↑"
                label="Project Thumbnail (archive card image)"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field label="Thumbnail Image URL">
                    <input
                      value={form.image}
                      onChange={(e) => onChange("image", e.target.value)}
                      className="admin-input"
                      placeholder="https://..."
                    />
                  </Field>
                </div>
                <Field label="Upload Thumbnail Image">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={(e) => onProjectImageUpload(e, "image")}
                    className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                    title="Upload project thumbnail image"
                  />
                </Field>
              </FormSection>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBusy ? "Saving…" : editingSlug ? "Update Project" : "Save to Archive"}
                </button>
                <button
                  type="button"
                  onClick={onResetForm}
                  disabled={isBusy}
                  className="px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <span className="text-xs text-gray-500">
                  {editingSlug ? "Slug: " : "Generated slug: "}
                  <span className="text-accent">{effectiveSlug || "-"}</span>
                </span>
                {effectiveSlug ? (
                  <Link href={`/projects/${effectiveSlug}`} className="tag">
                    Open Case Study
                  </Link>
                ) : null}
              </div>
            </form>
          )}
          {status ? <p className="mt-4 text-xs text-accent">{status}</p> : null}
        </article>
      </section>

      <section className="mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-6 mt-8">
        <aside className="bento-card p-5 sm:p-8 lg:col-span-5">
          <h2 className="text-2xl font-bold mb-2">Work history</h2>
          <p className="text-xs text-gray-500 mb-6">
            The dated list under About on the home page, top to bottom. The first entry is
            highlighted.
          </p>
          <button
            type="button"
            onClick={onCreateExperienceNew}
            className="mb-4 px-4 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Add Work History Entry
          </button>
          <div className="space-y-3 max-h-[580px] overflow-auto pr-2">
            {availableExperience.length === 0 ? (
              <p className="text-sm text-gray-500">No work history entries yet.</p>
            ) : (
              availableExperience.map((item) => (
                <div key={item.id} className="border border-white/10 p-4">
                  <p className="font-bold tracking-tight break-words">{item.role}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{item.when}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <button
                      onClick={() => onEditExperience(item)}
                      className="tag hover:border-accent hover:text-accent"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDeleteExperience(item.id)}
                      className="tag hover:border-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>

        <article className="bento-card p-5 sm:p-8 lg:col-span-7">
          <h2 className="text-2xl font-bold mb-6">
            {isExperienceFormOpen
              ? editingExperienceId
                ? "Edit Work History Entry"
                : "Add Work History Entry"
              : "Work History Form"}
          </h2>
          {!isExperienceFormOpen ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-sm text-gray-400 mb-5">
                Select an entry to edit, or add a new one.
              </p>
              <button
                type="button"
                onClick={onCreateExperienceNew}
                className="px-6 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Add Work History Entry
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={onSubmitExperience}>
              <Field label="Role and where *">
                <input
                  value={experienceForm.role}
                  onChange={(e) => onExperienceChange("role", e.target.value)}
                  className="admin-input"
                  placeholder="Designer, GDG UNILAG, Lagos"
                  required
                />
              </Field>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="When *">
                  <input
                    value={experienceForm.when}
                    onChange={(e) => onExperienceChange("when", e.target.value)}
                    className="admin-input"
                    placeholder="2023 to now"
                    required
                  />
                </Field>
                <Field label="Position (1 is the top)">
                  <input
                    value={experienceForm.order}
                    onChange={(e) =>
                      onExperienceChange("order", e.target.value.replace(/[^0-9]/g, ""))
                    }
                    inputMode="numeric"
                    className="admin-input"
                    placeholder="Blank = at the bottom"
                  />
                </Field>
              </div>
              <Field label="One line on what you did">
                <textarea
                  value={experienceForm.note}
                  onChange={(e) => onExperienceChange("note", e.target.value)}
                  className="admin-input min-h-20"
                  placeholder="Design for the Google Developer Group at the University of Lagos."
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  disabled={isBusy}
                  className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isBusy ? "Saving…" : editingExperienceId ? "Update Entry" : "Save Entry"}
                </button>
                <button
                  type="button"
                  onClick={onResetExperienceForm}
                  disabled={isBusy}
                  className="px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </article>
      </section>
    </main>
  );
}

function FormSection(props: {
  number: string;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 sm:gap-3 pt-4 pb-2 border-b border-white/[0.07]">
        <span className="text-[9px] font-mono tabular-nums text-gray-600">
          {props.number}
        </span>
        <div className="h-px flex-1 bg-white/[0.05]" />
        <span className="text-[9px] font-mono uppercase tracking-[0.18em] sm:tracking-[0.35em] text-gray-500 break-words text-right">
          {props.label}
        </span>
      </div>
      {props.children}
    </div>
  );
}

function Field(props: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-[10px] uppercase tracking-[0.2em] text-gray-500">
        {props.label}
      </span>
      {props.children}
    </label>
  );
}

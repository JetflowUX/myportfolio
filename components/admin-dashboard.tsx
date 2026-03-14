"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent, ReactNode } from "react";
import { CursorFollower } from "@/components/cursor-follower";
import { ScrollProgress } from "@/components/scroll-progress";
import { TopNav } from "@/components/top-nav";
import { companies, projects, type Company, type Project } from "@/lib/data";
import {
  deleteAdminCompany,
  getAdminCompanies,
  deleteAdminProject,
  getAllCompanies,
  getAllProjects,
  getAdminProjects,
  saveAdminCompany,
  saveAdminProject,
  slugify,
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
};

type CompanyFormState = {
  id: string;
  name: string;
  logo: string;
  website: string;
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
};

const initialCompanyForm: CompanyFormState = {
  id: "",
  name: "",
  logo: "",
  website: "",
};

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
  const [companyForm, setCompanyForm] =
    useState<CompanyFormState>(initialCompanyForm);
  const [availableCompanies, setAvailableCompanies] = useState<Company[]>([]);
  const [adminCompanyIds, setAdminCompanyIds] = useState<Set<string>>(
    new Set(),
  );
  const [editingCompanyId, setEditingCompanyId] = useState<string | null>(null);
  const [isCompanyFormOpen, setIsCompanyFormOpen] = useState(false);

  const baseProjectSlugs = useMemo(
    () => new Set(projects.map((item) => item.slug)),
    [],
  );
  const baseCompanyIds = useMemo(
    () => new Set(companies.map((item) => item.id)),
    [],
  );

  function refreshProjects() {
    const adminProjects = getAdminProjects();
    setAdminProjectSlugs(new Set(adminProjects.map((item) => item.slug)));
    setAvailableProjects(getAllProjects());
  }

  function refreshCompanies() {
    const adminCompanies = getAdminCompanies();
    setAdminCompanyIds(new Set(adminCompanies.map((item) => item.id)));
    setAvailableCompanies(getAllCompanies());
  }

  useEffect(() => {
    refreshProjects();
    refreshCompanies();
  }, []);

  const liveSlug = useMemo(() => {
    if (form.slug.trim()) {
      return slugify(form.slug);
    }
    return slugify(form.title);
  }, [form.slug, form.title]);

  const liveCompanyId = useMemo(() => {
    if (companyForm.id.trim()) {
      return slugify(companyForm.id);
    }
    return slugify(companyForm.name);
  }, [companyForm.id, companyForm.name]);

  function onChange<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function onCompanyChange<K extends keyof CompanyFormState>(
    key: K,
    value: CompanyFormState[K],
  ) {
    setCompanyForm((prev) => ({ ...prev, [key]: value }));
  }

  function onProjectImageUpload(
    event: ChangeEvent<HTMLInputElement>,
    field: "image" | "caseStudyImage",
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Please upload an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (!result) {
        setStatus("Could not read the selected image.");
        return;
      }
      setForm((prev) => ({ ...prev, [field]: result }));
      setStatus(
        field === "image"
          ? "Uploaded project thumbnail image."
          : "Uploaded case study hero image.",
      );
    };
    reader.onerror = () => {
      setStatus("Could not read the selected image.");
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function onProjectGalleryUpload(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) => file.type.startsWith("image/"));
    if (!imageFiles.length) {
      setStatus("Please select image files for the project gallery.");
      event.target.value = "";
      return;
    }

    Promise.all(
      imageFiles.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () =>
              typeof reader.result === "string"
                ? resolve(reader.result)
                : reject(new Error("invalid result"));
            reader.onerror = () => reject(new Error("read error"));
            reader.readAsDataURL(file);
          }),
      ),
    )
      .then((images) => {
        setForm((prev) => {
          const existing = prev.caseStudyGallery
            .split(/\n|,/)
            .map((item) => item.trim())
            .filter(Boolean);
          const merged = [...existing, ...images];
          return { ...prev, caseStudyGallery: merged.join("\n") };
        });
        setStatus(`Added ${images.length} image(s) to project gallery.`);
      })
      .catch(() => setStatus("Could not read one or more gallery images."));

    event.target.value = "";
  }

  function onCompanyLogoUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      setStatus("Please upload an image file for the company logo.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";

      if (!result) {
        setStatus("Could not read the selected image.");
        return;
      }

      setCompanyForm((prev) => ({ ...prev, logo: result }));
      setStatus(`Uploaded logo for ${companyForm.name || "company entry"}.`);
    };

    reader.onerror = () => {
      setStatus("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.title.trim()) {
      setStatus("Title is required.");
      return;
    }

    if (!liveSlug) {
      setStatus("Slug could not be generated.");
      return;
    }

    const project: Project = {
      slug: liveSlug,
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
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
      caseStudyImage: form.caseStudyImage.trim() || form.image.trim(),
      caseStudyGallery: form.caseStudyGallery
        .split(/\n|,/)
        .map((item) => item.trim())
        .filter(Boolean),
      projectLink: form.projectLink.trim(),
      caseStudy: form.caseStudy.trim(),
    };

    saveAdminProject(project);
    refreshProjects();
    const action = editingSlug ? "Updated" : "Saved";
    setEditingSlug(null);
    setForm(initialForm);
    setIsFormOpen(false);
    setStatus(
      `${action} ${project.title}. Added to archive and case-study page: /projects/${project.slug}`,
    );
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

  function onDelete(slug: string) {
    if (!adminProjectSlugs.has(slug)) {
      setStatus("Default portfolio entries cannot be deleted here.");
      return;
    }

    deleteAdminProject(slug);
    refreshProjects();
    setStatus(`Deleted ${slug}`);
  }

  async function onLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  }

  function onCreateCompanyNew() {
    setCompanyForm(initialCompanyForm);
    setEditingCompanyId(null);
    setIsCompanyFormOpen(true);
    setStatus("Creating a new company entry.");
  }

  function onEditCompany(company: Company) {
    setCompanyForm({
      id: company.id,
      name: company.name,
      logo: company.logo,
      website: company.website ?? "",
    });
    setEditingCompanyId(company.id);
    setIsCompanyFormOpen(true);
    setStatus(`Editing ${company.name}`);
  }

  function onResetCompanyForm() {
    setCompanyForm(initialCompanyForm);
    setEditingCompanyId(null);
    setIsCompanyFormOpen(false);
    setStatus("Company form cleared.");
  }

  function onSubmitCompany(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!companyForm.name.trim()) {
      setStatus("Company name is required.");
      return;
    }

    if (!liveCompanyId) {
      setStatus("Company ID could not be generated.");
      return;
    }

    const company: Company = {
      id: liveCompanyId,
      name: companyForm.name.trim(),
      logo:
        companyForm.logo.trim() ||
        "https://dummyimage.com/240x240/111827/00ffc2&text=LOGO",
      website: companyForm.website.trim(),
    };

    saveAdminCompany(company);
    refreshCompanies();
    const action = editingCompanyId ? "Updated" : "Saved";
    setEditingCompanyId(null);
    setCompanyForm(initialCompanyForm);
    setIsCompanyFormOpen(false);
    setStatus(`${action} ${company.name} in company list.`);
  }

  function onDeleteCompany(id: string) {
    if (!adminCompanyIds.has(id)) {
      setStatus("Default company entries cannot be deleted here.");
      return;
    }

    deleteAdminCompany(id);
    refreshCompanies();
    setStatus(`Deleted company ${id}`);
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
              Add project entries with details, project link, and case-study
              content. Every saved project gets a page at
              <span className="text-accent"> /projects/your-slug</span>.
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
                      placeholder="AI Travel Planner"
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
                  <Field label="Slug (auto-generated if empty)">
                    <input
                      value={form.slug}
                      onChange={(e) => onChange("slug", e.target.value)}
                      className="admin-input"
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
                  className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs"
                >
                  {editingSlug ? "Update Project" : "Save to Archive"}
                </button>
                <button
                  type="button"
                  onClick={onResetForm}
                  className="px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors"
                >
                  Cancel
                </button>
                <span className="text-xs text-gray-500">
                  Generated slug:{" "}
                  <span className="text-accent">{liveSlug || "-"}</span>
                </span>
                {liveSlug ? (
                  <Link href={`/projects/${liveSlug}`} className="tag">
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
          <h2 className="text-2xl font-bold mb-2">Companies I Worked With</h2>
          <p className="text-xs text-gray-500 mb-6">
            Manage the homepage slider logos and company names.
          </p>
          <button
            type="button"
            onClick={onCreateCompanyNew}
            className="mb-4 px-4 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
          >
            Add New Company
          </button>
          <div className="space-y-3 max-h-[580px] overflow-auto pr-2">
            {availableCompanies.length === 0 ? (
              <p className="text-sm text-gray-500">No company entries yet.</p>
            ) : (
              availableCompanies.map((item) => {
                const isDefault = baseCompanyIds.has(item.id);
                const isCustomOverride = adminCompanyIds.has(item.id);

                return (
                  <div key={item.id} className="border border-white/10 p-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.logo}
                        alt={`${item.name} logo`}
                        className="w-10 h-10 rounded border border-white/10 object-contain bg-black/40 p-1"
                      />
                      <div>
                        <p className="font-bold uppercase tracking-tight">
                          {item.name}
                        </p>
                        <p className="text-[10px] text-gray-500 mt-1">
                          /{item.id}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => onEditCompany(item)}
                        className="tag hover:border-accent hover:text-accent"
                      >
                        Edit
                      </button>
                      {isCustomOverride ? (
                        <button
                          onClick={() => onDeleteCompany(item.id)}
                          className="tag hover:border-red-400 hover:text-red-300"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="tag text-gray-500 border-white/10">
                          {isDefault ? "Default" : "Read Only"}
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
            {isCompanyFormOpen
              ? editingCompanyId
                ? "Edit Company"
                : "Create Company"
              : "Company Form"}
          </h2>
          {!isCompanyFormOpen ? (
            <div className="border border-white/10 p-8 text-center">
              <p className="text-sm text-gray-400 mb-5">
                Select a company entry to edit, or add a new one.
              </p>
              <button
                type="button"
                onClick={onCreateCompanyNew}
                className="px-6 py-3 bg-accent text-black text-xs font-bold uppercase tracking-widest hover:brightness-110 transition-all"
              >
                Add New Company
              </button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={onSubmitCompany}>
              <Field label="Company Name">
                <input
                  value={companyForm.name}
                  onChange={(e) => onCompanyChange("name", e.target.value)}
                  className="admin-input"
                  title="Company Name"
                  placeholder="Gimbalabs"
                  required
                />
              </Field>

              <Field label="Company ID (optional)">
                <input
                  value={companyForm.id}
                  onChange={(e) => onCompanyChange("id", e.target.value)}
                  className="admin-input"
                  title="Company ID"
                  placeholder="auto-generated-from-company-name"
                />
              </Field>

              <Field label="Logo URL (SVG or image)">
                <input
                  value={companyForm.logo}
                  onChange={(e) => onCompanyChange("logo", e.target.value)}
                  className="admin-input"
                  title="Logo URL"
                  placeholder="https://... or leave blank and upload below"
                />
              </Field>

              <Field label="Upload Logo Image">
                <div className="space-y-3">
                  <input
                    type="file"
                    accept="image/*,.svg"
                    onChange={onCompanyLogoUpload}
                    className="admin-input file:mr-4 file:border-0 file:bg-accent file:px-4 file:py-2 file:text-xs file:font-bold file:uppercase file:tracking-widest file:text-black"
                    title="Upload company logo"
                  />
                  <p className="text-xs text-gray-500">
                    Use this if you only have the logo image file. The upload is
                    stored as the company logo value, and you can still paste a
                    URL above instead.
                  </p>
                  {companyForm.logo ? (
                    <div className="inline-flex items-center gap-3 rounded border border-white/10 bg-black/30 px-3 py-3">
                      <img
                        src={companyForm.logo}
                        alt={`${companyForm.name || "Company"} logo preview`}
                        className="h-12 w-12 rounded border border-white/10 bg-black/40 object-contain p-1"
                      />
                      <span className="text-xs text-gray-400">
                        Current logo preview
                      </span>
                    </div>
                  ) : null}
                </div>
              </Field>

              <Field label="Company Website (optional)">
                <input
                  value={companyForm.website}
                  onChange={(e) => onCompanyChange("website", e.target.value)}
                  className="admin-input"
                  title="Company Website"
                  placeholder="https://..."
                />
              </Field>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="submit"
                  className="px-8 py-4 bg-accent text-black font-bold uppercase tracking-widest text-xs"
                >
                  {editingCompanyId ? "Update Company" : "Save Company"}
                </button>
                <button
                  type="button"
                  onClick={onResetCompanyForm}
                  className="px-6 py-4 border border-white/20 text-xs font-bold uppercase tracking-widest hover:border-accent transition-colors"
                >
                  Cancel
                </button>
                <span className="text-xs text-gray-500">
                  Generated company ID:{" "}
                  <span className="text-accent">{liveCompanyId || "-"}</span>
                </span>
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

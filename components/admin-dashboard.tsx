"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import type { FormEvent, ReactNode } from "react";
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
  role: string;
  tech: string;
  image: string;
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
  role: "",
  tech: "",
  image: "",
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
      role: form.role.trim() || "Role not specified",
      tech: form.tech
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      category: form.category,
      image:
        form.image.trim() ||
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200",
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
      role: project.role,
      tech: project.tech.join(", "),
      image: project.image,
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
            <form className="space-y-4" onSubmit={onSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Project Title">
                  <input
                    value={form.title}
                    onChange={(e) => onChange("title", e.target.value)}
                    className="admin-input"
                    title="Project title"
                    placeholder="AI Travel Planner"
                    required
                  />
                </Field>
                <Field label="Year">
                  <input
                    value={form.year}
                    onChange={(e) => onChange("year", e.target.value)}
                    className="admin-input"
                    title="Year"
                    placeholder="2026"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Slug (optional)">
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

              <Field label="Role">
                <input
                  value={form.role}
                  onChange={(e) => onChange("role", e.target.value)}
                  className="admin-input"
                  placeholder="UX Design / Front-End"
                />
              </Field>

              <Field label="Project Details">
                <textarea
                  value={form.description}
                  onChange={(e) => onChange("description", e.target.value)}
                  className="admin-input min-h-24"
                  title="Project details"
                  placeholder="Short project overview"
                />
              </Field>

              <Field label="Problem Statement">
                <textarea
                  value={form.problem}
                  onChange={(e) => onChange("problem", e.target.value)}
                  className="admin-input min-h-24"
                  title="Problem statement"
                  placeholder="Core problem this project solves"
                />
              </Field>

              <Field label="Case Study">
                <textarea
                  value={form.caseStudy}
                  onChange={(e) => onChange("caseStudy", e.target.value)}
                  className="admin-input min-h-40"
                  placeholder="Write full case-study narrative..."
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Project Link">
                  <input
                    value={form.projectLink}
                    onChange={(e) => onChange("projectLink", e.target.value)}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </Field>
                <Field label="Image URL">
                  <input
                    value={form.image}
                    onChange={(e) => onChange("image", e.target.value)}
                    className="admin-input"
                    placeholder="https://..."
                  />
                </Field>
              </div>

              <Field label="Tech Stack (comma separated)">
                <input
                  value={form.tech}
                  onChange={(e) => onChange("tech", e.target.value)}
                  className="admin-input"
                  placeholder="Next.js, TypeScript, Tailwind"
                />
              </Field>

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
                  placeholder="https://..."
                  required
                />
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

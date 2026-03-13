import type { NextPageContext } from "next";

type ErrorProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorProps) {
  return (
    <main className="min-h-screen grid place-items-center bg-[#050505] text-slate-200 p-8 text-center font-mono">
      <section>
        <p className="tracking-[0.18em] uppercase opacity-70">
          {statusCode ? `Error ${statusCode}` : "Client Error"}
        </p>
        <h1 className="text-3xl my-3">Something went wrong</h1>
        <p className="opacity-80">Please refresh the page or return home.</p>
      </section>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 404;
  return { statusCode };
};

export default ErrorPage;

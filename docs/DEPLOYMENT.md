# Deployment

## Deployment model

GeneSite produces a static build artifact. Hosting must serve immutable files
over HTTPS with custom-domain support; it must not require a persistent Node
process, database, authentication service, or server-side rendering.

The initial hosting provider remains undecided. The implementation should stay
portable among reputable static hosts.

## Environments

- **Local:** authoring, validation, tests, and production-build preview.
- **Preview:** an isolated URL for each proposed change, with indexing disabled.
- **Production:** the canonical domain, deployed only from the protected primary
  branch after required checks pass.

Preview builds must be treated as potentially public. They may contain only
content safe for the preview provider; sensitive drafts should not be pushed to
a remote preview at all.

## Build contract

The eventual package scripts should expose stable commands for:

- formatting/checking formatting;
- linting;
- Astro/TypeScript checking;
- content-integrity validation;
- tests;
- production build;
- local preview.

The CI build uses the repository lockfile and a pinned supported Node major
version. It sets the production site origin explicitly so canonical URLs, feeds,
and sitemaps cannot inherit a preview hostname.

Expected output is Astro's static `dist/` directory. `dist/` is generated and
must not be committed.

## Release pipeline

1. Install dependencies from the lockfile without mutation.
2. Run formatting, lint, type, content, and test checks.
3. Build the static production artifact.
4. Inspect the artifact for draft leakage, broken internal links, metadata,
   sitemap/feed validity, and unexpected client JavaScript.
5. Deploy the exact checked artifact to a preview.
6. Run targeted accessibility and browser smoke tests.
7. Promote or rebuild the same commit for production.
8. Run post-deploy checks for canonical URLs, key pages, assets, redirects, and
   security headers.

No deployment should continue after a failed validation step.

## Hosting requirements

- Automatic HTTPS and custom domains.
- Atomic deploys with an accessible deployment history.
- Preview deployments with `noindex`.
- Redirect and custom-header configuration.
- Compression, sensible cache behavior, and global static delivery.
- Build logs and a documented rollback operation.
- No forced client analytics or cookies.

## Headers and caching

HTML should revalidate promptly so revisions appear after deployment. Hashed
assets should be cached for a long duration as immutable. Apply a conservative
Content Security Policy, `X-Content-Type-Options: nosniff`, a privacy-preserving
referrer policy, and appropriate framing and permissions policies. Exact header
syntax is provider-specific and will be decided with the host.

## Redirects

Canonical writing-ID redirects are source-controlled, reviewed, and tested. Use
permanent redirects only after the new canonical page exists. Avoid redirect
chains and never silently reuse an old writing URL for a different work.

## Rollback and recovery

Rollback means redeploying a previously successful immutable artifact or commit.
Content remains recoverable through version control. Document the provider's
one-command or console rollback before the first production release, and test it
once on a preview environment.

## Secrets and configuration

A basic production build should need no secrets. The public site origin and
build mode are configuration, not secrets. If a later optional service needs a
token, scope it minimally, store it in the host's secret manager, and never make
it available to client code.

## Provider decision criteria

Before implementation phase 5, choose a host based on static Astro support,
preview safety, custom headers/redirects, rollback quality, cost predictability,
regional performance, and operational simplicity. Record the decision and exact
configuration here.

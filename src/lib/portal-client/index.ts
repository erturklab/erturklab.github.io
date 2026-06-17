export interface PortalJobListItem {
  id: number;
  slug: string;
  jobCode: string | null;
  title: string;
  positionType: string;
  summary: string;
  publishedAt: number | null;
}

export interface PortalJobDetail extends PortalJobListItem {
  description: string | null;
  mustHave: string[];
  niceToHave: string[];
  fundingSource: string | null;
  startDate: string | null;
  contractType: string | null;
  applyInstructions: string;
}

export interface PortalClientConfig {
  apiUrl: string;
  siteId: string;
  publicKey: string;
  origin?: string;
}

function headers(config: PortalClientConfig): HeadersInit {
  return {
    "X-Portal-Site-Id": config.siteId,
    "X-Portal-Key": config.publicKey,
    ...(config.origin ? { Origin: config.origin } : {}),
  };
}

async function parseJson<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error || `Portal API error ${res.status}`);
  }
  return data as T;
}

export class PortalClient {
  constructor(private config: PortalClientConfig) {}

  async verify(): Promise<{ ok: boolean; orgName: string; activeJobCount: number }> {
    const res = await fetch(`${this.config.apiUrl}/api/portal/verify`, {
      headers: headers(this.config),
      cache: "no-store",
    });
    return parseJson(res);
  }

  async listJobs(): Promise<PortalJobListItem[]> {
    const res = await fetch(`${this.config.apiUrl}/api/portal/jobs`, {
      headers: headers(this.config),
      cache: "no-store",
    });
    const data = await parseJson<{ jobs: PortalJobListItem[] }>(res);
    return data.jobs;
  }

  async getJob(slug: string): Promise<PortalJobDetail> {
    const res = await fetch(`${this.config.apiUrl}/api/portal/jobs/${encodeURIComponent(slug)}`, {
      headers: headers(this.config),
      cache: "no-store",
    });
    const data = await parseJson<{ job: PortalJobDetail }>(res);
    return data.job;
  }

  async getCaptcha(): Promise<{ question: string; token: string }> {
    const res = await fetch(`${this.config.apiUrl}/api/portal/captcha`, {
      headers: headers(this.config),
      cache: "no-store",
    });
    return parseJson(res);
  }

  async submitApplication(input: {
    jobSlug: string;
    name: string;
    email: string;
    cv: File;
    motivationLetter?: File;
    captchaToken: string;
    captchaAnswer: string;
  }): Promise<{ ok: boolean; applicationId: number; message: string }> {
    const form = new FormData();
    form.set("jobSlug", input.jobSlug);
    form.set("name", input.name);
    form.set("email", input.email);
    form.set("cv", input.cv);
    form.set("captchaToken", input.captchaToken);
    form.set("captchaAnswer", input.captchaAnswer);
    if (input.motivationLetter) form.set("motivationLetter", input.motivationLetter);

    const res = await fetch(`${this.config.apiUrl}/api/portal/apply`, {
      method: "POST",
      headers: {
        "X-Portal-Site-Id": this.config.siteId,
        "X-Portal-Key": this.config.publicKey,
        ...(this.config.origin ? { Origin: this.config.origin } : {}),
      },
      body: form,
    });
    return parseJson(res);
  }
}

export function createPortalClient(config: PortalClientConfig): PortalClient {
  return new PortalClient(config);
}

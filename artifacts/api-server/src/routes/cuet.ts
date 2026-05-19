import { Router } from "express";
import { load } from "cheerio";

const router = Router();
const BASE = "https://course.cuet.ac.bd";

const BROWSER_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  Connection: "keep-alive",
  "Upgrade-Insecure-Requests": "1",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Cache-Control": "max-age=0",
};

function parseSetCookie(headers: Headers): string {
  const raw = (headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.() ?? [];
  const cookies: string[] =
    Array.isArray(raw) && raw.length
      ? raw
      : headers.get("set-cookie")
      ? [headers.get("set-cookie")!]
      : [];
  return cookies
    .map((c) => c.split(";")[0].trim())
    .filter(Boolean)
    .join("; ");
}

function mergeCookies(existing: string, incoming: string): string {
  const jar = new Map<string, string>();
  for (const part of `${existing}; ${incoming}`.split(";")) {
    const trimmed = part.trim();
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    jar.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  return Array.from(jar, ([k, v]) => `${k}=${v}`).join("; ");
}

type ResultRow = {
  code: string;
  credit: number;
  levelTerm: string;
  sessional: boolean;
  grade: string;
  type: string;
};

function parseResultsHtml(html: string): { studentId?: string; name?: string; rows: ResultRow[] } {
  const $ = load(html);
  const rows: ResultRow[] = [];

  $("table").each((_, tbl) => {
    const headers = $(tbl)
      .find("tr")
      .first()
      .find("th,td")
      .map((_, el) => $(el).text().trim().toLowerCase())
      .get();
    const looksLikeResults =
      headers.some((h) => h.includes("course code")) &&
      headers.some((h) => h.includes("result"));
    if (!looksLikeResults) return;

    $(tbl)
      .find("tr")
      .slice(1)
      .each((_, tr) => {
        const cells = $(tr)
          .find("td")
          .map((_, el) => $(el).text().replace(/\s+/g, " ").trim())
          .get();
        if (cells.length < 6) return;
        const [code, creditStr, levelTerm, sessional, grade, type] = cells;
        const credit = parseFloat(creditStr) || 0;
        rows.push({
          code,
          credit,
          levelTerm,
          sessional: /yes/i.test(sessional),
          grade: grade.replace(/\s/g, ""),
          type,
        });
      });
  });

  const bodyText = $("body").text();
  const idMatch = bodyText.match(/Student\s*ID[:\s]*([0-9]+)/i);
  const nameMatch = bodyText.match(/Name[:\s]*([A-Za-z .]+?)(?:\s{2,}|$)/);
  return {
    studentId: idMatch?.[1],
    name: nameMatch?.[1]?.trim(),
    rows,
  };
}

function parseAdminHtml(html: string): {
  studentId?: string;
  name?: string;
  department?: string;
  batch?: string;
} {
  const $ = load(html);
  const info: Record<string, string> = {};

  $("tr").each((_, tr) => {
    const cells = $(tr).find("th,td");
    if (cells.length >= 2) {
      const key = $(cells[0]).text().replace(/\s+/g, " ").trim().toLowerCase().replace(/[:*]/g, "").trim();
      const value = $(cells[1]).text().replace(/\s+/g, " ").trim();
      if (key && value) info[key] = value;
    }
  });

  $("input").each((_, el) => {
    const name = ($(el).attr("name") || $(el).attr("id") || "").toLowerCase();
    const value = $(el).attr("value") || "";
    if (name && value) info[name] = value;
  });

  $("dt").each((_, el) => {
    const key = $(el).text().replace(/\s+/g, " ").trim().toLowerCase().replace(/[:*]/g, "").trim();
    const value = $(el).next("dd").text().replace(/\s+/g, " ").trim();
    if (key && value) info[key] = value;
  });

  const pick = (...keys: string[]) => {
    for (const kf of keys) {
      for (const k of Object.keys(info)) {
        if (k.includes(kf)) return info[k];
      }
    }
    return undefined;
  };

  let studentId = pick("student id", "student_id", "studentid", "user_email", "user id", "id no", "roll");
  let name = pick("student name", "full name", "name");
  const department = pick("department", "dept");
  const batch = pick("batch", "session", "series");

  const text = $("body").text().replace(/\s+/g, " ");
  if (!studentId) studentId = text.match(/Student\s*ID[:\s]*([0-9]+)/i)?.[1];
  if (!name) name = text.match(/Name[:\s]*([A-Za-z][A-Za-z .'-]{2,60})/)?.[1]?.trim();
  if (name && /^name$/i.test(name)) name = undefined;

  return { studentId, name, department, batch };
}

router.get("/cuet-captcha", async (req, res) => {
  try {
    const pageRes = await fetch(`${BASE}/index.php`, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(12000),
    });

    if (!pageRes.ok && pageRes.status !== 200) {
      res.status(502).json({ error: `CUET portal returned HTTP ${pageRes.status}.` });
      return;
    }

    const cookie1 = parseSetCookie(pageRes.headers);
    const pageHtml = await pageRes.text();

    const isRealChallenge =
      (pageHtml.includes("__cf_chl") || pageHtml.includes("cf-challenge-running")) &&
      !pageHtml.includes("loginuser");
    if (isRealChallenge) {
      res.status(502).json({ error: "The CUET portal is behind a Cloudflare challenge. Please try again in a moment." });
      return;
    }

    const csrfMatch = pageHtml.match(/name=["']csrf_token["'][^>]*value=["']([^"']+)["']/i);
    const csrf = csrfMatch?.[1] ?? "";

    const capRes = await fetch(`${BASE}/captcha.php`, {
      headers: {
        ...BROWSER_HEADERS,
        Accept: "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        Cookie: cookie1,
        Referer: `${BASE}/index.php`,
      },
      signal: AbortSignal.timeout(12000),
    });

    if (!capRes.ok) {
      res.status(502).json({ error: `CUET portal returned HTTP ${capRes.status} for captcha image.` });
      return;
    }

    const buf = await capRes.arrayBuffer();
    const bytes = new Uint8Array(buf);

    const isPng  = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47;
    const isJpeg = bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff;
    const isGif  = bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46;

    if (!isPng && !isJpeg && !isGif) {
      res.status(502).json({ error: "Received unexpected response for captcha image. The CUET portal may be blocking this request." });
      return;
    }

    const mime = isPng ? "image/png" : isJpeg ? "image/jpeg" : "image/gif";
    const b64 = Buffer.from(buf).toString("base64");
    const cookie2 = parseSetCookie(capRes.headers);
    const sessionCookie = cookie2 || cookie1;

    res.json({ cookie: sessionCookie, csrf, image: `data:${mime};base64,${b64}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ error: message });
  }
});

router.post("/cuet-login", async (req, res) => {
  try {
    const { studentId, password, captcha, cookie, csrf } = req.body as {
      studentId: string;
      password: string;
      captcha: string;
      cookie: string;
      csrf?: string;
    };

    if (!studentId || !password || !captcha || !cookie) {
      res.status(400).json({ ok: false, error: "Missing required fields." });
      return;
    }

    const form = new URLSearchParams();
    form.set("user_email", studentId);
    form.set("user_password", password);
    form.set("captcha", captcha);
    form.set("loginuser", "Sign In");
    if (csrf) form.set("csrf_token", csrf);

    const loginRes = await fetch(`${BASE}/index.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "Mozilla/5.0",
        Cookie: cookie,
        Referer: `${BASE}/index.php`,
      },
      body: form.toString(),
      redirect: "manual",
    });

    const newCookie = parseSetCookie(loginRes.headers);
    const mergedCookie = mergeCookies(cookie, newCookie);

    let html = "";
    if (loginRes.status >= 300 && loginRes.status < 400) {
      const loc = loginRes.headers.get("location") || `${BASE}/result_published.php`;
      const url = loc.startsWith("http") ? loc : `${BASE}/${loc.replace(/^\//, "")}`;
      const r = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0", Cookie: mergedCookie } });
      html = await r.text();
    } else {
      html = await loginRes.text();
    }

    const resultsRes = await fetch(`${BASE}/result_published.php`, {
      headers: { "User-Agent": "Mozilla/5.0", Cookie: mergedCookie },
    });
    const resultsHtml = await resultsRes.text();
    const parsed = parseResultsHtml(resultsHtml);

    let profile: ReturnType<typeof parseAdminHtml> = {};
    try {
      const adminRes = await fetch(`${BASE}/admin.php`, {
        headers: { "User-Agent": "Mozilla/5.0", Cookie: mergedCookie },
      });
      const adminHtml = await adminRes.text();
      profile = parseAdminHtml(adminHtml);
    } catch {
      // Profile data is optional
    }

    if (parsed.rows.length === 0) {
      const fallback = parseResultsHtml(html);
      if (fallback.rows.length === 0) {
        const lower = (html + resultsHtml).toLowerCase();
        let reason = "Login failed or no results found.";
        if (lower.includes("captcha")) reason = "Incorrect captcha. Please try again.";
        else if (lower.includes("password") || lower.includes("invalid"))
          reason = "Invalid student ID or password.";
        res.json({ ok: false, error: reason });
        return;
      }
      res.json({
        ok: true,
        ...fallback,
        studentId: profile.studentId ?? fallback.studentId,
        name: profile.name ?? fallback.name,
        department: profile.department,
        batch: profile.batch,
      });
      return;
    }

    res.json({
      ok: true,
      ...parsed,
      studentId: profile.studentId ?? parsed.studentId,
      name: profile.name ?? parsed.name,
      department: profile.department,
      batch: profile.batch,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    res.status(500).json({ ok: false, error: message });
  }
});

export default router;

import { google } from "googleapis";
import type { Application } from "./types";

// ── Column order (must match the sheet header row) ────────────────────────────
// A  Application ID
// B  Submitted At
// C  Company Name
// D  Sector (markets field)
// E  Stage
// F  City
// G  Team Size
// H  Website
// I  Contact Name
// J  Contact Email
// K  Automated Score
// L  Status
// M  AI Recommended Action
// N  Last Updated

function buildRow(app: Application): string[] {
  const lead = app.team[0];
  const contactName = lead ? `${lead.firstName} ${lead.lastName}`.trim() : "";
  const sector = app.company.markets?.split(",")[0]?.trim() ?? "";
  const aiAction = app.aiSummary?.recommendedAction ?? "";

  return [
    app.id,
    app.submittedAt,
    app.company.name,
    sector,
    app.company.stage,
    app.company.location,
    String(app.team.length),
    app.company.website,
    contactName,
    lead?.email ?? "",
    app.score !== null ? String(app.score) : "",
    app.status,
    aiAction,
    app.updatedAt,
  ];
}

// ── Auth helper ───────────────────────────────────────────────────────────────

function getAuth() {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!raw || raw === "'{}'" || raw === "{}") return null;

  let credentials: Record<string, unknown>;
  try {
    // Vercel may auto-parse the env var into an object; handle both cases.
    if (typeof raw === "object" && raw !== null) {
      credentials = raw as unknown as Record<string, unknown>;
    } else {
      // Strip wrapping single quotes that may come from shell assignment
      const cleaned = raw.startsWith("'") && raw.endsWith("'") ? raw.slice(1, -1) : raw;
      credentials = JSON.parse(cleaned);
    }
  } catch {
    console.error("[Sheets] Failed to parse GOOGLE_SERVICE_ACCOUNT_JSON");
    return null;
  }

  return new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

function getSheetId() {
  const id = process.env.GOOGLE_SHEET_ID;
  return id && id !== "''" ? id : null;
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Appends a new row for a freshly submitted application.
 * Silently no-ops if Sheets is not configured.
 */
export async function appendApplicationRow(app: Application): Promise<void> {
  const auth = getAuth();
  const sheetId = getSheetId();
  if (!auth || !sheetId) return;

  try {
    const sheets = google.sheets({ version: "v4", auth });
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: "Sheet1!A:N",
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [buildRow(app)] },
    });
  } catch (err) {
    console.error("[Sheets] appendApplicationRow failed:", err);
  }
}

/**
 * Finds the row where column A equals app.id and overwrites it.
 * If the row is not found (e.g. Sheets was added later), appends instead.
 * Silently no-ops if Sheets is not configured.
 */
export async function updateApplicationRow(app: Application): Promise<void> {
  const auth = getAuth();
  const sheetId = getSheetId();
  if (!auth || !sheetId) return;

  try {
    const sheets = google.sheets({ version: "v4", auth });

    // Read column A to find the matching row index
    const readRes = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Sheet1!A:A",
    });

    const colA = readRes.data.values ?? [];
    // Row indices are 1-based in Sheets; row 1 is the header
    const rowIndex = colA.findIndex((row) => row[0] === app.id);

    if (rowIndex <= 0) {
      // Not found (or found in header row) — append as a new row
      await appendApplicationRow(app);
      return;
    }

    const sheetRow = rowIndex + 1; // convert 0-based array index to 1-based sheet row
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range: `Sheet1!A${sheetRow}:N${sheetRow}`,
      valueInputOption: "USER_ENTERED",
      requestBody: { values: [buildRow(app)] },
    });
  } catch (err) {
    console.error("[Sheets] updateApplicationRow failed:", err);
  }
}

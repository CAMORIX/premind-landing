import { Resend } from "resend";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, fileUrl, description } = (await req.json()) as {
      name?: string;
      email?: string;
      fileUrl?: string;
      description?: string;
    };

    if (!name || !email || !fileUrl || !description) {
      return NextResponse.json(
        { error: "이름·이메일·자료 링크·설명은 필수입니다." },
        { status: 400 },
      );
    }

    try {
      new URL(fileUrl);
    } catch {
      return NextResponse.json(
        { error: "자료 링크는 올바른 URL이어야 합니다." },
        { status: 400 },
      );
    }

    const { error } = await resend.emails.send({
      from: "PREMIND 분석 요청 <onboarding@resend.dev>",
      to: "ceo@camorix.com",
      replyTo: email,
      subject: `[PREMIND 분석 요청] ${name}`,
      html: `
        <div style="font-family: -apple-system, sans-serif; max-width: 640px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
          <div style="background: #f97316; border-radius: 8px; padding: 6px 14px; display: inline-block; margin-bottom: 28px;">
            <span style="color: white; font-weight: 800; font-size: 13px; letter-spacing: 0.08em;">PREMIND · 분석 요청</span>
          </div>
          <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 24px; color: #111;">새 강의 분석 요청이 도착했습니다</h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; width: 110px; color: #888; font-size: 13px; font-weight: 600;">요청자</td>
              <td style="padding: 12px 0; font-size: 14px;">${escapeHtml(name)}</td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600;">이메일</td>
              <td style="padding: 12px 0; font-size: 14px;">
                <a href="mailto:${escapeHtml(email)}" style="color: #f97316;">${escapeHtml(email)}</a>
              </td>
            </tr>
            <tr style="border-bottom: 1px solid #f0f0f0;">
              <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600;">자료 링크</td>
              <td style="padding: 12px 0; font-size: 14px;">
                <a href="${escapeHtml(fileUrl)}" style="color: #f97316; word-break: break-all;">${escapeHtml(fileUrl)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600; vertical-align: top;">강의 설명</td>
              <td style="padding: 12px 0; font-size: 14px; line-height: 1.7; white-space: pre-line;">${escapeHtml(description)}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #bbb;">
            PREMIND · 주식회사 캐모릭스
          </div>
        </div>
      `,
    });

    if (error) {
      console.error("[analysis-request] resend error", error);
      return NextResponse.json(
        { error: "전송에 실패했습니다. 다시 시도해주세요." },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("[analysis-request]", e);
    return NextResponse.json(
      { error: "요청 처리 실패" },
      { status: 500 },
    );
  }
}

function escapeHtml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

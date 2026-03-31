import { Resend } from "resend";
import { NextResponse } from "next/server";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { name, company, email, message } = await req.json();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "필수 항목을 입력해주세요." }, { status: 400 });
  }

  const { error } = await resend.emails.send({
    from: "PREMIND 문의 <onboarding@resend.dev>",
    to: "ceo@camorix.com",
    replyTo: email,
    subject: `[PREMIND 도입 문의] ${company ? `${company} · ` : ""}${name}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 24px; color: #1a1a1a;">
        <div style="background: #f97316; border-radius: 8px; padding: 6px 14px; display: inline-block; margin-bottom: 28px;">
          <span style="color: white; font-weight: 800; font-size: 13px; letter-spacing: 0.08em;">PREMIND</span>
        </div>
        <h2 style="font-size: 22px; font-weight: 800; margin: 0 0 24px; color: #111;">새 도입 문의가 도착했습니다</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; width: 100px; color: #888; font-size: 13px; font-weight: 600;">이름</td>
            <td style="padding: 12px 0; font-size: 14px;">${name}</td>
          </tr>
          ${company ? `
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600;">기관/회사</td>
            <td style="padding: 12px 0; font-size: 14px;">${company}</td>
          </tr>` : ""}
          <tr style="border-bottom: 1px solid #f0f0f0;">
            <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600;">이메일</td>
            <td style="padding: 12px 0; font-size: 14px;"><a href="mailto:${email}" style="color: #f97316;">${email}</a></td>
          </tr>
          <tr>
            <td style="padding: 12px 0; color: #888; font-size: 13px; font-weight: 600; vertical-align: top;">문의 내용</td>
            <td style="padding: 12px 0; font-size: 14px; line-height: 1.7; white-space: pre-line;">${message}</td>
          </tr>
        </table>
        <div style="margin-top: 32px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #bbb;">
          PREMIND · 주식회사 캐모릭스
        </div>
      </div>
    `,
  });

  if (error) {
    return NextResponse.json({ error: "전송에 실패했습니다. 다시 시도해주세요." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

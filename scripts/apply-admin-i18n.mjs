import fs from "fs";
import path from "path";

const TITLE_MAP = {
  "User Management": "sidebar.user_management",
  "Doctor Management": "sidebar.doctor_management",
  "Trainer Management": "sidebar.trainer_management",
  "Service Category Management": "sidebar.service_category_management",
  "Content Management": "sidebar.content_management",
  "Challenge Management": "sidebar.challenge_management",
  "Commission Management": "sidebar.commission_management",
  "Commission Logs": "pages.commission_logs",
  "Yalla Coin Logs": "sidebar.yalla_coin_logs",
  "In App Coin Management": "pages.in_app_coin_management",
  "Subscription Management": "sidebar.subscription_management",
  "Subscription Logs": "pages.subscription_logs",
  "Payouts Management": "pages.payouts_management",
  "Payout Logs": "pages.payout_logs",
  "Appointment Logs": "sidebar.appointment_logs",
  "Booking Logs": "pages.booking_logs",
  "Reports Management": "sidebar.reports_management",
  "FAQs Management": "sidebar.faqs_management",
  "Query Management": "sidebar.query_management",
  "Complaint Management": "sidebar.complaint_management",
  "Payment Logs": "sidebar.payment_logs",
  "Notifications": "pages.notifications",
  "Chats": "pages.chats",
  "My Profile": "pages.my_profile",
  "Edit Profile": "pages.edit_profile",
  "Change Password": "pages.change_password",
  "Videos": "pages.videos",
  "Add Category": "pages.add_category",
  "Edit Category": "pages.edit_category",
  "View Category": "pages.view_category",
  "Add FAQs": "pages.add_faqs",
  "View Complain": "pages.view_complain",
  "View Query": "pages.view_query",
  "View Report": "pages.view_report",
  "User Post": "pages.user_post",
  "Trainer Services": "pages.trainer_services",
  "View Service": "pages.view_service",
  "Doctor Dashboard": "pages.doctor_dashboard",
  "Trainer Dashboard": "pages.trainer_dashboard",
  "Doctor Requests": "pages.doctor_requests",
  "Trainer Requests": "pages.trainer_requests",
  "Doctor Details": "pages.doctor_details",
  "Trainer Details": "pages.trainer_details",
  "User Details": "pages.user_details",
  "Doctor Request Details": "pages.doctor_request_details",
  "Trainer Request Details": "pages.trainer_request_details",
  "Challenges": "pages.challenges",
  "Set Amount Logs": "pages.set_amount_logs",
  "Appointment Details": "pages.appointment_details",
  "Plan Management": "pages.plan_management",
  "Total Earning": "pages.total_earning",
  "Total Bookings": "pages.total_bookings",
};

function walk(dir, files = []) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p, files);
    else if (p.endsWith(".jsx")) files.push(p);
  }
  return files;
}

const adminDir = "src/Pages/Admin";
const files = walk(adminDir);
let updated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, "utf8");
  if (file.includes("Dashboard/index.jsx") && content.includes("useTranslation")) continue;

  let changed = false;

  if (!content.includes("useTranslation")) {
    if (content.includes('from "react"')) {
      content = content.replace(
        /import React(,?\s*\{[^}]*\})?\s*from\s*["']react["'];?/,
        (m) => {
          if (m.includes("useEffect") || m.includes("useState")) {
            if (!m.includes("useTranslation")) {
              return m.replace(/\{([^}]*)\}/, (_, hooks) => {
                const h = hooks.trim();
                return `{ ${h}${h ? ", " : ""}useTranslation }`;
              });
            }
          }
          return `${m}\nimport { useTranslation } from "react-i18next";`;
        }
      );
    } else {
      content = `import { useTranslation } from "react-i18next";\n${content}`;
    }

    const fnMatch = content.match(
      /export\s+(?:const|function)\s+(\w+)\s*=?\s*\([^)]*\)\s*=>\s*\{/
    );
    if (fnMatch && !content.includes("const { t }")) {
      content = content.replace(
        fnMatch[0],
        `${fnMatch[0]}\n  const { t } = useTranslation();`
      );
    }
    changed = true;
  }

  for (const [text, key] of Object.entries(TITLE_MAP)) {
    const patterns = [
      new RegExp(`<h2 className="mainTitle[^"]*">\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h2>`, "g"),
      new RegExp(`<h2 className="mainTitle[^"]*"><BackButton2\\s*/>\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h2>`, "g"),
      new RegExp(`<h3 className="mainTitle[^"]*">\\s*${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*</h3>`, "g"),
      new RegExp(`pageTitle="${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
      new RegExp(`usePageTitle\\("${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\)`, "g"),
    ];
    for (const re of patterns) {
      if (re.test(content)) {
        content = content.replace(
          new RegExp(`>${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<`, "g"),
          `>{t('${key}')}<`
        );
        content = content.replace(
          new RegExp(`pageTitle="${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`, "g"),
          `pageTitle={t('${key}')}`
        );
        content = content.replace(
          new RegExp(`usePageTitle\\("${text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"\\)`, "g"),
          `usePageTitle(t('${key}'))`
        );
        changed = true;
      }
    }
  }

  if (changed) {
    fs.writeFileSync(file, content);
    updated++;
    console.log("Updated:", file);
  }
}

console.log(`Done. Updated ${updated} files.`);

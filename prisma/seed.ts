import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/auth/password";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Starting database seed...");

  // ---------------------------------------------------------
  // Clean existing development data
  // ---------------------------------------------------------
  await prisma.followUp.deleteMany();
  await prisma.note.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.user.deleteMany();

  // ---------------------------------------------------------
  // Demo user
  // ---------------------------------------------------------
  const passwordHash = await hashPassword("password123");

const user = await prisma.user.create({
  data: {
    name: "Raj Yash Gupta",
    email: "raj@minicrm.dev",
    passwordHash,
  },
});

  console.log(`✓ Created user: ${user.email}`);

  // ---------------------------------------------------------
  // Dates
  // ---------------------------------------------------------
  const now = new Date();

  const daysFromNow = (days: number, hour = 10) => {
    const date = new Date(now);
    date.setDate(date.getDate() + days);
    date.setHours(hour, 0, 0, 0);
    return date;
  };

  // ---------------------------------------------------------
  // Leads
  // ---------------------------------------------------------
  const leads = [
    {
      name: "Aarav Mehta",
      email: "aarav.mehta@novatech.in",
      phone: "+91 98765 43210",
      source: "WEBSITE" as const,
      status: "NEW" as const,
      notes:
        "Interested in understanding our product offering. Requested an introductory call.",
      followUpAt: daysFromNow(1, 11),
    },
    {
      name: "Priya Sharma",
      email: "priya.sharma@brightlabs.io",
      phone: "+91 98123 45678",
      source: "LINKEDIN" as const,
      status: "NEW" as const,
      notes: "Connected through LinkedIn. Waiting for requirements from their team.",
      followUpAt: daysFromNow(3, 14),
    },
    {
      name: "Rohan Kapoor",
      email: "rohan@vertexsystems.com",
      phone: "+91 99887 66554",
      source: "REFERRAL" as const,
      status: "NEW" as const,
      notes: "Referred by an existing contact. Good initial interest.",
      followUpAt: daysFromNow(2, 10),
    },
    {
      name: "Sneha Iyer",
      email: "sneha.iyer@cloudbridge.co",
      phone: "+91 98450 12345",
      source: "INSTAGRAM" as const,
      status: "NEW" as const,
      notes: "Reached out after seeing our product post.",
      followUpAt: null,
    },
    {
      name: "Karan Malhotra",
      email: "karan@orbitworks.in",
      phone: "+91 98711 22334",
      source: "COLD_OUTREACH" as const,
      status: "NEW" as const,
      notes: "Outbound prospect. Initial email sent.",
      followUpAt: daysFromNow(-1, 15),
    },
    {
      name: "Ananya Rao",
      email: "ananya.rao@pixelcraft.in",
      phone: "+91 99800 11223",
      source: "WEBSITE" as const,
      status: "NEW" as const,
      notes: "Submitted a detailed enquiry through the website.",
      followUpAt: daysFromNow(5, 11),
    },
    {
      name: "Vikram Singh",
      email: "vikram@northstartech.io",
      phone: "+91 99100 44556",
      source: "LINKEDIN" as const,
      status: "NEW" as const,
      notes: "Interested in a product walkthrough.",
      followUpAt: null,
    },
    {
      name: "Meera Nair",
      email: "meera.nair@finpeak.in",
      phone: "+91 98470 55667",
      source: "REFERRAL" as const,
      status: "NEW" as const,
      notes: "Warm referral. Decision maker is reviewing options.",
      followUpAt: daysFromNow(4, 16),
    },

    {
      name: "Aditya Verma",
      email: "aditya.verma@techforge.in",
      phone: "+91 98200 77889",
      source: "WEBSITE" as const,
      status: "CONTACTED" as const,
      notes: "Had an initial discovery call. Evaluating internal requirements.",
      followUpAt: daysFromNow(1, 13),
    },
    {
      name: "Neha Agarwal",
      email: "neha@marketgrid.io",
      phone: "+91 98730 11224",
      source: "LINKEDIN" as const,
      status: "CONTACTED" as const,
      notes: "Demo completed. Sent pricing and product information.",
      followUpAt: daysFromNow(2, 12),
    },
    {
      name: "Arjun Desai",
      email: "arjun.desai@scaleup.co",
      phone: "+91 98251 33445",
      source: "COLD_OUTREACH" as const,
      status: "CONTACTED" as const,
      notes: "Responded positively to outreach. Needs a follow-up with their operations team.",
      followUpAt: daysFromNow(-2, 11),
    },
    {
      name: "Ishita Sen",
      email: "ishita@greenfieldlabs.in",
      phone: "+91 98310 66778",
      source: "REFERRAL" as const,
      status: "CONTACTED" as const,
      notes: "Discovery call completed. Comparing two solutions.",
      followUpAt: daysFromNow(6, 15),
    },
    {
      name: "Rahul Bansal",
      email: "rahul@apexdigital.in",
      phone: "+91 98100 99887",
      source: "INSTAGRAM" as const,
      status: "CONTACTED" as const,
      notes: "Social media lead. Requested pricing information.",
      followUpAt: null,
    },
    {
      name: "Tanya Kapoor",
      email: "tanya.kapoor@blueorbit.io",
      phone: "+91 98990 22334",
      source: "WEBSITE" as const,
      status: "CONTACTED" as const,
      notes: "Product demo completed. Follow-up pending.",
      followUpAt: daysFromNow(3, 10),
    },

    {
      name: "Siddharth Jain",
      email: "sid.jain@finstack.in",
      phone: "+91 98111 44556",
      source: "REFERRAL" as const,
      status: "NEGOTIATING" as const,
      notes:
        "Strong product fit. Discussing pricing, onboarding timeline, and support requirements.",
      followUpAt: daysFromNow(1, 10),
    },
    {
      name: "Pooja Menon",
      email: "pooja@eduvantage.in",
      phone: "+91 99460 77889",
      source: "WEBSITE" as const,
      status: "NEGOTIATING" as const,
      notes:
        "Commercial discussion underway. Waiting for final approval from finance.",
      followUpAt: daysFromNow(-1, 14),
    },
    {
      name: "Manish Gupta",
      email: "manish.gupta@retailnext.io",
      phone: "+91 98180 11223",
      source: "COLD_OUTREACH" as const,
      status: "NEGOTIATING" as const,
      notes:
        "Interested in moving forward. Negotiating implementation scope and pricing.",
      followUpAt: daysFromNow(2, 16),
    },
    {
      name: "Divya Krishnan",
      email: "divya@healthsync.in",
      phone: "+91 98470 88990",
      source: "LINKEDIN" as const,
      status: "NEGOTIATING" as const,
      notes:
        "Final stage of evaluation. Procurement team has requested contract details.",
      followUpAt: daysFromNow(4, 11),
    },
    {
      name: "Nikhil Joshi",
      email: "nikhil@quantumworks.io",
      phone: "+91 98210 33445",
      source: "REFERRAL" as const,
      status: "NEGOTIATING" as const,
      notes: "Verbal approval received. Waiting for purchase order.",
      followUpAt: daysFromNow(1, 15),
    },

    {
      name: "Simran Kaur",
      email: "simran@alphacore.in",
      phone: "+91 98720 55667",
      source: "WEBSITE" as const,
      status: "CLOSED" as const,
      notes: "Deal successfully closed. Onboarding scheduled.",
      followUpAt: daysFromNow(7, 11),
    },
    {
      name: "Dev Patel",
      email: "dev.patel@launchpad.io",
      phone: "+91 98250 66778",
      source: "REFERRAL" as const,
      status: "CLOSED" as const,
      notes: "Converted after product demonstration and pricing discussion.",
      followUpAt: null,
    },
    {
      name: "Kavya Reddy",
      email: "kavya@insightlabs.in",
      phone: "+91 99890 11223",
      source: "LINKEDIN" as const,
      status: "CLOSED" as const,
      notes: "Closed successfully. Customer requested implementation support.",
      followUpAt: daysFromNow(10, 14),
    },
    {
      name: "Yash Agarwal",
      email: "yash@cloudnest.io",
      phone: "+91 99100 77889",
      source: "COLD_OUTREACH" as const,
      status: "CLOSED" as const,
      notes: "Converted from outbound campaign.",
      followUpAt: null,
    },
    {
      name: "Riya Chatterjee",
      email: "riya@modernstack.in",
      phone: "+91 98300 44556",
      source: "INSTAGRAM" as const,
      status: "CLOSED" as const,
      notes: "Converted after social media enquiry and product demo.",
      followUpAt: daysFromNow(14, 12),
    },
  ];

  const createdLeads = [];

  for (const leadData of leads) {
    const lead = await prisma.lead.create({
      data: {
        ...leadData,
        createdById: user.id,
      },
    });

    createdLeads.push(lead);
  }

  console.log(`✓ Created ${createdLeads.length} leads`);

  // ---------------------------------------------------------
  // Notes
  // ---------------------------------------------------------
  const notes = [
    {
      leadIndex: 0,
      content:
        "Lead came through the website contact form. Asked about pricing and implementation timeline.",
    },
    {
      leadIndex: 1,
      content:
        "Connected with Priya on LinkedIn. She mentioned that the team is currently evaluating CRM solutions.",
    },
    {
      leadIndex: 8,
      content:
        "Discovery call completed. Their primary requirement is simplifying lead tracking across the sales team.",
    },
    {
      leadIndex: 9,
      content:
        "Demo went well. Shared pricing document and product overview after the call.",
    },
    {
      leadIndex: 15,
      content:
        "Customer is highly interested. Main discussion is around pricing and onboarding support.",
    },
    {
      leadIndex: 16,
      content:
        "Finance team is reviewing the commercial proposal. Follow up before the end of the week.",
    },
    {
      leadIndex: 20,
      content:
        "Deal closed successfully. Customer is ready for onboarding.",
    },
  ];

  for (const note of notes) {
    await prisma.note.create({
      data: {
        content: note.content,
        leadId: createdLeads[note.leadIndex].id,
        createdById: user.id,
      },
    });
  }

  console.log(`✓ Created ${notes.length} notes`);

  // ---------------------------------------------------------
  // Follow-ups
  // ---------------------------------------------------------
  const followUps = [
    {
      leadIndex: 0,
      dueAt: daysFromNow(1, 11),
      note: "Follow up after initial enquiry.",
    },
    {
      leadIndex: 1,
      dueAt: daysFromNow(3, 14),
      note: "Ask for requirements and schedule discovery call.",
    },
    {
      leadIndex: 2,
      dueAt: daysFromNow(2, 10),
      note: "Contact referral and understand requirements.",
    },
    {
      leadIndex: 4,
      dueAt: daysFromNow(-1, 15),
      note: "Follow up on outbound email.",
    },
    {
      leadIndex: 8,
      dueAt: daysFromNow(1, 13),
      note: "Discuss implementation requirements.",
    },
    {
      leadIndex: 9,
      dueAt: daysFromNow(2, 12),
      note: "Check feedback on pricing proposal.",
    },
    {
      leadIndex: 10,
      dueAt: daysFromNow(-2, 11),
      note: "Reconnect after initial outreach.",
    },
    {
      leadIndex: 11,
      dueAt: daysFromNow(6, 15),
      note: "Check whether they have completed their internal evaluation.",
    },
    {
      leadIndex: 15,
      dueAt: daysFromNow(1, 10),
      note: "Continue pricing discussion.",
    },
    {
      leadIndex: 16,
      dueAt: daysFromNow(-1, 14),
      note: "Check finance approval.",
    },
    {
      leadIndex: 17,
      dueAt: daysFromNow(2, 16),
      note: "Discuss implementation scope.",
    },
    {
      leadIndex: 18,
      dueAt: daysFromNow(4, 11),
      note: "Send procurement documentation.",
    },
    {
      leadIndex: 19,
      dueAt: daysFromNow(1, 15),
      note: "Follow up regarding purchase order.",
    },
    {
      leadIndex: 20,
      dueAt: daysFromNow(7, 11),
      note: "Check onboarding progress.",
    },
    {
      leadIndex: 22,
      dueAt: daysFromNow(10, 14),
      note: "Schedule customer success check-in.",
    },
    {
      leadIndex: 23,
      dueAt: daysFromNow(14, 12),
      note: "Post-sale customer check-in.",
    },
  ];

  for (const followUp of followUps) {
    await prisma.followUp.create({
      data: {
        dueAt: followUp.dueAt,
        note: followUp.note,
        leadId: createdLeads[followUp.leadIndex].id,
        createdById: user.id,
      },
    });
  }

  // ---------------------------------------------------------
  // Completed follow-ups
  // ---------------------------------------------------------
  await prisma.followUp.create({
    data: {
      dueAt: daysFromNow(-5, 11),
      completedAt: daysFromNow(-4, 15),
      note: "Completed initial discovery call.",
      leadId: createdLeads[8].id,
      createdById: user.id,
    },
  });

  await prisma.followUp.create({
    data: {
      dueAt: daysFromNow(-3, 12),
      completedAt: daysFromNow(-2, 16),
      note: "Completed product demonstration.",
      leadId: createdLeads[9].id,
      createdById: user.id,
    },
  });

  await prisma.followUp.create({
    data: {
      dueAt: daysFromNow(-7, 10),
      completedAt: daysFromNow(-6, 13),
      note: "Customer confirmed interest.",
      leadId: createdLeads[15].id,
      createdById: user.id,
    },
  });

  console.log("✓ Created follow-ups");

  console.log("");
  console.log("🎉 Database seed completed successfully!");
  console.log("");
  console.log("Demo login:");
  console.log("Email:    raj@minicrm.dev");
  console.log("Password: password123");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
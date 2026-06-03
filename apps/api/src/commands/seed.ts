import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as argon2 from 'argon2';

async function main() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log('Seeding database…');

    // Clean existing data in dependency order
    await prisma.tagOnCompany.deleteMany();
    await prisma.tagOnDeal.deleteMany();
    await prisma.tagOnContact.deleteMany();
    await prisma.activity.deleteMany();
    await prisma.note.deleteMany();
    await prisma.task.deleteMany();
    await prisma.deal.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.company.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    // ── Users ──
    const password = await argon2.hash('password123');
    const admin = await prisma.user.create({
      data: { email: 'admin@crm.dev', name: 'Admin User', hashedPassword: password, role: 'ADMIN' },
    });
    const manager = await prisma.user.create({
      data: { email: 'manager@crm.dev', name: 'Manager User', hashedPassword: password, role: 'MANAGER' },
    });
    const member = await prisma.user.create({
      data: { email: 'member@crm.dev', name: 'Member User', hashedPassword: password, role: 'MEMBER' },
    });

    console.log(`  Created ${3} users`);

    // ── Companies ──
    const acme = await prisma.company.create({
      data: { name: 'Acme Corp', domain: 'acme.com', notes: 'Leading provider of industrial supplies' },
    });
    const globex = await prisma.company.create({
      data: { name: 'Globex Inc.', domain: 'globex.io', notes: 'Global technology solutions' },
    });
    const initech = await prisma.company.create({
      data: { name: 'Initech', domain: 'initech.com', notes: 'Software development and consulting' },
    });

    console.log(`  Created ${3} companies`);

    // ── Contacts ──
    const alice = await prisma.contact.create({
      data: {
        firstName: 'Alice', lastName: 'Johnson', email: 'alice@acme.com', phone: '+1-555-0101',
        title: 'CTO', status: 'ACTIVE', source: 'Referral', userId: member.id, companyId: acme.id,
      },
    });
    const bob = await prisma.contact.create({
      data: {
        firstName: 'Bob', lastName: 'Smith', email: 'bob@globex.io', phone: '+1-555-0102',
        title: 'VP Engineering', status: 'ACTIVE', source: 'Website', userId: member.id, companyId: globex.id,
      },
    });
    const carol = await prisma.contact.create({
      data: {
        firstName: 'Carol', lastName: 'Williams', email: 'carol@initech.com', phone: '+1-555-0103',
        title: 'CEO', status: 'LEAD', source: 'Conference', userId: manager.id, companyId: initech.id,
      },
    });
    const dave = await prisma.contact.create({
      data: {
        firstName: 'Dave', lastName: 'Brown', email: 'dave@acme.com', phone: '+1-555-0104',
        title: 'Engineering Manager', status: 'ACTIVE', source: 'Referral', userId: manager.id, companyId: acme.id,
      },
    });
    const eve = await prisma.contact.create({
      data: {
        firstName: 'Eve', lastName: 'Davis', email: 'eve@globex.io', phone: '+1-555-0105',
        title: 'Product Manager', status: 'INACTIVE', source: 'LinkedIn', userId: member.id, companyId: globex.id,
      },
    });
    const frank = await prisma.contact.create({
      data: {
        firstName: 'Frank', lastName: 'Miller', email: 'frank@initech.com',
        title: 'Lead Developer', status: 'LEAD', source: 'Cold Outreach', userId: member.id, companyId: initech.id,
      },
    });

    console.log(`  Created ${6} contacts`);

    // ── Deals ──
    const deal1 = await prisma.deal.create({
      data: {
        title: 'Acme Infrastructure Upgrade', value: 150000, stage: 'NEGOTIATION',
        closeDate: new Date('2026-07-15'), description: 'Complete infrastructure modernization',
        userId: member.id, contactId: alice.id, companyId: acme.id,
      },
    });
    const deal2 = await prisma.deal.create({
      data: {
        title: 'Globex SaaS Platform', value: 280000, stage: 'PROPOSAL',
        closeDate: new Date('2026-08-01'), description: 'Custom SaaS platform development',
        userId: manager.id, contactId: bob.id, companyId: globex.id,
      },
    });
    const deal3 = await prisma.deal.create({
      data: {
        title: 'Initech Consulting Retainer', value: 75000, stage: 'QUALIFIED',
        closeDate: new Date('2026-06-30'), description: 'Monthly consulting retainer',
        userId: member.id, contactId: carol.id, companyId: initech.id,
      },
    });
    const deal4 = await prisma.deal.create({
      data: {
        title: 'Acme Security Audit', value: 45000, stage: 'NEW',
        closeDate: new Date('2026-09-01'), description: 'Security audit and compliance review',
        userId: manager.id, contactId: dave.id, companyId: acme.id,
      },
    });
    const deal5 = await prisma.deal.create({
      data: {
        title: 'Globex Mobile App', value: 120000, stage: 'CLOSED_WON',
        closeDate: new Date('2026-05-15'), description: 'Cross-platform mobile application',
        userId: member.id, contactId: eve.id, companyId: globex.id,
      },
    });

    console.log(`  Created ${5} deals`);

    // ── Tasks ──
    await prisma.task.createMany({
      data: [
        { title: 'Schedule kickoff meeting with Acme', dueDate: new Date('2026-06-10'), userId: member.id, contactId: alice.id, dealId: deal1.id },
        { title: 'Send proposal to Globex', dueDate: new Date('2026-06-15'), userId: manager.id, contactId: bob.id, dealId: deal2.id },
        { title: 'Review Initech requirements', dueDate: new Date('2026-06-20'), userId: member.id, contactId: carol.id, dealId: deal3.id },
        { title: 'Prepare security audit scope', dueDate: new Date('2026-06-25'), completed: true, userId: manager.id, contactId: dave.id, dealId: deal4.id },
        { title: 'Follow up with Eve on mobile app launch', dueDate: new Date('2026-07-01'), userId: member.id, contactId: eve.id, dealId: deal5.id },
      ],
    });

    console.log(`  Created ${5} tasks`);

    // ── Notes ──
    await prisma.note.createMany({
      data: [
        { content: 'Alice is very interested in the infrastructure upgrade. She mentioned they have budget approved for Q3.', userId: member.id, contactId: alice.id, dealId: deal1.id },
        { content: 'Globex needs a detailed technical proposal before they can move forward. Bob wants to see case studies.', userId: manager.id, contactId: bob.id, dealId: deal2.id },
        { content: 'Carol is evaluating multiple vendors. We need to differentiate our offering.', userId: member.id, contactId: carol.id, dealId: deal3.id },
        { content: 'Dave requested references from similar security audit engagements.', userId: manager.id, contactId: dave.id, dealId: deal4.id },
      ],
    });

    console.log(`  Created ${4} notes`);

    // ── Activities ──
    await prisma.activity.createMany({
      data: [
        { type: 'CALL', subject: 'Initial discovery call with Alice', details: 'Discussed infrastructure needs and timeline', occurredAt: new Date('2026-05-20'), userId: member.id, contactId: alice.id, dealId: deal1.id, companyId: acme.id },
        { type: 'EMAIL', subject: 'Sent proposal to Globex', details: 'Sent detailed proposal via email', occurredAt: new Date('2026-05-22'), userId: manager.id, contactId: bob.id, dealId: deal2.id, companyId: globex.id },
        { type: 'MEETING', subject: 'Initech product demo', details: 'Conducted product demo for Carol and team', occurredAt: new Date('2026-05-25'), userId: member.id, contactId: carol.id, dealId: deal3.id, companyId: initech.id },
        { type: 'SYSTEM', subject: 'Deal stage changed to NEGOTIATION', details: 'Acme Infrastructure Upgrade moved to negotiation', occurredAt: new Date('2026-05-28'), userId: member.id, dealId: deal1.id, companyId: acme.id },
      ],
    });

    console.log(`  Created ${4} activities`);

    // ── Tags ──
    const vip = await prisma.tag.create({ data: { name: 'VIP', color: '#f59e0b' } });
    const hot = await prisma.tag.create({ data: { name: 'Hot Lead', color: '#ef4444' } });
    const partner = await prisma.tag.create({ data: { name: 'Partner', color: '#3b82f6' } });
    const tech = await prisma.tag.create({ data: { name: 'Technology', color: '#8b5cf6' } });
    const finance = await prisma.tag.create({ data: { name: 'Finance', color: '#10b981' } });

    console.log(`  Created ${5} tags`);

    // ── Tag Associations ──
    await prisma.tagOnContact.createMany({
      data: [
        { contactId: alice.id, tagId: vip.id },
        { contactId: alice.id, tagId: tech.id },
        { contactId: bob.id, tagId: hot.id },
        { contactId: carol.id, tagId: partner.id },
        { contactId: dave.id, tagId: tech.id },
        { contactId: frank.id, tagId: hot.id },
      ],
    });

    await prisma.tagOnDeal.createMany({
      data: [
        { dealId: deal1.id, tagId: tech.id },
        { dealId: deal2.id, tagId: tech.id },
        { dealId: deal3.id, tagId: partner.id },
        { dealId: deal4.id, tagId: finance.id },
        { dealId: deal5.id, tagId: hot.id },
      ],
    });

    await prisma.tagOnCompany.createMany({
      data: [
        { companyId: acme.id, tagId: partner.id },
        { companyId: globex.id, tagId: tech.id },
        { companyId: initech.id, tagId: tech.id },
      ],
    });

    console.log(`  Created ${6 + 5 + 3} tag associations`);

    console.log('Seed complete!');
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

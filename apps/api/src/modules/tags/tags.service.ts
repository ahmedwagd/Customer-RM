import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTagDto) {
    const existing = await this.prisma.tag.findUnique({ where: { name: dto.name } });
    if (existing) throw new ConflictException('Tag name already exists');
    return this.prisma.tag.create({ data: dto });
  }

  async findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { contacts: true, deals: true, companies: true } },
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        contacts: { include: { contact: { select: { id: true, firstName: true, lastName: true } } } },
        deals: { include: { deal: { select: { id: true, title: true } } } },
        companies: { include: { company: { select: { id: true, name: true } } } },
      },
    });
    if (!tag) throw new NotFoundException('Tag not found');
    return tag;
  }

  async update(id: string, dto: UpdateTagDto) {
    if (dto.name) {
      const existing = await this.prisma.tag.findUnique({ where: { name: dto.name } });
      if (existing && existing.id !== id) {
        throw new ConflictException('Tag name already exists');
      }
    }
    return this.prisma.tag.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }

  async attachToContact(tagId: string, contactId: string) {
    await this.findOne(tagId);
    const contact = await this.prisma.contact.findUnique({ where: { id: contactId } });
    if (!contact) throw new NotFoundException('Contact not found');
    try {
      return await this.prisma.tagOnContact.create({ data: { tagId, contactId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag already attached to this contact');
      }
      throw e;
    }
  }

  async detachFromContact(tagId: string, contactId: string) {
    await this.findOne(tagId);
    try {
      return await this.prisma.tagOnContact.delete({
        where: { contactId_tagId: { contactId, tagId } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Tag not attached to this contact');
      }
      throw e;
    }
  }

  async attachToDeal(tagId: string, dealId: string) {
    await this.findOne(tagId);
    const deal = await this.prisma.deal.findUnique({ where: { id: dealId } });
    if (!deal) throw new NotFoundException('Deal not found');
    try {
      return await this.prisma.tagOnDeal.create({ data: { tagId, dealId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag already attached to this deal');
      }
      throw e;
    }
  }

  async detachFromDeal(tagId: string, dealId: string) {
    await this.findOne(tagId);
    try {
      return await this.prisma.tagOnDeal.delete({
        where: { dealId_tagId: { dealId, tagId } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Tag not attached to this deal');
      }
      throw e;
    }
  }

  async attachToCompany(tagId: string, companyId: string) {
    await this.findOne(tagId);
    const company = await this.prisma.company.findUnique({ where: { id: companyId } });
    if (!company) throw new NotFoundException('Company not found');
    try {
      return await this.prisma.tagOnCompany.create({ data: { tagId, companyId } });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new ConflictException('Tag already attached to this company');
      }
      throw e;
    }
  }

  async detachFromCompany(tagId: string, companyId: string) {
    await this.findOne(tagId);
    try {
      return await this.prisma.tagOnCompany.delete({
        where: { companyId_tagId: { companyId, tagId } },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
        throw new NotFoundException('Tag not attached to this company');
      }
      throw e;
    }
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDealDto } from './dto/create-deal.dto';
import { UpdateDealDto } from './dto/update-deal.dto';
import { QueryDealDto } from './dto/query-deal.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class DealsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDealDto, userId: string) {
    return this.prisma.deal.create({
      data: { ...dto, userId },
      include: {
        contact: true,
        company: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async findAll(query: QueryDealDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, sortBy, sortOrder, stage, userId, contactId, companyId } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (stage) where.stage = stage;
    if (userId) where.userId = userId;
    if (contactId) where.contactId = contactId;
    if (companyId) where.companyId = companyId;

    const [data, total] = await Promise.all([
      this.prisma.deal.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : { createdAt: 'desc' },
        include: { contact: true, company: true, user: { select: { id: true, name: true, email: true } } },
      }),
      this.prisma.deal.count({ where }),
    ]);

    return {
      data,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string) {
    const deal = await this.prisma.deal.findUnique({
      where: { id },
      include: {
        contact: true,
        company: true,
        user: { select: { id: true, name: true, email: true } },
        tasks: true,
        notes: true,
        activities: true,
        tags: { include: { tag: true } },
      },
    });
    if (!deal) throw new NotFoundException('Deal not found');
    return deal;
  }

  async update(id: string, dto: UpdateDealDto) {
    return this.prisma.deal.update({
      where: { id },
      data: dto,
      include: {
        contact: true,
        company: true,
        tags: { include: { tag: true } },
      },
    });
  }

  async remove(id: string) {
    return this.prisma.deal.delete({ where: { id } });
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { QueryCompanyDto } from './dto/query-company.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class CompaniesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCompanyDto) {
    return this.prisma.company.create({
      data: dto,
      include: { tags: { include: { tag: true } } },
    });
  }

  async findAll(query: QueryCompanyDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, sortBy, sortOrder, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const [data, total] = await Promise.all([
      this.prisma.company.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : { createdAt: 'desc' },
        include: { _count: { select: { contacts: true, deals: true } } },
      }),
      this.prisma.company.count({ where }),
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
    const company = await this.prisma.company.findUnique({
      where: { id },
      include: {
        contacts: true,
        deals: true,
        activities: true,
        tags: { include: { tag: true } },
      },
    });
    if (!company) throw new NotFoundException('Company not found');
    return company;
  }

  async update(id: string, dto: UpdateCompanyDto) {
    return this.prisma.company.update({
      where: { id },
      data: dto,
      include: { tags: { include: { tag: true } } },
    });
  }

  async remove(id: string) {
    return this.prisma.company.delete({ where: { id } });
  }
}

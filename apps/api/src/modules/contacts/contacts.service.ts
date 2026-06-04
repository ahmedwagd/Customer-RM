import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { QueryContactDto } from './dto/query-contact.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class ContactsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateContactDto, userId: string) {
    return this.prisma.contact.create({
      data: { ...dto, userId },
      include: { company: true, tags: { include: { tag: true } } },
    });
  }

  async findAll(query: QueryContactDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, sortBy, sortOrder, status, companyId, search } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (status) where.status = status;
    if (companyId) where.companyId = companyId;
    if (search) {
      where.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [data, total] = await Promise.all([
      this.prisma.contact.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : { createdAt: 'desc' },
        include: { company: true, tags: { include: { tag: true } } },
      }),
      this.prisma.contact.count({ where }),
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
    const contact = await this.prisma.contact.findUnique({
      where: { id },
      include: {
        company: true,
        deals: true,
        tasks: true,
        notes: true,
        activities: true,
        tags: { include: { tag: true } },
      },
    });
    if (!contact) throw new NotFoundException('Contact not found');
    return contact;
  }

  async update(id: string, dto: UpdateContactDto) {
    return this.prisma.contact.update({
      where: { id },
      data: dto,
      include: { company: true, tags: { include: { tag: true } } },
    });
  }

  async remove(id: string) {
    return this.prisma.contact.delete({ where: { id } });
  }
}

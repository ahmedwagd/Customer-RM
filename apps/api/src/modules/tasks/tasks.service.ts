import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { QueryTaskDto } from './dto/query-task.dto';
import { PaginatedResult } from '../../common/dto/pagination.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateTaskDto, userId: string) {
    return this.prisma.task.create({
      data: { ...dto, userId },
      include: { contact: true, deal: true, user: { select: { id: true, name: true } } },
    });
  }

  async findAll(query: QueryTaskDto): Promise<PaginatedResult<any>> {
    const { page = 1, limit = 20, sortBy, sortOrder, completed, userId, contactId, dealId, dueDate } = query;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (completed !== undefined) where.completed = completed;
    if (userId) where.userId = userId;
    if (contactId) where.contactId = contactId;
    if (dealId) where.dealId = dealId;
    if (dueDate) where.dueDate = dueDate;

    const [data, total] = await Promise.all([
      this.prisma.task.findMany({
        where,
        skip,
        take: limit,
        orderBy: sortBy ? { [sortBy]: sortOrder ?? 'asc' } : { createdAt: 'desc' },
        include: { contact: { select: { id: true, firstName: true, lastName: true } }, user: { select: { id: true, name: true } } },
      }),
      this.prisma.task.count({ where }),
    ]);

    return {
      data,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        contact: { select: { id: true, firstName: true, lastName: true } },
        deal: { select: { id: true, title: true } },
        user: { select: { id: true, name: true } },
      },
    });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, dto: UpdateTaskDto) {
    return this.prisma.task.update({
      where: { id },
      data: dto,
      include: { contact: true, deal: true, user: { select: { id: true, name: true } } },
    });
  }

  async remove(id: string) {
    return this.prisma.task.delete({ where: { id } });
  }
}

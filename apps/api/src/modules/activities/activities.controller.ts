import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { CurrentUserType } from '../../common/decorators/current-user.decorator';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';
import { QueryActivityDto } from './dto/query-activity.dto';

@ApiTags('Activities')
@Controller('activities')
@UseGuards(JwtAuthGuard)
export class ActivitiesController {
  constructor(private readonly service: ActivitiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create an activity' })
  create(@Body() dto: CreateActivityDto, @CurrentUser() user: CurrentUserType) {
    return this.service.create(dto, user.id);
  }

  @Get()
  @ApiOperation({ summary: 'List activities (filterable by type, entity, date range)' })
  findAll(@Query() query: QueryActivityDto) {
    return this.service.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get activity by id' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an activity' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}

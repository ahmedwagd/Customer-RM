import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { TagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@ApiTags('Tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
export class TagsController {
  constructor(private readonly service: TagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a tag' })
  create(@Body() dto: CreateTagDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tags' })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get tag by id with relations' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a tag' })
  update(@Param('id') id: string, @Body() dto: UpdateTagDto) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Post(':tagId/contacts/:contactId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Attach tag to contact' })
  attachToContact(
    @Param('tagId') tagId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.service.attachToContact(tagId, contactId);
  }

  @Delete(':tagId/contacts/:contactId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach tag from contact' })
  detachFromContact(
    @Param('tagId') tagId: string,
    @Param('contactId') contactId: string,
  ) {
    return this.service.detachFromContact(tagId, contactId);
  }

  @Post(':tagId/deals/:dealId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Attach tag to deal' })
  attachToDeal(
    @Param('tagId') tagId: string,
    @Param('dealId') dealId: string,
  ) {
    return this.service.attachToDeal(tagId, dealId);
  }

  @Delete(':tagId/deals/:dealId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach tag from deal' })
  detachFromDeal(
    @Param('tagId') tagId: string,
    @Param('dealId') dealId: string,
  ) {
    return this.service.detachFromDeal(tagId, dealId);
  }

  @Post(':tagId/companies/:companyId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Attach tag to company' })
  attachToCompany(
    @Param('tagId') tagId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.service.attachToCompany(tagId, companyId);
  }

  @Delete(':tagId/companies/:companyId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Detach tag from company' })
  detachFromCompany(
    @Param('tagId') tagId: string,
    @Param('companyId') companyId: string,
  ) {
    return this.service.detachFromCompany(tagId, companyId);
  }
}

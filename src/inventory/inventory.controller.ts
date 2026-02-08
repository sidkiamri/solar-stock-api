import { Controller, Post, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('inventory')
@UseGuards(JwtAuthGuard) // This LOCKS all stock routes. No token = No access.
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async add(@Body() body: any, @Req() req) {
    // req.user.userId comes from the Token!
    return this.inventoryService.create(body, req.user.userId);
  }

  @Get()
  async get(@Req() req) {
    // Returns only items for THIS user
    return this.inventoryService.findAll(req.user.userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body('quantity') quantity: number, @Req() req) {
    return this.inventoryService.updateQuantity(id, quantity, req.user.userId);
  }

  @Get('history')
  async getHistory(@Req() req) {
    return this.inventoryService.getHistory(req.user.userId);
  }
}
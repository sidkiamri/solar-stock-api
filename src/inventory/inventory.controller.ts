import { Controller, Post, Get, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { InventoryService } from './inventory.service';

@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async add(@Body() body: any) {
    // For the prototype, we pass the userId in the body. 
    // In a final app, we extract it from the JWT Token.
    return this.inventoryService.create(body, body.userId);
  }

  @Get(':userId')
  async get(@Param('userId') userId: string) {
    return this.inventoryService.findAll(userId);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body('quantity') quantity: number) {
    return this.inventoryService.updateQuantity(id, quantity);
  }
}
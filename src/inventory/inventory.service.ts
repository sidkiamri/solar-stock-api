import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { InventoryGateway } from './inventory.gateway';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    private gateway: InventoryGateway,
  ) {}

  async create(data: any, userId: string) {
    const newItem = new this.inventoryModel({ ...data, owner: userId });
    const saved = await newItem.save();
    
    // Notify all connected apps (Mobile/Desktop)
    this.gateway.broadcastUpdate(saved);
    return saved;
  }

  async findAll(userId: string) {
    return this.inventoryModel.find({ owner: userId }).exec();
  }

  async updateQuantity(id: string, qty: number) {
    const updated = await this.inventoryModel.findByIdAndUpdate(
      id, 
      { quantity: qty }, 
      { new: true }
    );
    this.gateway.broadcastUpdate(updated);
    return updated;
  }
}
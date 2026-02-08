import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inventory } from './schemas/inventory.schema';
import { StockHistory } from './schemas/history.schema'; // Make sure to create this schema
import { Project } from './schemas/project.schema';      // Make sure to create this schema
import { InventoryGateway } from './inventory.gateway';

@Injectable()
export class InventoryService {
  constructor(
    @InjectModel(Inventory.name) private inventoryModel: Model<Inventory>,
    @InjectModel(StockHistory.name) private historyModel: Model<StockHistory>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    private gateway: InventoryGateway,
  ) {}

  // 1. Create - Matches Slide 15: "Ajout des équipements"
  async create(data: any, userId: string) {
    const newItem = new this.inventoryModel({ ...data, owner: userId });
    const saved = await newItem.save();
    
    // STRATEGIC ADDITION: Log Initial History (Slide 15: Historique)
    await new this.historyModel({
      itemId: saved._id,
      itemName: saved.name,
      action: 'AJOUT INITIAL',
      quantityChanged: saved.quantity,
      user: userId,
    }).save();

    this.gateway.broadcastUpdate(saved);
    return saved;
  }

  // 2. FindAll - Matches Slide 13: "Offrir une visibilité en temps réel"
  async findAll(userId: string) {
    return this.inventoryModel.find({ owner: userId }).exec();
  }

  // 3. UpdateQuantity - Matches Slide 15: "Suivi des quantités" & "Alertes"
  // Added 'userId' and 'note' to track WHO changed WHAT and WHY
  async updateQuantity(id: string, qty: number, userId: string, note: string = 'MODIFICATION MANUELLE') {
    const item = await this.inventoryModel.findById(id);
    if (!item) {
      throw new NotFoundException(`Item with ID ${id} not found`);
    }

    const oldQty = item.quantity;
    item.quantity = qty;
    const updated = await item.save();

    // STRATEGIC ADDITION: Log History (Slide 15: Historique des mouvements)
    await new this.historyModel({
      itemId: updated._id,
      itemName: updated.name,
      action: note,
      quantityChanged: updated.quantity - oldQty,
      user: userId,
    }).save();

    // BROADCAST THE UPDATE
    this.gateway.broadcastUpdate(updated);

    // TRIGGER SMART ALERT (Slide 15: "Alertes de stock minimum")
    if (updated.quantity <= updated.minThreshold) {
      this.gateway.server.emit('low-stock-alert', {
        itemId: updated._id,
        name: updated.name,
        message: `⚠️ ATTENTION: Stock critique pour ${updated.name}!`,
        currentQty: updated.quantity,
        threshold: updated.minThreshold
      });
    }

    return updated;
  }

  // 4. Assign to Project - Matches Slide 16: "Lien direct entre stock et projets"
  async assignToProject(itemId: string, projectId: string, qtyNeeded: number, userId: string) {
    const item = await this.inventoryModel.findById(itemId);
    const project = await this.projectModel.findById(projectId);

    if (!item || !project) throw new NotFoundException('Élément ou Projet introuvable');

    const newQty = item.quantity - qtyNeeded;

    // Use updateQuantity to trigger the alert and the history log automatically
    return this.updateQuantity(
      itemId, 
      newQty, 
      userId, 
      `AFFECTATION: Projet ${project.projectName}`
    );
  }

  // 5. Get History - Matches Slide 15: "Historique des mouvements"
  async getHistory(userId: string) {
    return this.historyModel.find({ user: userId }).sort({ createdAt: -1 }).exec();
  }
}
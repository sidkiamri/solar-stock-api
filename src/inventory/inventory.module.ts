import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { InventoryGateway } from './inventory.gateway';
import { Inventory, InventorySchema } from './schemas/inventory.schema';
import { StockHistory, StockHistorySchema } from './schemas/history.schema'; // Historique
import { Project, ProjectSchema } from './schemas/project.schema';           // Gestion Projets

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inventory.name, schema: InventorySchema },
      { name: StockHistory.name, schema: StockHistorySchema },
      { name: Project.name, schema: ProjectSchema },
    ]),
  ],
  controllers: [InventoryController],
  providers: [InventoryService, InventoryGateway],
})
export class InventoryModule {}
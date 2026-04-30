import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminLog } from './entities/admin-log.entity';
import { User } from '../users/entities/user.entity';
import { Listing } from '../listings/entities/listing.entity';
import { Report } from '../reports/entities/report.entity';
import { Conversation } from '../chat/entities/conversation.entity';
import { AdminController } from './controllers/admin.controller';
import { AdminService } from './services/admin.service';
import { AdminGuard } from './guards/admin.guard';

@Module({
  imports: [TypeOrmModule.forFeature([AdminLog, User, Listing, Report, Conversation])],
  controllers: [AdminController],
  providers: [AdminService, AdminGuard],
  exports: [AdminService, AdminGuard],
})
export class AdminModule {}

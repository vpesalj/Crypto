import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { InvestmentsService } from './investments/investments.service';
import { PortfolioHistoryService } from './portfolios/portfolioHistory.service';
import { PortfoliosService } from './portfolios/portfolios.service'
import { PrismaService } from './prisma.service';
import { UsersService } from './users/users.service';
import { ScheduleModule } from '@nestjs/schedule';
@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService, PortfoliosService, PrismaService, InvestmentsService, UsersService, PortfolioHistoryService],
})
export class AppModule {}

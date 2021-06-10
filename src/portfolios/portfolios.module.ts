import { Module } from '@nestjs/common';
import { PortfoliosService } from './portfolios.service';
import { PrismaService } from './../prisma.service';

@Module({
    imports: [PrismaService],
    controllers: [],
    providers: [PortfoliosService],
})
export class PortfoliosModule {}
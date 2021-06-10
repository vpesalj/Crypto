import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import {
    PortfolioHistory,
    Portfolio,
    Prisma
  } from '@prisma/client';


@Injectable()
export class PortfolioHistoryService {
  constructor(private prisma: PrismaService) {}
 


  async createPortfolioHistory(data: Prisma.PortfolioHistoryCreateInput ): Promise<PortfolioHistory> {
    console.log(data);
    return this.prisma.portfolioHistory.create({
        data,
    });
  } 
  

  

 

  

  
}
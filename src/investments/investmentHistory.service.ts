import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import {
    InvestmentHistory,
    Investment,
    Prisma
  } from '@prisma/client';


@Injectable()
export class InvestmentHistoryService {
  constructor(private prisma: PrismaService) {}
 


  async createInvestmentHistory(data: Prisma.InvestmentHistoryCreateInput ): Promise<InvestmentHistory> {
    console.log(data);
    return this.prisma.investmentHistory.create({
        data,
    });
  } 
  

  

 

  

  
}
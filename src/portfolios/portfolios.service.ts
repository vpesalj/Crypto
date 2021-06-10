import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule'
import { PrismaService } from './../prisma.service';
import {
    Portfolio,
    PortfolioHistory,
    Prisma,Investment
  } from '@prisma/client';


@Injectable()
export class PortfoliosService {
  constructor(private prisma: PrismaService) {}
 
  
 async portfolioValueSum(idd) {
    const investments  = await this.prisma.investment.findMany({
      where: {portfolioId : idd},
    });
    let valueSum = 0;
    investments.forEach(element => {
      valueSum = valueSum + element.value;
    });
    return valueSum;
    
  }
  /*@Cron('45 * * * * *')
  handleCron() {
    console.log("Scheduleerrrrr");
  }*/

  async portfolio(idd){
    return this.prisma.portfolio.findUnique({
      where: {id : idd},
    });
  }


  async createPortfolio(data: Prisma.PortfolioCreateInput): Promise<Portfolio> {
    return this.prisma.portfolio.create({
        data,
    });
  } 

  async updatePortfolio(params: {
    where: Prisma.PortfolioWhereUniqueInput;
    data: Prisma.PortfolioUpdateInput;
  }): Promise<Portfolio> {
    const { data, where } = params;
    return this.prisma.portfolio.update({
      data,
      where,
    });
  }
  

  

 

  

  
}
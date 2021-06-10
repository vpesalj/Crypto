import { Injectable } from '@nestjs/common';
import { PrismaService } from './../prisma.service';
import {
    Investment,
    Prisma,
  } from '@prisma/client';


@Injectable()
export class InvestmentsService {
  constructor(private prisma: PrismaService) {}


  
async createInvestment(data: Prisma.InvestmentCreateInput): Promise<Investment> {
    return this.prisma.investment.create({
        data,
    });
}

  
async investment(postWhereUniqueInput: Prisma.InvestmentWhereUniqueInput): Promise<Investment | null> {
  return this.prisma.investment.findUnique({
    where: postWhereUniqueInput,
  });
}
async investmentByName(shortName) {
  let investmentsToRead = [];
  const investments = await this.investments();
  investments.forEach(element => {
    if(element.shortNameHandle == shortName){
        investmentsToRead.push(element);
    }
    });
  
  return investmentsToRead;
}

async investments(){
 
  return this.prisma.investment.findMany({
    
  });
}


async updateInvestment(params: {
  where: Prisma.InvestmentWhereUniqueInput;
  data: Prisma.InvestmentUpdateInput;
}): Promise<Investment> {
  const { data, where } = params;
  return this.prisma.investment.update({
    data,
    where,
  });
}

async deleteInvestment(params: {
  where: Prisma.InvestmentWhereUniqueInput;
  data: Prisma.InvestmentUpdateInput;
}): Promise<Investment> {
  const { data, where } = params;
  return this.prisma.investment.update({
    data,
    where,
  });
}
  

 

  

  
}
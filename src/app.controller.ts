import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AppService } from './app.service';
import { InvestmentsService } from './investments/investments.service';
import { PortfoliosService } from './portfolios/portfolios.service';
import { PortfolioHistoryService} from './portfolios/portfolioHistory.service'
import { InvestmentHistoryService } from './investments/investmentHistory.service';
import { UsersService } from './users/users.service';
import { Investment as InvestmentModel, Portfolio as PortfolioModel, User as UserModel } from '@prisma/client';
import { Cron } from '@nestjs/schedule';
const http = require('http');
const bcrypt = require('bcrypt');

@Controller()
export class AppController {
  constructor(
    private readonly investmentsService: InvestmentsService,
    private readonly portfoliosService: PortfoliosService,
    private readonly portfolioHistoryService: PortfolioHistoryService,
    private readonly usersService: UsersService,
    private readonly investmentHistoryService : InvestmentHistoryService,
    
  ) {}
  
  @Post('user')
  async createUser(
    @Body() userData: { name: string; password: string; surname: string, email: string; phoneNumber: string },
  ): Promise<UserModel> {

    userData.password = await bcrypt.hash(userData.password, 12);
    return this.usersService.createUser(userData);
  }

  @Get('investment/:id')
  async getInvestmentById(@Param('id') id: string): Promise<InvestmentModel> {
    return this.investmentsService.investment({ id: Number(id) });
  }
  
  @Get('allInvestments')
  async getInvestments(){
    
    return this.investmentsService.investments();
  }
  @Post('portfolio')
  async createPortfolio(
    @Body() portfolioData: { value?: number, userId: number },
  ): Promise<PortfolioModel> {
    return this.portfoliosService.createPortfolio(portfolioData);
  }

  @Put('portfolio/:id')
  async updatePortfolio(@Body() portfolioData: { },
   @Param('id') id: number): Promise<PortfolioModel> {
    const val = await this.portfoliosService.portfolioValueSum(id*1);
    const previousPortfolio = await this.portfoliosService.portfolio(id*1);
    
    const DateNow = Date.now();
    let port = { value: previousPortfolio.value , date :new Date(DateNow), portfolioId : previousPortfolio.id } 
    await this.portfolioHistoryService.createPortfolioHistory(port);
    return this.portfoliosService.updatePortfolio({
      where: { id: Number(id) },
      data: { value : Number(val) },
    });
  }
  //   Update for portfolio when automatic trigger is activated
  async updatePortfolioCrypto(id): Promise<PortfolioModel> {
    const val = await this.portfoliosService.portfolioValueSum(id*1);
    const previousPortfolio = await this.portfoliosService.portfolio(id*1);
    
    const DateNow = Date.now();
    let port = { value: previousPortfolio.value , date :new Date(DateNow), portfolioId : previousPortfolio.id } 

    await this.portfolioHistoryService.createPortfolioHistory(port);
    return this.portfoliosService.updatePortfolio({
      where: { id: Number(id) },
      data: { value : Number(val) },
    });
  }

  @Post('investment')
  async createInvestment(
    @Body() investmentData: { name: string; shortNameHandle : string; pricePerUnit: number; amount: number; value: number; portfolioId: number; },
  ): Promise<InvestmentModel> {
    investmentData.value = investmentData.pricePerUnit * investmentData.amount;
    return this.investmentsService.createInvestment(investmentData);
  }

  /*  Updating investment  */
  @Put('investment/:id')
  async publishInvestment(@Body() investmentData: { name: string; shortNameHandle : string; pricePerUnit: number; amount: number; value: number; portfolioId: number; date : Date },
   @Param('id') id: string): Promise<InvestmentModel> {
    investmentData.value = investmentData.pricePerUnit * investmentData.amount;
    const DateNow = Date.now();
    console.log(investmentData.date);
    return this.investmentsService.updateInvestment({
      where: { id: Number(id) },
      data: { name: investmentData.name,
              shortNameHandle: investmentData.shortNameHandle,
              date : investmentData.date,
              pricePerUnit : investmentData.pricePerUnit,
              amount : investmentData.amount,
              value : investmentData.value },
    });
  }

  @Delete('investment/:id')
  async deleteInvestment(
   @Param('id') id: string): Promise<InvestmentModel> {

    return this.investmentsService.updateInvestment({
      where: { id: Number(id) },
      data: { deleted : true },
    });
  }

  /*---------------Automatic crypto currency-------------------------------*/
  // Read cryptovalues every minute, in 10th second
  @Cron('10 * * * * *')
  handleCron() {
    this.getCryptos();
  }
   getCryptos(){
  
  const rp = require('request-promise');
  const requestOptions = {
    method: 'GET',
    uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest',
    qs: {
      'start': '1',
      'limit': '200',
      'convert': 'USD'
    },
    headers: {
      'X-CMC_PRO_API_KEY': '0579245e-a5bf-4b8b-8ccd-3d55311db2e6'
    },
    json: true,
    gzip: true
  };
  
  rp(requestOptions).then(response => {
    response.data.forEach(async element => {
      let investments = await this.investmentsService.investmentByName(element.symbol);
      
         investments.forEach(async element2 => {
           const DateThen = element2.date;
          let invest = { name: element2.name ,shortNameHandle : element2.shortNameHandle ,date :new Date(DateThen),pricePerUnit : element2.pricePerUnit, amount : element2.amount, value: element2.value, deleted : element2.deleted, investmentId : element2.id} 

            element2.pricePerUnit = element.quote.USD.price;
            element2.value = element2.pricePerUnit * element2.amount;
            const DateNow = Date.now();
           let newInvestment= await this.investmentsService.updateInvestment({
              
              where: { id: Number(element2.id) },
              data: { pricePerUnit: element2.pricePerUnit,
                      value : element2.value,
                      date : new Date(DateNow) },
            });
            
            await this.investmentHistoryService.createInvestmentHistory(invest);
            this.updatePortfolioCrypto(element2.portfolioId);

         });
  })

  })
  
  }

}




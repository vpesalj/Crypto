import {
    Controller,
    Post,
    Body,
    Get,
    Param,
    Patch,
    Delete,
  } from '@nestjs/common';
  
  import { InvestmentsService } from './investments.service';
  
  @Controller('investments')
  export class InvestmentsController {
    constructor(private readonly investmentsService: InvestmentsService) {}
  
    
  }
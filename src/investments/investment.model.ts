export class Investment {
    constructor(
      public id: number,
      public name: string,
      public shortNameHandle: string,
      public date: Date,
      public pricePerUnit: string,
      public amount: string,
      public userId: Date,
    ) {}
  }
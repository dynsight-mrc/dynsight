import { Injectable } from '@nestjs/common';

@Injectable()
export class FunctionSharedService {
  constructor() {}

  async forEachAsync(arr: any[], fn: Function,...args:any[]) {
    return arr.reduce(
      (promise, value) => promise.then(() => fn(value,...args)),
      Promise.resolve(),
    );
  }
  mapAsync = async(arr: any[], fn: any,...args:any[]): Promise<any[]>=> {
    return Promise.all(arr.map((ele)=>fn(ele,...args)));
  }


  // data are send with the form of (object of arrays) ex {firstName:[],lastName[],password:[], role:[]}
  // we need to ensure arrays are equal in legnth cause we need construct user object data by index
  
  checkAllObjectFieldsHasSameLength(obj: Record<string,(string|number)[]>) {
    let attributesLegnth = Object.values(obj).map(ele=>ele.length)
    return attributesLegnth
      .map((val, index, arr) => val === arr[0])
      .reduce((acc, val) => acc && val, true);
  }
}

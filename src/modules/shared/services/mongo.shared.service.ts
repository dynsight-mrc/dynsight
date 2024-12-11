import { Injectable } from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';

@Injectable()
export class MongoSharedService {
  constructor() {}

  // Retrieve automatically the fields that refer to another document
  // to be able to populate them automatically
  getReferenceFields = (model: Model<any>): string[] => {
    const schema = model.schema;
    const referenceFields = Object.keys(schema.paths).filter((path) => {
      const field = schema.paths[path];
      return field.options && field.options.ref;
    });

    return referenceFields;
  };

  // We need to have mongo ObjectId instead of strings
  // this function transform object with attribute ends WITH Id 
  // from Mongodb id string => mongo ObjectId that can be consumed by mongoose functions
  transformObjectStringIdsToMongoObjectIds = (obj:Record<string,any>):Record<string,any>=>{
    
      return Object.keys(obj).reduce((acc,val)=>{
        
          if(val.endsWith("Id")|| val==="id"){
            acc[val]= mongoose.Types.ObjectId.createFromHexString(obj[val])
          }else{
            acc[val] = obj[val]
          }
            return acc
      },{})
  }

  // If an object with reference attribute is populated 
  // we transfomr that attribute name by removing the Id (ex: buildingId =>)
  transformIdAttributes = (obj: Record<string, any>) => {
    
    if (Array.isArray(obj)) {
      // If it's an array, recursively apply the function to each element
      return obj.map((item) => this.transformIdAttributes(item));
    } else if (obj !== null && typeof obj === 'object') {
      // If it's an object, iterate through its keys
      return Object.keys(obj).reduce((acc, key) => {
        let newKey = key;
        let value = obj[key];

        // If the key ends with "Id", rename the key

        if (typeof value === 'object' && !Types.ObjectId.isValid(value)) {
          if (key.endsWith('Id')) {
            newKey = key.slice(0, -2);
          }
          acc[newKey] = this.transformIdAttributes(value);
        } else if (Types.ObjectId.isValid(value)) {
          acc[key] = value;
        } else {
          acc[key] = value;
        }

        return acc;
      }, {});
    } else {
      // If it's not an object or array, return it as is
      return obj;
    }
  };
}

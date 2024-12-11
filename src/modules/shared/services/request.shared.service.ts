import { Injectable } from '@nestjs/common';
import mongoose from 'mongoose';
import { RequestQueryField } from '../dto/request-quert-field.dto';

@Injectable()
export class RequestSharedService {
  constructor() {}

 formatQueryParamsArrayToMongoFilterObject = (
    fields: string | undefined,
  ): Record<string, any> | undefined => {
    if (!fields) return undefined;

    let _JsonFields = decodeURIComponent(fields);

    let _fields: Record<string, any>;
    try {
      _fields = JSON.parse(_JsonFields);
      
    } catch (error) {
      throw new Error('Error while parsing request query params');
    }

    let obj = {};
    
    _fields.forEach((field:Record<string,any>) => {
      if (field.name === '_id') {
        try {
          obj['_id'] = mongoose.Types.ObjectId.createFromHexString(field.value);
        } catch (error) {
          throw new Error(
            'Error while creating mongodb Object, hex should be 24 chars',
          );
        }
      }
      if (field.name.includes('Id')) {
        try {
          obj[field.name] = mongoose.Types.ObjectId.createFromHexString(
            field.value,
          );
        } catch (error) {
          throw new Error(
            'Error while creating mongodb Object, hex should be 24 chars',
          );
        }
      } else {
        obj[field.name] = field.value;
      }
    });
    
    return obj;
  };
}

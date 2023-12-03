import { IsBoolean, IsEnum } from "class-validator";

enum CoilValue{
    FALSE,
    TRUE
}

export class WriteCoilDto{
    
    @IsEnum(CoilValue)
    value:CoilValue
}
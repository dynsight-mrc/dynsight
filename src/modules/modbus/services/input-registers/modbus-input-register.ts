import ModbusRTU from 'modbus-serial';
import { DataType } from '../../dtos/enums/data-types.enum';

export class ModbusInputRegister {
  constructor(
    private client: ModbusRTU,
    private startAddress: string,
    private inputQuantity: string,
    private endianness: boolean,
    private dataType: DataType | string,
  ) {}

  public async readInputRegister() {
    if (this.dataType === DataType.UNSIGNED_32BIT_INTEGER) {
      return this.readUnsigned32Integer();
    }
    throw new Error(`cannot parse datatype ${this.dataType}`);
  }

  private async readUnsigned32Integer() {
    try {
      let data = await this.client.readInputRegisters(
        parseInt(this.startAddress),
        parseInt(this.inputQuantity),
      );

      let hexValue = this.concatenateValue(data.data);

      let byteArray = this.hexToArrayOfFour(hexValue);

      return this.interpretFloat32(byteArray).toFixed(3);
    } catch (error) {
      throw new Error(error.message);
    }
  }

  private decimalToHex(decimaNumber: number) {
    let hexNumber = decimaNumber.toString(16);

    return hexNumber.padStart(4, '0');
  }

  private hexToArrayOfFour(hexNumber: string) {
    let byteArray = [];
    for (let i = 0; i < hexNumber.length; i += 2) {
      byteArray.push(parseInt(hexNumber.substring(i, i + 2), 16));
    }
    return byteArray;
  }

  private interpretFloat32(bytes) {
    // Ensure that the input has exactly 4 bytes
    if (bytes.length !== 4) {
      throw new Error('Input must be a 4-byte array');
    }

    // Create an ArrayBuffer with 4 bytes
    let buffer = new ArrayBuffer(4);

    // Create a DataView to work with the buffer
    let dataView = new DataView(buffer);
    // Set the bytes into the buffer using setUint8
    for (let i = 0; i < 4; i++) {
      dataView.setUint8(i, bytes[i]);
    }

    // Get the float32 value from the DataView
    let floatValue = dataView.getFloat32(0);
    return floatValue;
  }

  private concatenateValue(array: number[]): string {
    let hexArray = array.map((element) => this.decimalToHex(element));

    if (this.endianness) {
      return hexArray.join('');
    }
    return hexArray.reverse().join('');
  }

  public closeConnection() {
    this.client.close((err) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log('Modbus Connection Closed');
    });
  }
}

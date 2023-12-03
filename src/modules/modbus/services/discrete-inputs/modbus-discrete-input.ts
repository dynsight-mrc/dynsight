import ModbusRTU from 'modbus-serial';

export class ModbusDiscreteInput {
  constructor(
    private client: ModbusRTU,
    private startAddress: number,
    private inputQuantity: number,
  ) {}

  public async readInputRegister() {
    try {
      let data = await this.client.readDiscreteInputs(
        this.startAddress,
        this.inputQuantity,
      );
      console.log(data.data);

      return data.data[0];
    } catch (error) {
      throw new Error(error);
    }
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

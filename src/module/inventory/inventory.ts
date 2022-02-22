export interface IInventory {
  inventoryid: number;
  spec_d: string;
  materials_d: string;
  remark: string;
  remarkmx: string;
  qty: number;
  updatedAt: Date;
  updater: string;
  latest_sale_price: number;
  productid: number;
  clientid: number;
  warehouseid: number;
}

export class Inventory implements IInventory {
  inventoryid: number;
  spec_d: string;
  materials_d: string;
  remark: string;
  remarkmx: string;
  qty: number;
  updatedAt: Date;
  updater: string;
  latest_sale_price: number;
  productid: number;
  clientid: number;
  warehouseid: number;
}

export interface IFindInventory extends IInventory {
  warehousename: string;
  clientcode: string;
  clientname: string;
  productcode: string;
  productname: string;
  materials: string;
  spec: string;
  unit: string;
  packunit: string;
  packqty: number;
  m3: number;
  length: number;
  width: number;
  height: number;
}

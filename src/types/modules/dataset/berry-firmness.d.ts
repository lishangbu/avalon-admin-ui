export interface BerryFirmness {
  id: number;
  internalName: string;
  name: string;
}

export interface BerryFirmnessQuery extends PageRequest{
  internalName?: string;
  name?: string;
}

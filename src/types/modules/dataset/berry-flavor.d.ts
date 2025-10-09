export interface BerryFlavor {
  id: number;
  internalName: string;
  name: string;
}

export interface BerryFlavorQuery extends PageRequest{
  internalName?: string;
  name?: string;
}

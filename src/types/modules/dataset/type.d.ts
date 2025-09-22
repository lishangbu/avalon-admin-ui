export interface Type {
  id: number;
  internalName: string;
  name: string;
}

export interface TypeQuery extends PageRequest{
  internalName?: string;
  name?: string;
}

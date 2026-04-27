export interface Ilevel{
      id?: string;
    name: string;
    imageUrl: string;
    order: number;
}

export interface LevelRes{
   message:string,
   data:Ilevel[]
}

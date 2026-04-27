export interface ICategory {
  id?: string;
  name: string;
  imageUrl: string;
}

export interface CategoryRes {
  message: string;
  data: ICategory[];
}
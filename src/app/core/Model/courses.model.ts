

export interface ICourse {
  id?: string;
  name: string;
  imageUrl: string;
  order: number;
  levelId: string;
  categoryId: string;
}

export interface CourseRes {
  message: string;
  data: ICourse[];
}


export interface ILesson {
  id?: string;
  title: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  order: number;
  courseId: string;
}

export interface LessonRes {
  message: string;
  data: ILesson[];
}
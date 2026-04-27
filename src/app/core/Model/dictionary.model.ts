export interface IDictionary {
  id?: string;
  word: string;
  category: string;
  thumbnailUrl?: string;
  videoUrl?: string;
}

export interface DictionaryRes {
  message: string;
  data: IDictionary[];
}
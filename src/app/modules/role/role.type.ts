export default interface RoleType {
  _id: string;
  name: Name;
  priority: number;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

interface Name {
  fr: string;
  en: string;
}

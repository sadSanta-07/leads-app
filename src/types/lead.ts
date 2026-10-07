export type Lead = {
  id: string;
  created_time?: string;
  field_data?: { name: string; values: string[] }[];
};
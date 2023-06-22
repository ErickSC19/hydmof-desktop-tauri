import { z } from 'zod';

type Year = {
  year_id?: string;
  from_date?: string;
  to_date?: string;
  employees?: number;
  complete?: boolean;
  months?: number;
};

type YearForm = {
  from_date: string;
  to_date: string;
  employees: number;
};
const yearSchema = z.object({
  fromDate: z.string().min(1, 'Selecciona una fecha de inicio.'),
  toDate: z.string().min(1, 'Selecciona una fecha de termino.'),
  employees: z.number()
});

export {yearSchema}
export type { Year };

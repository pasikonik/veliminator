import { z } from "zod";

export const lifeValueSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  position: z.number().nullable(),
});

export const lifeValuesListSchema = z.object({
  values: z.array(lifeValueSchema),
  lastUpdated: z.string(),
});

export type LifeValue = z.infer<typeof lifeValueSchema>;
export type LifeValuesList = z.infer<typeof lifeValuesListSchema>;

export const csvExportSchema = z.object({
  name: z.string(),
  position: z.number(),
});

export type CsvExportRow = z.infer<typeof csvExportSchema>;

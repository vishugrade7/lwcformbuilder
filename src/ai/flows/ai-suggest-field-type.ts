'use server';

/**
 * @fileOverview This file defines a Genkit flow for suggesting appropriate field types and validation rules based on a given field label or name.
 *
 * - suggestFieldType - An async function that takes a field label as input and returns a suggestion for the field type and validation rules.
 * - SuggestFieldTypeInput - The input type for the suggestFieldType function, which is a string representing the field label.
 * - SuggestFieldTypeOutput - The output type for the suggestFieldType function, which includes the suggested field type and validation rules.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFieldTypeInputSchema = z.string().describe('The label or name of the form field.');
export type SuggestFieldTypeInput = z.infer<typeof SuggestFieldTypeInputSchema>;

const SuggestFieldTypeOutputSchema = z.object({
  fieldType: z.string().describe('The suggested field type (e.g., text, number, email).'),
  validationRules: z.array(z.string()).describe('An array of suggested validation rules for the field.'),
});
export type SuggestFieldTypeOutput = z.infer<typeof SuggestFieldTypeOutputSchema>;

export async function suggestFieldType(input: SuggestFieldTypeInput): Promise<SuggestFieldTypeOutput> {
  return suggestFieldTypeFlow(input);
}

const suggestFieldTypePrompt = ai.definePrompt({
  name: 'suggestFieldTypePrompt',
  input: {schema: SuggestFieldTypeInputSchema},
  output: {schema: SuggestFieldTypeOutputSchema},
  prompt: `You are an expert form configuration assistant. Given the label or name of a form field, you will suggest an appropriate field type and a set of validation rules.

Field Label: {{{$input}}}

Suggest a field type and validation rules appropriate for the field. Consider common field names and their usual data types.

{{#zod descriptions}}{{/zod}}`,
});

const suggestFieldTypeFlow = ai.defineFlow(
  {
    name: 'suggestFieldTypeFlow',
    inputSchema: SuggestFieldTypeInputSchema,
    outputSchema: SuggestFieldTypeOutputSchema,
  },
  async input => {
    const {output} = await suggestFieldTypePrompt(input);
    return output!;
  }
);

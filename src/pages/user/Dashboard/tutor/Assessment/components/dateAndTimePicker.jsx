'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarIcon } from '@radix-ui/react-icons';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

const DateTimePickerSchema = z.object({
  time: z.date({ required_error: 'A date and time is required.' }),
});

export function DateTimePicker({ label, onChange, selected }) {
  const form =
    useForm <
    z.infer <
    typeof DateTimePickerSchema >>
      {
        resolver: zodResolver(DateTimePickerSchema),
        defaultValues: {
          time: selected || undefined,
        },
      };

  function handleDateSelect(date) {
    if (date) {
      form.setValue('time', date);
      onChange(date);
    }
  }

  return (
    <Form {...form}>
      <FormField
        control={form.control}
        name="time"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    className="w-full pl-3 text-left font-normal"
                  >
                    {field.value
                      ? format(field.value, 'MM/dd/yyyy HH:mm')
                      : 'Select date and time'}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={handleDateSelect}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </FormItem>
        )}
      />
    </Form>
  );
}

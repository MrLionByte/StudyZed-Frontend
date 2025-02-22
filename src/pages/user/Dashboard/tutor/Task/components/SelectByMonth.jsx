import { useState } from 'react';
import { MonthPicker } from '@mantine/dates';

const getYearControlProps = (date) => {
  const currentYear = new Date().getFullYear();
  if (date.getFullYear() < 2024 || date.getFullYear() > currentYear) {
    return { disabled: true };
  }
  return {};
};

const getMonthControlProps = (date) => {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  if (date.getFullYear() === currentYear) {
    if (date.getMonth() < currentMonth || date.getMonth() > currentMonth + 1) {
      return { disabled: true };
    }
  }

  return {};
};

function SelectByMonth() {
  const [value, setValue] = useState(null);

  return (
    <MonthPicker
      value={value}
      onChange={setValue}
      getYearControlProps={getYearControlProps}
      getMonthControlProps={getMonthControlProps}
    />
  );
}

export default SelectByMonth;

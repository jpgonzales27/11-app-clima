export type SearchType = {
  city: string;
  country: string;
};

export type Country = {
  code: string;
  name: string;
};

export type Wheather = {
  main: {
    temp: number;
    temp_max: number;
    temp_min: number;
  };
  name: string;
};

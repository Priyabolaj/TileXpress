export const filters = [
  {
    id: "category",
    name: "Category",
    options: [
      { value: "outdoortiles", label: "Outdoor Tiles" },
      { value: "indoor", label: "Indoor Tiles" },
      { value: "bathroomtiles", label: "Bathroom Tiles" },      
    ],
  },

  {
    id: "size",
    name: "Size",
    options: [
      { value: "12x12", label: "12 X 12" },
      { value: "14x14", label: "14 X 14" },
    ],
  },
];
export const singleFilter = [
  {
    id: "price",
    name: "Price",
    options: [
      { value: "159-399", label: "*159 To *399" },
      { value: "399-999", label: "*399 To *999" },
      { value: "999-1999", label: "*999 To *1999" },
      { value: "1999-2999", label: "*1999 To *2999" },
      { value: "3999-4999", label: "3999 To 4999" },
    ],
  },
  {
    id: "disccout",
    name: "Discount Range",
    options: [
      {
        value: "10",
        label: "10% And Above",
      },
      { value: "20", label: "20% And Above" },
      { value: "30", label: "30% And Above" },
      { value: "40", label: "40% And Above" },
      { value: "50", label: "50% And Above" },
      { value: "60", label: "60% And Above" },
      { value: "70", label: "70% And Above" },
      { value: "80", label: "80% And Above" },
    ],
  },
 
];
export const sortOptions = [
  { name: "Price: Low to High", href: "/store?sort=price_low", current: false },
  { name: "Price: High to Low", href: "/store?sort=price_high", current: false },
];
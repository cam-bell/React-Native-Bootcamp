export interface SubItem {
  id: string;
  name: string;
}

export interface Category {
  id: string;
  name: string;
  items: SubItem[];
}

export const categories: Category[] = [
  {
    id: '1',
    name: 'Clothes',
    items: [
      { id: '1-1', name: 'T-Shirts' },
      { id: '1-2', name: 'Pants' },
      { id: '1-3', name: 'Underwear' },
      { id: '1-4', name: 'Socks' },
      { id: '1-5', name: 'Jackets' },
      { id: '1-6', name: 'Swimwear' },
    ],
  },
  {
    id: '2',
    name: 'Documents',
    items: [
      { id: '2-1', name: 'Passport' },
      { id: '2-2', name: 'Visa' },
      { id: '2-3', name: 'ID Card' },
      { id: '2-4', name: 'Travel Insurance' },
      { id: '2-5', name: 'Booking Confirmations' },
    ],
  },
  {
    id: '3',
    name: 'Electronics',
    items: [
      { id: '3-1', name: 'Phone' },
      { id: '3-2', name: 'Charger' },
      { id: '3-3', name: 'Power Bank' },
      { id: '3-4', name: 'Camera' },
      { id: '3-5', name: 'Laptop' },
      { id: '3-6', name: 'Adapters' },
    ],
  },
  {
    id: '4',
    name: 'Toiletries',
    items: [
      { id: '4-1', name: 'Toothbrush' },
      { id: '4-2', name: 'Toothpaste' },
      { id: '4-3', name: 'Shampoo' },
      { id: '4-4', name: 'Soap' },
      { id: '4-5', name: 'Deodorant' },
    ],
  },
];
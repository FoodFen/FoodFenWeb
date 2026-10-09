export const ids = {
  bowl: '1546069901-ba9599a7e63c',
  buddha: '1512621776951-a57141f2eefd',
  pho: '1582878826629-29b7ad1cdc43',
  plate: '1547592180-85f173990554',
  breakfast: '1493770348161-369560ae357d',
  flatlay: '1490645935967-10de6ba17061',
  steak: '1504674900247-0877df9cc836',
  pomegranate: '1511690743698-d9d85f2fbf38',
  table: '1543339308-43e59d6b73a6',
  market: '1498837167922-ddd27525d352',
  berries: '1494390248081-4e521a5940db',
  salad: '1540189549336-e6e99c3679fe',
  ramen: '1569718212165-3a8278d5f624',
  pasta: '1473093295043-cdd812d0e601',
  pancake: '1567620905732-2d1ec7ab7445',
  tacos: '1565299585323-38d6b0865b47',
  greenBowl: '1484980972926-edee96e0960d',
}

export const photoUrl = (id: string, w: number, h?: number) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ''}&q=75`

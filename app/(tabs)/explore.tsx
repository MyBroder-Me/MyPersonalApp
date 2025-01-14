import React from 'react';
import CategoryCard from '@/components/categories/CategoryCard';
import explorerData from '@/components/categories/CategoriesList';

export default function TabTwoScreen() {
  return (
    <>
      {explorerData.map(item => {
        return (
          <CategoryCard
            key={item.name}
            image={item.image}
            name={item.name}
            url={item.url}
          />
        );
      })}
    </>
  );
}

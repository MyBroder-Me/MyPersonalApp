import React from 'react';
import ThemeCard from '@/components/explore/ThemeCard';
import explorerData from '@/components/explore/Categories';

export default function TabTwoScreen() {
  return (
    <>
      {explorerData.map(item => {
        return (
          <ThemeCard
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

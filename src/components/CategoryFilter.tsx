
import React from 'react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

interface CategoryFilterProps {
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
  onCategorySelect: (categoryId: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  selectedCategoryId, 
  onCategorySelect 
}) => {
  return (
    <div className="relative mb-4">
      <ScrollArea className="w-full whitespace-nowrap py-2">
        <div className="flex space-x-2 px-1">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategoryId === category.id ? "default" : "outline"}
              className={
                selectedCategoryId === category.id 
                  ? "bg-white text-black hover:bg-gray-200 hover:text-black rounded-full px-4"
                  : "bg-youtube-card text-white hover:bg-youtube-hover rounded-full px-4 border-youtube-border"
              }
              onClick={() => onCategorySelect(category.id)}
            >
              {category.name}
            </Button>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
};

export default CategoryFilter;

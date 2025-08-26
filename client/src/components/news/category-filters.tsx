import { Button } from "@/components/ui/button";

interface CategoryFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilters({ categories, selectedCategory, onCategoryChange }: CategoryFiltersProps) {
  return (
    <section className="mb-6" data-testid="category-filters">
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "secondary"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className="rounded-full"
            data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
          >
            {category}
          </Button>
        ))}
      </div>
    </section>
  );
}

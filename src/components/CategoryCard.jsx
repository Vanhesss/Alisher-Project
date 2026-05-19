import { Link } from 'react-router-dom';

export default function CategoryCard({ category, large = false }) {
  return (
    <Link
      to={`/catalog?category=${category.id}`}
      className={`group relative overflow-hidden no-underline block ${large ? 'aspect-[4/5]' : 'aspect-[3/4]'} img-zoom`}
    >
      <img
        src={category.image}
        alt={category.name}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent group-hover:from-black/80 transition-all duration-700" />

      <div className="relative h-full flex flex-col justify-end p-6 lg:p-8">
        <span className="text-[9px] font-medium tracking-[0.3em] uppercase text-white/50 mb-2">
          {category.count} позиций
        </span>
        <h3 className="text-white text-base lg:text-lg font-medium leading-tight">
          {category.name}
        </h3>
        <div className="w-0 group-hover:w-8 h-px bg-copper mt-3 transition-all duration-500" />
      </div>
    </Link>
  );
}

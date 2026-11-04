export function CategoryGridSection() {
  const categories = [
    { name: "Women", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80", count: "124 items", link: "/shop?category=Women" },
    { name: "Men", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80", count: "98 items", link: "/shop?category=Men" },
    { name: "Teens", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80", count: "64 items", link: "/shop?category=Teens" },
    { name: "Sneakers", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80", count: "45 items", link: "/shop?category=Sneakers" },
  ];

  return (
    <div className="space-y-6 my-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Browse by Category</h2>
          <p className="text-sm text-muted-foreground">Explore curated collections tailored for everyone</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat, idx) => (
          <a
            key={idx}
            href={cat.link}
            className="group relative h-64 rounded-2xl overflow-hidden shadow-md block border border-border"
          >
            <img
              src={cat.image}
              alt={cat.name}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
              <span className="text-xs text-gray-300 font-medium">{cat.count}</span>
              <h3 className="text-xl font-bold">{cat.name}</h3>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

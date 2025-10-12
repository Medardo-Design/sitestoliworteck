import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Sparkles, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WebsiteModel, Category } from '../types';
import * as Icons from 'lucide-react';

export default function CatalogPage() {
  const [models, setModels] = useState<WebsiteModel[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);

    const [modelsRes, categoriesRes] = await Promise.all([
      supabase
        .from('website_models')
        .select('*, category:categories(*)')
        .order('order_index'),
      supabase.from('categories').select('*').order('name'),
    ]);

    if (modelsRes.data) setModels(modelsRes.data);
    if (categoriesRes.data) setCategories(categoriesRes.data);

    setIsLoading(false);
  };

  const filteredModels = models.filter((model) => {
    const matchesCategory =
      selectedCategory === 'all' || model.category_id === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      model.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      model.description.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Package;
    return IconComponent;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catalogue de modèles</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Explorez notre collection de sites web professionnels prêts à être personnalisés selon vos besoins.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un modèle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              Tous ({models.length})
            </button>
            {categories.map((category) => {
              const Icon = getIcon(category.icon);
              const count = models.filter((m) => m.category_id === category.id).length;

              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>
                    {category.name} ({count})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-md animate-pulse">
                <div className="aspect-video bg-gray-200"></div>
                <div className="p-6 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-6 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredModels.length > 0 ? (
          <>
            <div className="mb-6 text-gray-600">
              {filteredModels.length} modèle{filteredModels.length > 1 ? 's' : ''} trouvé
              {filteredModels.length > 1 ? 's' : ''}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredModels.map((model) => {
                const badges = [];
                if (model.is_new) badges.push({ label: 'Nouveau', color: 'bg-green-500' });
                if (model.is_popular)
                  badges.push({ label: 'Populaire', color: 'bg-orange-500', icon: Star });

                return (
                  <div
                    key={model.id}
                    className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2 group"
                  >
                    <Link to={`/catalogue/${model.slug}`} className="block">
                      <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
                        {model.main_image ? (
                          <img
                            src={model.main_image}
                            alt={model.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Sparkles className="w-16 h-16 text-gray-300" />
                          </div>
                        )}

                        {badges.length > 0 && (
                          <div className="absolute top-3 right-3 flex flex-col gap-2">
                            {badges.map((badge, i) => (
                              <span
                                key={i}
                                className={`flex items-center space-x-1 ${badge.color} text-white text-xs font-semibold px-3 py-1 rounded-full shadow-lg`}
                              >
                                {badge.icon && <badge.icon className="w-3 h-3 fill-current" />}
                                <span>{badge.label}</span>
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-primary-600">
                            {model.category?.name}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {model.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-2 mb-4">{model.description}</p>

                        <div className="flex items-center justify-between">
                          <span className="flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                            <span>Voir les détails</span>
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </span>
                        </div>
                      </div>
                    </Link>

                    <div className="px-6 pb-6">
                      <Link
                        to={`/commander?model=${model.slug}`}
                        className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center px-6 py-3 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 shadow-md"
                      >
                        Commander ce modèle
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucun modèle trouvé</h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche.
            </p>
            <button
              onClick={() => {
                setSelectedCategory('all');
                setSearchQuery('');
              }}
              className="bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

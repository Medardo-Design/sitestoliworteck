import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Users, Zap, CheckCircle, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WebsiteModel } from '../types';

export default function HomePage() {
  const [featuredModels, setFeaturedModels] = useState<WebsiteModel[]>([]);

  useEffect(() => {
    loadFeaturedModels();
  }, []);

  const loadFeaturedModels = async () => {
    const { data, error } = await supabase
      .from('website_models')
      .select('*, category:categories(*)')
      .eq('is_featured', true)
      .order('order_index')
      .limit(3);

    if (error) {
      console.error('Error loading featured models:', error);
    } else {
      setFeaturedModels(data || []);
    }
  };

  return (
    <div className="min-h-screen">
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9zdmc+')] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center space-y-8">
            <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Agence de Communication Digitale</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Votre site web professionnel
              <br />
              <span className="bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text text-transparent">
                en quelques clics
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto">
              Découvrez notre collection de modèles de sites web élégants et performants.
              Design moderne, fonctionnalités complètes, entièrement personnalisables.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/catalogue"
                className="group inline-flex items-center justify-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all hover:scale-105 shadow-xl"
              >
                <span>Découvrir le catalogue</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center space-x-2 bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-semibold hover:bg-white/20 transition-all border border-white/20"
              >
                <span>Nous contacter</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Rapide & Performant</h3>
              <p className="text-gray-600">
                Des sites optimisés pour une vitesse de chargement exceptionnelle et un excellent référencement.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Design Moderne</h3>
              <p className="text-gray-600">
                Interfaces élégantes et contemporaines qui reflètent le professionnalisme de votre entreprise.
              </p>
            </div>

            <div className="text-center p-8 rounded-2xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Personnalisable</h3>
              <p className="text-gray-600">
                Chaque modèle peut être adapté à vos couleurs, contenus et besoins spécifiques.
              </p>
            </div>
          </div>
        </div>
      </section>

      {featuredModels.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Modèles populaires
              </h2>
              <p className="text-xl text-gray-600">
                Découvrez nos modèles les plus appréciés
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredModels.map((model) => (
                <Link
                  key={model.id}
                  to={`/catalogue/${model.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
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
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-primary-600">
                        {model.category?.name}
                      </span>
                      {model.is_popular && (
                        <span className="flex items-center space-x-1 text-xs font-medium text-orange-600 bg-orange-50 px-2 py-1 rounded-full">
                          <Star className="w-3 h-3 fill-current" />
                          <span>Populaire</span>
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors">
                      {model.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2">{model.description}</p>
                    <div className="mt-4 flex items-center text-primary-600 font-medium group-hover:translate-x-2 transition-transform">
                      <span>En savoir plus</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link
                to="/catalogue"
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-600 to-primary-700 text-white px-8 py-4 rounded-xl font-semibold hover:from-primary-700 hover:to-primary-800 transition-all hover:scale-105 shadow-lg"
              >
                <span>Voir tous les modèles</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">150+</div>
              <div className="text-gray-600">Projets réalisés</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">120+</div>
              <div className="text-gray-600">Clients satisfaits</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">5+</div>
              <div className="text-gray-600">Années d'expérience</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold text-primary-600 mb-2">100%</div>
              <div className="text-gray-600">Satisfaction client</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à lancer votre projet ?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Choisissez votre modèle et commandez dès aujourd'hui. Notre équipe vous accompagne à chaque étape.
          </p>
          <Link
            to="/commander"
            className="inline-flex items-center space-x-2 bg-white text-primary-600 px-8 py-4 rounded-xl font-semibold hover:bg-orange-500 hover:text-white transition-all hover:scale-105 shadow-xl"
          >
            <span>Lancez votre projet</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

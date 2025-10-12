import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Sparkles, Star, Tag } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { WebsiteModel } from '../types';

export default function ModelDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const [model, setModel] = useState<WebsiteModel | null>(null);
  const [similarModels, setSimilarModels] = useState<WebsiteModel[]>([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      loadModel(slug);
    }
  }, [slug]);

  const loadModel = async (modelSlug: string) => {
    setIsLoading(true);

    const { data, error } = await supabase
      .from('website_models')
      .select('*, category:categories(*)')
      .eq('slug', modelSlug)
      .maybeSingle();

    if (error) {
      console.error('Error loading model:', error);
    } else if (data) {
      setModel(data);
      setSelectedImage(0);

      const { data: similar } = await supabase
        .from('website_models')
        .select('*, category:categories(*)')
        .eq('category_id', data.category_id)
        .neq('id', data.id)
        .limit(3);

      if (similar) setSimilarModels(similar);
    }

    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="space-y-4">
                <div className="aspect-video bg-gray-200 rounded-2xl"></div>
                <div className="grid grid-cols-4 gap-2">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-video bg-gray-200 rounded-lg"></div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="h-10 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Modèle introuvable</h2>
          <p className="text-gray-600 mb-6">Ce modèle n'existe pas ou a été supprimé.</p>
          <Link
            to="/catalogue"
            className="inline-flex items-center space-x-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Retour au catalogue</span>
          </Link>
        </div>
      </div>
    );
  }

  const allImages = [model.main_image, ...(model.gallery_images || [])].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          to="/catalogue"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Retour au catalogue</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="space-y-4">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
              {allImages[selectedImage] ? (
                <img
                  src={allImages[selectedImage]}
                  alt={model.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Sparkles className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index
                        ? 'border-primary-600 ring-2 ring-primary-200'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${model.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-3 mb-3">
                <span className="text-sm font-medium text-primary-600 bg-primary-50 px-3 py-1 rounded-full">
                  {model.category?.name}
                </span>
                {model.is_new && (
                  <span className="text-sm font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    Nouveau
                  </span>
                )}
                {model.is_popular && (
                  <span className="flex items-center space-x-1 text-sm font-medium text-orange-600 bg-orange-50 px-3 py-1 rounded-full">
                    <Star className="w-3 h-3 fill-current" />
                    <span>Populaire</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{model.title}</h1>
              <p className="text-lg text-gray-600">{model.full_description || model.description}</p>
            </div>

            {model.features && model.features.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <span>Fonctionnalités incluses</span>
                </h2>
                <ul className="space-y-3">
                  {model.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {model.customizable_elements && model.customizable_elements.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-md">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center space-x-2">
                  <Tag className="w-6 h-6 text-primary-600" />
                  <span>Éléments personnalisables</span>
                </h2>
                <ul className="space-y-3">
                  {model.customizable_elements.map((element, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-2"></div>
                      <span className="text-gray-700">{element}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="sticky bottom-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-200">
              <Link
                to={`/commander?model=${model.slug}`}
                className="block w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-center px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 shadow-md text-lg"
              >
                Commander ce modèle
              </Link>
              <p className="text-center text-sm text-gray-500 mt-3">
                Recevez un devis personnalisé sous 24h
              </p>
            </div>
          </div>
        </div>

        {similarModels.length > 0 && (
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">Modèles similaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {similarModels.map((similar) => (
                <Link
                  key={similar.id}
                  to={`/catalogue/${similar.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all hover:-translate-y-2"
                >
                  <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
                    {similar.main_image ? (
                      <img
                        src={similar.main_image}
                        alt={similar.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Sparkles className="w-16 h-16 text-gray-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-sm font-medium text-primary-600">{similar.category?.name}</span>
                    <h3 className="text-xl font-bold text-gray-900 mt-2 group-hover:text-primary-600 transition-colors">
                      {similar.title}
                    </h3>
                    <p className="text-gray-600 line-clamp-2 mt-2">{similar.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

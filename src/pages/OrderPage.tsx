import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Send, User, Mail, Phone, Building2, Target, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Order, WebsiteModel } from '../types';

export default function OrderPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selectedModel, setSelectedModel] = useState<WebsiteModel | null>(null);

  const [formData, setFormData] = useState<Order>({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    company_name: '',
    website_type: '',
    model_reference: '',
    project_goal: '',
    additional_details: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const modelSlug = searchParams.get('model');
    if (modelSlug) {
      loadModel(modelSlug);
    }
  }, [searchParams]);

  const loadModel = async (slug: string) => {
    const { data } = await supabase
      .from('website_models')
      .select('*, category:categories(*)')
      .eq('slug', slug)
      .maybeSingle();

    if (data) {
      setSelectedModel(data);
      setFormData((prev) => ({
        ...prev,
        model_id: data.id,
        model_reference: data.title,
        website_type: data.category?.name || '',
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.first_name.trim()) newErrors.first_name = 'Le prénom est requis';
    if (!formData.last_name.trim()) newErrors.last_name = 'Le nom est requis';

    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "L'email n'est pas valide";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Le téléphone est requis';
    }

    if (!formData.website_type.trim()) {
      newErrors.website_type = 'Le type de site est requis';
    }

    if (!formData.project_goal.trim()) {
      newErrors.project_goal = "L'objectif du projet est requis";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('orders').insert([formData]);

      if (error) throw error;

      setIsSuccess(true);
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Commande envoyée !</h2>
          <p className="text-gray-600 mb-6">
            Merci pour votre demande. Notre équipe vous contactera dans les 24 heures pour discuter de
            votre projet.
          </p>
          <p className="text-sm text-gray-500">Redirection vers l'accueil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Commander un site web</h1>
          <p className="text-lg text-gray-600">
            Remplissez ce formulaire et recevez un devis personnalisé sous 24h
          </p>
        </div>

        {selectedModel && (
          <div className="bg-white rounded-2xl p-6 shadow-md mb-8 flex items-center space-x-4">
            <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl overflow-hidden flex-shrink-0">
              {selectedModel.main_image ? (
                <img
                  src={selectedModel.main_image}
                  alt={selectedModel.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-gray-300" />
                </div>
              )}
            </div>
            <div>
              <p className="text-sm text-primary-600 font-medium">Modèle sélectionné</p>
              <h3 className="text-xl font-bold text-gray-900">{selectedModel.title}</h3>
              <p className="text-sm text-gray-600">{selectedModel.category?.name}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Prénom *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.first_name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                placeholder="Jean"
              />
              {errors.first_name && <p className="text-red-500 text-sm mt-1">{errors.first_name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4 inline mr-2" />
                Nom *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.last_name ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                placeholder="Dupont"
              />
              {errors.last_name && <p className="text-red-500 text-sm mt-1">{errors.last_name}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="w-4 h-4 inline mr-2" />
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                placeholder="jean.dupont@email.com"
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4 inline mr-2" />
                Téléphone / WhatsApp *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
                placeholder="+33 6 12 34 56 78"
              />
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Building2 className="w-4 h-4 inline mr-2" />
              Nom de l'entreprise (optionnel)
            </label>
            <input
              type="text"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Mon Entreprise SARL"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de site *</label>
            <select
              name="website_type"
              value={formData.website_type}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.website_type ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
            >
              <option value="">Sélectionnez un type</option>
              <option value="Site Vitrine">Site Vitrine</option>
              <option value="Site E-commerce">Site E-commerce</option>
              <option value="Site Institutionnel">Site Institutionnel</option>
              <option value="Blog / Magazine">Blog / Magazine</option>
              <option value="Application Web">Application Web</option>
            </select>
            {errors.website_type && <p className="text-red-500 text-sm mt-1">{errors.website_type}</p>}
          </div>

          {selectedModel && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Référence du modèle
              </label>
              <input
                type="text"
                name="model_reference"
                value={formData.model_reference}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-gray-50 outline-none"
                readOnly
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Target className="w-4 h-4 inline mr-2" />
              Objectif du site *
            </label>
            <textarea
              name="project_goal"
              value={formData.project_goal}
              onChange={handleChange}
              rows={4}
              className={`w-full px-4 py-3 rounded-xl border ${
                errors.project_goal ? 'border-red-500' : 'border-gray-300'
              } focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition`}
              placeholder="Ex: Présenter mes services, vendre mes produits en ligne, améliorer ma visibilité..."
            />
            {errors.project_goal && <p className="text-red-500 text-sm mt-1">{errors.project_goal}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MessageSquare className="w-4 h-4 inline mr-2" />
              Précisions supplémentaires (optionnel)
            </label>
            <textarea
              name="additional_details"
              value={formData.additional_details}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition"
              placeholder="Parlez-nous de votre projet, vos attentes, vos préférences..."
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 transition-all hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Envoi en cours...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Envoyer ma demande</span>
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 text-center">
            En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe concernant votre
            projet.
          </p>
        </form>
      </div>
    </div>
  );
}

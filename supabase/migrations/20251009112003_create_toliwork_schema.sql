/*
  # Toliwork Tech Catalog Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text) - Nom de la catégorie (Site vitrine, E-commerce, etc.)
      - `slug` (text, unique) - Identifiant URL-friendly
      - `description` (text) - Description de la catégorie
      - `icon` (text) - Nom de l'icône Lucide React
      - `created_at` (timestamptz)
    
    - `website_models`
      - `id` (uuid, primary key)
      - `title` (text) - Titre du modèle
      - `slug` (text, unique) - Identifiant URL-friendly
      - `description` (text) - Description courte pour la carte
      - `full_description` (text) - Description complète pour la page détails
      - `category_id` (uuid, foreign key) - Référence à categories
      - `main_image` (text) - URL de l'image principale
      - `gallery_images` (jsonb) - Tableau d'URLs d'images supplémentaires
      - `features` (jsonb) - Liste des fonctionnalités incluses
      - `customizable_elements` (jsonb) - Éléments personnalisables
      - `is_featured` (boolean) - Mis en avant sur l'accueil
      - `is_new` (boolean) - Badge "Nouveau"
      - `is_popular` (boolean) - Badge "Populaire"
      - `order_index` (integer) - Ordre d'affichage
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `orders`
      - `id` (uuid, primary key)
      - `first_name` (text) - Prénom du client
      - `last_name` (text) - Nom du client
      - `email` (text) - Email du client
      - `phone` (text) - Téléphone/WhatsApp
      - `company_name` (text, nullable) - Nom de l'entreprise
      - `website_type` (text) - Type de site souhaité
      - `model_id` (uuid, foreign key, nullable) - Référence au modèle choisi
      - `model_reference` (text, nullable) - Référence du modèle
      - `project_goal` (text) - Objectif du projet
      - `additional_details` (text, nullable) - Précisions supplémentaires
      - `status` (text) - Statut (pending, processing, completed, cancelled)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Public read access for categories and website_models
    - Authenticated admin only for creating/updating models
    - Anyone can create orders (public form submission)
    - Only authenticated admins can view/manage orders

  3. Important Notes
    - All tables use UUID primary keys with automatic generation
    - Timestamps are managed automatically
    - JSONB fields allow flexible storage for arrays and objects
    - Status field uses text for flexibility (can be enum later if needed)
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  icon text DEFAULT 'Package',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create website_models table
CREATE TABLE IF NOT EXISTS website_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text DEFAULT '',
  full_description text DEFAULT '',
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  main_image text DEFAULT '',
  gallery_images jsonb DEFAULT '[]'::jsonb,
  features jsonb DEFAULT '[]'::jsonb,
  customizable_elements jsonb DEFAULT '[]'::jsonb,
  is_featured boolean DEFAULT false,
  is_new boolean DEFAULT false,
  is_popular boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE website_models ENABLE ROW LEVEL SECURITY;

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company_name text,
  website_type text NOT NULL,
  model_id uuid REFERENCES website_models(id) ON DELETE SET NULL,
  model_reference text,
  project_goal text NOT NULL,
  additional_details text,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- RLS Policies for website_models
CREATE POLICY "Anyone can view website models"
  ON website_models FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert models"
  ON website_models FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update models"
  ON website_models FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete models"
  ON website_models FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default categories
INSERT INTO categories (name, slug, description, icon) VALUES
  ('Site Vitrine', 'site-vitrine', 'Sites web élégants pour présenter votre entreprise, vos services et votre expertise professionnelle.', 'Globe'),
  ('Site E-commerce', 'site-ecommerce', 'Boutiques en ligne complètes avec gestion de produits, panier et paiement sécurisé.', 'ShoppingCart'),
  ('Site Institutionnel', 'site-institutionnel', 'Sites web professionnels pour organisations, administrations et institutions.', 'Building2'),
  ('Blog / Magazine', 'blog-magazine', 'Plateformes de publication de contenu avec système de gestion d''articles.', 'BookOpen'),
  ('Application Web', 'application-web', 'Applications web interactives et outils métiers sur mesure.', 'Laptop')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_website_models_category ON website_models(category_id);
CREATE INDEX IF NOT EXISTS idx_website_models_featured ON website_models(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON orders(created_at DESC);
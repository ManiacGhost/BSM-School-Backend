-- Create gallery_images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  cloudinary_public_id VARCHAR(255) NOT NULL UNIQUE,
  image_url VARCHAR(500) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_gallery_images_created_at ON gallery_images(created_at DESC);

-- Create contact_enquiries table
CREATE TABLE IF NOT EXISTS contact_enquiries (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_read BOOLEAN DEFAULT FALSE
);

-- Create index on created_at for faster sorting
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_created_at ON contact_enquiries(created_at DESC);

-- Create index on is_read for filtering unread enquiries
CREATE INDEX IF NOT EXISTS idx_contact_enquiries_is_read ON contact_enquiries(is_read);

-- Create blogs_bsm table
CREATE TABLE IF NOT EXISTS public.blogs_bsm (
  id BIGSERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL UNIQUE,
  category_id BIGINT NOT NULL,
  author_id BIGINT NOT NULL,
  keywords TEXT,
  content TEXT NOT NULL,
  thumbnail_url TEXT,
  banner_url TEXT,
  is_popular BOOLEAN DEFAULT FALSE,
  status VARCHAR(20) DEFAULT 'ACTIVE' NOT NULL CHECK (status IN ('DRAFT', 'PUBLISHED', 'SCHEDULED')),
  created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  short_description TEXT,
  reading_time VARCHAR(50),
  image_alt_text VARCHAR(255),
  image_caption TEXT,
  publish_date TIMESTAMPTZ,
  visibility VARCHAR(20) DEFAULT 'PUBLIC' CHECK (visibility IN ('PUBLIC', 'PRIVATE')),
  seo_title VARCHAR(255),
  seo_description TEXT,
  focus_keyword VARCHAR(255),
  canonical_url TEXT,
  meta_robots VARCHAR(20) DEFAULT 'INDEX' CHECK (meta_robots IN ('INDEX', 'NOINDEX')),
  allow_comments BOOLEAN DEFAULT TRUE,
  show_on_homepage BOOLEAN DEFAULT TRUE,
  is_sticky BOOLEAN DEFAULT FALSE
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_slug ON public.blogs_bsm(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_status ON public.blogs_bsm(status);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_created_at ON public.blogs_bsm(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_category_id ON public.blogs_bsm(category_id);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_author_id ON public.blogs_bsm(author_id);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_visibility ON public.blogs_bsm(visibility);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_is_popular ON public.blogs_bsm(is_popular);
CREATE INDEX IF NOT EXISTS idx_blogs_bsm_is_sticky ON public.blogs_bsm(is_sticky);

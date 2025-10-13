-- database/schema.sql

-- Tabla de países
CREATE TABLE IF NOT EXISTS countries (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de ciudades
CREATE TABLE IF NOT EXISTS cities (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  country_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (country_id) REFERENCES countries(id) ON DELETE CASCADE,
  UNIQUE(nombre, country_id)
);

-- Tabla de localidades
CREATE TABLE IF NOT EXISTS localities (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  city_id INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
  UNIQUE(nombre, city_id)
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_cities_country ON cities(country_id);
CREATE INDEX IF NOT EXISTS idx_localities_city ON localities(city_id);

-- Datos de ejemplo
INSERT INTO countries (nombre) VALUES 
  ('USA'),
  ('México'),
  ('Canada')
ON CONFLICT (nombre) DO NOTHING;

INSERT INTO cities (nombre, country_id) VALUES 
  ('New York', 1),
  ('Los Angeles', 1),
  ('Chicago', 1),
  ('Ciudad de México', 2),
  ('Guadalajara', 2),
  ('Monterrey', 2),
  ('Toronto', 3),
  ('Vancouver', 3),
  ('Montreal', 3)
ON CONFLICT (nombre, country_id) DO NOTHING;

INSERT INTO localities (nombre, city_id) VALUES 
  ('Manhattan', 1),
  ('Brooklyn', 1),
  ('Queens', 1),
  ('Hollywood', 2),
  ('Santa Monica', 2),
  ('Beverly Hills', 2),
  ('Loop', 3),
  ('Lincoln Park', 3),
  ('Polanco', 4),
  ('Condesa', 4),
  ('Roma', 4),
  ('Providencia', 5),
  ('Zapopan', 5),
  ('San Pedro', 6),
  ('Santa Catarina', 6),
  ('Downtown', 7),
  ('North York', 7),
  ('Kitsilano', 8),
  ('Gastown', 8),
  ('Old Montreal', 9),
  ('Plateau', 9)
ON CONFLICT (nombre, city_id) DO NOTHING;
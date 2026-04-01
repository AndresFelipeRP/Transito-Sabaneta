-- Script para verificar la estructura y contenido de la base de datos "transito_sabaneta"
USE transito_sabaneta;
SHOW TABLES;
---------------------------

-- Consultar datos de cada tabla para verificar su contenido

USE transito_sabaneta;

-- Propietarios
SELECT * FROM propietario;

-- Personas
SELECT * FROM persona;

-- Empresas
SELECT * FROM empresa;

-- Vehículos
SELECT * FROM vehiculo;

-- Matrículas
SELECT * FROM matricula;

-- Infracciones
SELECT * FROM infraccion;

-- Fuentes de detección
SELECT * FROM fuente_deteccion;

--------------------------------------

-- Limpiar tablas y cargar datos de ejemplo para pruebas

USE transito_sabaneta;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE infraccion;
TRUNCATE TABLE camara_deteccion;
TRUNCATE TABLE agente_transito;
TRUNCATE TABLE fuente_deteccion;
TRUNCATE TABLE matricula;
TRUNCATE TABLE carro_pesado;
TRUNCATE TABLE moto;
TRUNCATE TABLE automovil;
TRUNCATE TABLE vehiculo;
TRUNCATE TABLE empresa;
TRUNCATE TABLE persona;
TRUNCATE TABLE propietario;

SET FOREIGN_KEY_CHECKS = 1;



---------------------------------------




    -- RESETEAR BASE DE DATOS PARA NUEVOS REGISTROS 

USE transito_sabaneta;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE infraccion;
TRUNCATE TABLE camara_deteccion;
TRUNCATE TABLE agente_transito;
TRUNCATE TABLE fuente_deteccion;
TRUNCATE TABLE matricula;
TRUNCATE TABLE carro_pesado;
TRUNCATE TABLE moto;
TRUNCATE TABLE automovil;
TRUNCATE TABLE vehiculo;
TRUNCATE TABLE empresa;
TRUNCATE TABLE persona;
TRUNCATE TABLE propietario;
SET FOREIGN_KEY_CHECKS = 1;

-- ─────────────────────────────────────────
-- PROPIETARIOS
-- ─────────────────────────────────────────
INSERT INTO propietario (identificacion, nombre, direccion, tipo) VALUES
('1035420001', 'Carlos',                 'Calle 50 #30-20, Sabaneta',       'persona'),
('1035420002', 'María',                  'Carrera 43A #12-15, Sabaneta',    'persona'),
('1035420003', 'Andrés',                 'Calle 75 #45-10, Medellín',       'persona'),
('1035420004', 'Lucía',                  'Avenida El Poblado #8-30',         'persona'),
('1035420005', 'Jorge',                  'Calle 30 #22-40, Envigado',       'persona'),
('900123001',  'Transportes Rápidos SAS','Calle 10 #50-30, Itagüí',         'empresa'),
('900123002',  'Logística Andina Ltda',  'Carrera 65 #33-20, Medellín',     'empresa');

INSERT INTO persona (id, apellido, telefono) VALUES
(1, 'García',   '3001234567'),
(2, 'Martínez', '3012345678'),
(3, 'López',    '3023456789'),
(4, 'Ramírez',  '3034567890'),
(5, 'Torres',   '3045678901');

INSERT INTO empresa (id, representante_legal, telefono) VALUES
(6, 'Pedro Suárez',  '6042345678'),
(7, 'Ana Monsalve',  '6043456789');

-- ─────────────────────────────────────────
-- VEHÍCULOS
-- ─────────────────────────────────────────
INSERT INTO vehiculo (placa, marca, modelo, tipo) VALUES
('ABC123', 'Chevrolet',    'Spark',      'automovil'),
('DEF456', 'Renault',      'Logan',      'automovil'),
('GHI789', 'Mazda',        'CX5',        'automovil'),
('JKL012', 'Toyota',       'Corolla',    'automovil'),
('MNO345', 'Yamaha',       'FZ25',       'moto'),
('PQR678', 'Honda',        'CB190',      'moto'),
('STU901', 'Bajaj',        'Pulsar 200', 'moto'),
('VWX234', 'Kenworth',     'T800',       'carro_pesado'),
('YZA567', 'Freightliner', 'Cascadia',   'carro_pesado');

INSERT INTO automovil (id, numero_puertas, tipo_combustible) VALUES
(1, 4, 'Gasolina'),
(2, 4, 'Gasolina'),
(3, 4, 'Gasolina'),
(4, 4, 'Híbrido');

INSERT INTO moto (id, tipo_moto, cilindrada) VALUES
(5, 'Deportiva', 250),
(6, 'Urbana',    190),
(7, 'Deportiva', 200);

INSERT INTO carro_pesado (id, capacidad_carga, tipo_carroceria) VALUES
(8, 25.5, 'Estacas'),
(9, 30.0, 'Furgón');

-- ─────────────────────────────────────────
-- MATRÍCULAS
-- ─────────────────────────────────────────
INSERT INTO matricula (numero_matricula, fecha_matricula, vehiculo_id, propietario_id) VALUES
('MAT-001', '2022-03-15', 1, 1),
('MAT-002', '2021-07-22', 2, 2),
('MAT-003', '2023-01-10', 3, 3),
('MAT-004', '2022-05-18', 4, 4),
('MAT-005', '2021-11-30', 5, 5),
('MAT-006', '2022-08-05', 6, 1),
('MAT-007', '2023-02-14', 7, 2),
('MAT-008', '2020-06-20', 8, 6),
('MAT-009', '2021-09-12', 9, 7);

-- ─────────────────────────────────────────
-- FUENTES DE DETECCIÓN
-- ─────────────────────────────────────────
INSERT INTO fuente_deteccion (ubicacion, tipo) VALUES
('Carrera 50 con Calle 30, Sabaneta',     'agente'),
('Avenida Las Vegas con Calle 50',        'agente'),
('Calle 75 con Carrera 43A, Medellín',    'agente'),
('Autopista Sur Km 10, Sabaneta',         'camara'),
('Avenida El Poblado con Calle 10',       'camara'),
('Carrera 65 con Calle 33, Itagüí',       'camara');

INSERT INTO agente_transito (id, nombre, badge, turno) VALUES
(1, 'Juan Pérez',   'AGT-001', 'Mañana'),
(2, 'Sandra Ríos',  'AGT-002', 'Tarde'),
(3, 'Miguel Cano',  'AGT-003', 'Noche');

INSERT INTO camara_deteccion (id, codigo_camara, coordenadas) VALUES
(4, 'CAM-001', '6.1516° N, 75.6170° W'),
(5, 'CAM-002', '6.2086° N, 75.5659° W'),
(6, 'CAM-003', '6.1652° N, 75.6012° W');

-- ─────────────────────────────────────────
-- INFRACCIONES 2026
-- ─────────────────────────────────────────
INSERT INTO infraccion (fecha_infraccion, descripcion, valor_multa, vehiculo_id, fuente_id) VALUES
('2026-01-05', 'Exceso de velocidad 80km/h en zona de 60',      450000, 1, 4),
('2026-01-12', 'Semáforo en rojo',                              900000, 2, 1),
('2026-01-20', 'No respetar señal de pare',                     450000, 1, 2),
('2026-02-03', 'Exceso de velocidad 100km/h en zona de 80',     450000, 3, 5),
('2026-02-14', 'Conducir hablando por celular',                 450000, 5, 3),
('2026-02-22', 'Estacionamiento en zona prohibida',             225000, 4, 1),
('2026-03-01', 'Exceso de velocidad detectado por cámara',      450000, 6, 4),
('2026-03-10', 'No portar documentos del vehículo',             225000, 7, 2),
('2026-03-12', 'Exceso de carga vehículo pesado',               900000, 8, 3),
('2026-03-12', 'Invasión de carril',                            450000, 2, 5);



-----------------------------------------------------


-- Verificar cantidad de registros en cada tabla

SELECT 'propietarios' AS tabla, COUNT(*) AS registros FROM propietario
UNION ALL
SELECT 'vehiculos',    COUNT(*) FROM vehiculo
UNION ALL
SELECT 'matriculas',   COUNT(*) FROM matricula
UNION ALL
SELECT 'infracciones', COUNT(*) FROM infraccion;
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE product (

    id UUID PRIMARY KEY,

    nome VARCHAR(255) NOT NULL,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    categoria VARCHAR(100),

    unidade_medida VARCHAR(50),

    quantidade_minima INTEGER NOT NULL DEFAULT 0

);
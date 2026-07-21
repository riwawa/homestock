/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE residents (

    id UUID PRIMARY KEY,

    name VARCHAR(255) NOT NULL,

    house_id UUID NOT NULL,

    CONSTRAINT fk_resident_house
        FOREIGN KEY (house_id)
        REFERENCES house(id)

);
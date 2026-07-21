/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE inventory (

    id UUID PRIMARY KEY,

    house_id UUID NOT NULL,

    CONSTRAINT fk_inventory_house
        FOREIGN KEY (house_id)
        REFERENCES house(id)

);
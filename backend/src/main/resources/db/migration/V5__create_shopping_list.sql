/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE shopping_list (

    id UUID PRIMARY KEY,

    house_id UUID NOT NULL,


    CONSTRAINT fk_shopping_list_house
        FOREIGN KEY (house_id)
        REFERENCES house(id)

);
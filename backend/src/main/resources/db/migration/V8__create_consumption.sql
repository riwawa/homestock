/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE consumption (
    id UUID PRIMARY KEY,
    product_id UUID NOT NULL,
    house_id UUID NOT NULL,
    quantidade_consumida INTEGER NOT NULL,
    date TIMESTAMP NOT NULL,
    CONSTRAINT fk_consumption_product
        FOREIGN KEY (product_id)
        REFERENCES product(id),
    CONSTRAINT fk_consumption_house
        FOREIGN KEY (house_id)
        REFERENCES house(id)
);
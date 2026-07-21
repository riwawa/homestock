/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */
CREATE TABLE shopping_list_items (
    id UUID PRIMARY KEY,
    shopping_list_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity_needed INTEGER NOT NULL,
    CONSTRAINT fk_shopping_list
        FOREIGN KEY (shopping_list_id)
        REFERENCES shopping_list(id),
    CONSTRAINT fk_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);
/* 
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Other/SQLTemplate.sql to edit this template
 */
/**
 * Author:  bialcna
 * Created: Jul 16, 2026
 */

CREATE TABLE inventory_item (

    id UUID PRIMARY KEY,

    inventory_id UUID NOT NULL,

    product_id UUID NOT NULL,

    quantity INTEGER NOT NULL DEFAULT 0,


    CONSTRAINT fk_inventory_item_inventory
        FOREIGN KEY (inventory_id)
        REFERENCES inventory(id),


    CONSTRAINT fk_inventory_item_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)

);
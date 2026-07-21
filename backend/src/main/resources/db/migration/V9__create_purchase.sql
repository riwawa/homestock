
CREATE TABLE purchase (
    id UUID PRIMARY KEY,
    house_id UUID NOT NULL,
    product_id UUID NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    purchase_date TIMESTAMP NOT NULL,
    CONSTRAINT fk_purchase_house
        FOREIGN KEY (house_id)
        REFERENCES house(id),
    CONSTRAINT fk_purchase_product
        FOREIGN KEY (product_id)
        REFERENCES product(id)
);
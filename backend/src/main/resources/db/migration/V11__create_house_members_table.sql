CREATE TABLE house_members (
    id UUID PRIMARY KEY,
    user_id UUID NOT NULL,
    house_id UUID NOT NULL,
    role VARCHAR(20) NOT NULL,
    CONSTRAINT fk_house_member_user
        FOREIGN KEY (user_id) REFERENCES users(id),
    CONSTRAINT fk_house_member_house
        FOREIGN KEY (house_id) REFERENCES house(id),
    CONSTRAINT uq_house_member_user_house
        UNIQUE (user_id, house_id)
);
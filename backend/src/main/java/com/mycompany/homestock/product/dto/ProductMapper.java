package com.mycompany.homestock.product.dto;
import com.mycompany.homestock.product.Product;
import com.mycompany.homestock.product.dto.ProductRequestDTO;
import com.mycompany.homestock.product.dto.ProductResponseDTO;

import org.springframework.stereotype.Component;

@Component
public class ProductMapper {
    
    public Product toEntity(ProductRequestDTO dto) {
        if (dto == null) return null;
        
        Product produto = new Product();
        produto.setNome(dto.name());
        produto.setCategoria(dto.category());
        produto.setUnidadeMedida(dto.unitOfMeasure());
        produto.setQuantidadeMinima(dto.minimumQuantity());
        return produto;
    }
    
    public ProductResponseDTO toResponseDTO(Product produto) {
        if (produto == null) return null;

        return new ProductResponseDTO(
            produto.getId(),
            produto.getNome(),
            produto.getCategoria(),
            produto.getUnidadeMedida(),
            produto.getQuantidadeMinima(),
            produto.isActive()
        );
    }
}

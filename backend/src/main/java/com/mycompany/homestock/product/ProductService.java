package com.mycompany.homestock.product;

import org.springframework.stereotype.Service;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import java.util.*;
import org.springframework.web.server.ResponseStatusException;

/*
    * Responsável por:
    * - cadastrar produtos;
    * - editar informações do produto;
    * - remover produto.
 */

@Service
public class ProductService {
    private final ProductRepository productRepository;
    
    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }
    
    public Product createNewProduct(Product product) {
        return productRepository.save(product);
    }
    
    public Product updateProduct(UUID id, Product updatedData) {

        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        existing.setNome(updatedData.getNome());
        existing.setQuantidadeMinima(updatedData.getQuantidadeMinima());
        existing.setUnidadeMedida(updatedData.getUnidadeMedida());
        existing.setCategoria(updatedData.getCategoria());
        return productRepository.save(existing);
        
    }
    public void deleteProduct(UUID id) {
        Product product = getProductById(id);
        if (!product.isActive()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Produto não encontrado");
        }
        product.setActive(false);
        productRepository.save(product);
    }
    
    public class ProductNotFoundException extends RuntimeException {
        public ProductNotFoundException() {
            super("Produto não encontrado");
        }
    }
    public Product getProductById(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(ProductNotFoundException::new);    
    }
    
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
}

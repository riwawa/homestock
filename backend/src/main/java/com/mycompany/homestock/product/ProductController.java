package com.mycompany.homestock.product;

import com.mycompany.homestock.product.dto.ProductMapper;
import com.mycompany.homestock.product.dto.ProductResponseDTO;
import com.mycompany.homestock.product.dto.ProductRequestDTO;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

/*
    Criar produto
    Buscar produto por ID
    Atualizar produto
    Excluir produto
 */

@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService productService;
    private final ProductMapper productMapper;
    
    public ProductController(ProductService productService, ProductMapper productMapper) {
        this.productService = productService;
        this.productMapper = productMapper;
    }
    
    
    // criar produto
    @PostMapping
    public ResponseEntity<ProductResponseDTO> createProduct(@RequestBody ProductRequestDTO dto) {
        Product productInput = productMapper.toEntity(dto);
        
        Product produtoSalvo = productService.createNewProduct(productInput);
        

        return ResponseEntity.status(201).body(productMapper.toResponseDTO(produtoSalvo));
    }
    
    // buscar produto por id
    @GetMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> getProductById(@PathVariable UUID id){
        Product product = productService.getProductById(id);
        ProductResponseDTO response = productMapper.toResponseDTO(product);
        
        return ResponseEntity.ok(response);
    }
    
    // atualizar produto
    @PutMapping("/{id}")
    public ResponseEntity<ProductResponseDTO> updateProduct(@PathVariable UUID id, @RequestBody ProductRequestDTO dto) {
        Product dadosNovos = productMapper.toEntity(dto);
        Product produtoAtualizado = productService.updateProduct(id, dadosNovos);
        
        return ResponseEntity.ok(productMapper.toResponseDTO(produtoAtualizado));
    }
    
    // excluir produto / desativar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarProduto(@PathVariable UUID id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
    
    @GetMapping
    public ResponseEntity<List<ProductResponseDTO>> getAllProducts() {
        List<ProductResponseDTO> products = productService.getAllProducts()
                .stream()
                .map(productMapper::toResponseDTO)
                .toList();
        return ResponseEntity.ok(products);
    }

}

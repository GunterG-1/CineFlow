package com.backend.CineFlow.CineFlow.cartelera.service;

public class CatalogNotFoundException extends RuntimeException {

    public CatalogNotFoundException(String message) {
        super(message);
    }
}
package com.backend.CineFlow.CineFlow.cartelera.service;

import com.backend.CineFlow.CineFlow.cartelera.dto.BillboardMovieResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.CreateFunctionRequest;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionResponse;
import com.backend.CineFlow.CineFlow.cartelera.dto.FunctionSeatsResponse;

import java.util.List;

public interface CatalogService {

    List<BillboardMovieResponse> obtenerCartelera();

    FunctionSeatsResponse obtenerButacasFuncion(Long functionId);

    FunctionResponse crearFuncion(CreateFunctionRequest request);
}
package com.backend.CineFlow.CineFlow.configuracion;

import com.backend.CineFlow.CineFlow.model.Alimento;
import com.backend.CineFlow.CineFlow.model.Combo;
import com.backend.CineFlow.CineFlow.repository.AlimentoRepositorio;
import com.backend.CineFlow.CineFlow.repository.ComboRepositorio;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AlimentoRepositorio alimentoRepositorio;
    private final ComboRepositorio comboRepositorio;

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos de prueba...");

        // Verificar si ya existen datos
        if (alimentoRepositorio.count() > 0) {
            log.info("Datos ya existen en la base de datos. Saltando inicialización.");
            return;
        }

        // Crear alimentos basados en los snacks del frontend
        List<Alimento> alimentos = new ArrayList<>();
        
        alimentos.add(Alimento.builder()
            .nombre("Palomitas Medianas")
            .descripcion("Palomitas de maíz tostadas frescas medianas")
            .precio(5.99)
            .cantidadDisponible(100)
            .categoria("Snacks")
            .activo(true)
            .rutaImagen("/images/palomitas.jpg")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Refresco")
            .descripcion("Bebida refrescante variada")
            .precio(3.99)
            .cantidadDisponible(150)
            .categoria("Bebidas")
            .activo(true)
            .rutaImagen("/images/refresco.jpg")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Palomitas Extra Grande")
            .descripcion("Palomitas XL extra grandes para compartir")
            .precio(7.99)
            .cantidadDisponible(80)
            .categoria("Snacks")
            .activo(true)
            .rutaImagen("/images/palomitas-xl.jpg")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Dulce")
            .descripcion("Caramelos y chocolates surtidos")
            .precio(4.99)
            .cantidadDisponible(120)
            .categoria("Dulces")
            .activo(true)
            .rutaImagen("/images/dulces.jpg")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Hot Dog")
            .descripcion("Hot dog clásico con toppings variados")
            .precio(5.99)
            .cantidadDisponible(60)
            .categoria("Snacks Salados")
            .activo(true)
            .rutaImagen("/images/hotdog.jpg")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Nachos")
            .descripcion("Nachos crujientes con queso derretido")
            .precio(6.99)
            .cantidadDisponible(70)
            .categoria("Snacks Salados")
            .activo(true)
            .rutaImagen("/images/nachos.jpg")
            .build());

        // Guardar alimentos
        List<Alimento> alimentosGuardados = alimentoRepositorio.saveAll(alimentos);
        log.info("Se han creado {} alimentos", alimentosGuardados.size());

        // Crear combos basados en los snacks del frontend
        List<Combo> combos = new ArrayList<>();

        // Combo 1: Combo Clásico (13.99)
        Combo combo1 = Combo.builder()
            .nombre("Combo Clásico")
            .descripcion("Palomitas + Bebida")
            .precio(13.99)
            .cantidadDisponible(80)
            .activo(true)
            .rutaImagen("/images/combo-clasico.jpg")
            .build();
        combo1.setAlimentos(List.of(alimentosGuardados.get(0), alimentosGuardados.get(1)));
        combos.add(combo1);

        // Combo 2: Combo Premium (18.99)
        Combo combo2 = Combo.builder()
            .nombre("Combo Premium")
            .descripcion("Palomitas XL + Bebida + Dulce")
            .precio(18.99)
            .cantidadDisponible(60)
            .activo(true)
            .rutaImagen("/images/combo-premium.jpg")
            .build();
        combo2.setAlimentos(List.of(alimentosGuardados.get(2), alimentosGuardados.get(1), alimentosGuardados.get(3)));
        combos.add(combo2);

        // Combo 3: Snacks Salados (6.99) - Hot dog / Nachos
        Combo combo3 = Combo.builder()
            .nombre("Snacks Salados")
            .descripcion("Hot dog / Nachos")
            .precio(6.99)
            .cantidadDisponible(70)
            .activo(true)
            .rutaImagen("/images/snacks-salados.jpg")
            .build();
        combo3.setAlimentos(List.of(alimentosGuardados.get(4), alimentosGuardados.get(5)));
        combos.add(combo3);

        // Guardar combos
        List<Combo> combosGuardados = comboRepositorio.saveAll(combos);
        log.info("Se han creado {} combos", combosGuardados.size());
        log.info("Inicialización de datos completada exitosamente");
    }
}

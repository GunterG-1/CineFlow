package com.backend.CineFlow.CineFlow.configuracion;

import com.backend.CineFlow.CineFlow.model.Alimento;
import com.backend.CineFlow.CineFlow.model.Combo;
import com.backend.CineFlow.CineFlow.model.Promotion;
import com.backend.CineFlow.CineFlow.repository.AlimentoRepositorio;
import com.backend.CineFlow.CineFlow.repository.ComboRepositorio;
import com.backend.CineFlow.CineFlow.repository.PromotionRepositorio;
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
    private final PromotionRepositorio promotionRepositorio;

    @Override
    public void run(String... args) throws Exception {
        log.info("Inicializando datos de prueba...");

        // Eliminar datos existentes y re-seedear alimentos y combos (IDs serán autogeneradas)
        log.info("Eliminando alimentos y combos existentes para re-seedear...");
        comboRepositorio.deleteAll();
        alimentoRepositorio.deleteAll();

        List<Alimento> alimentos = new ArrayList<>();

        // Crear los 6 alimentos solicitados (las IDs serán autoincrementales asignadas por la BD)
        alimentos.add(Alimento.builder()
            .nombre("Palomitas Medianas")
            .descripcion("Palomitas de maíz tostadas frescas medianas")
            .precio(5990.0)
            .cantidadDisponible(100)
            .categoria("Snacks")
            .activo(true)
            .rutaImagen("/images/palomitas.jpg")
            .emoji("🍿")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Refresco")
            .descripcion("Bebida refrescante variada")
            .precio(3990.0)
            .cantidadDisponible(150)
            .categoria("Bebidas")
            .activo(true)
            .rutaImagen("/images/refresco.jpg")
            .emoji("🥤")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Palomitas Extra Grande")
            .descripcion("Palomitas XL extra grandes para compartir")
            .precio(7990.0)
            .cantidadDisponible(80)
            .categoria("Snacks")
            .activo(true)
            .rutaImagen("/images/palomitas-xl.jpg")
            .emoji("🍿")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Dulce")
            .descripcion("Caramelos y chocolates surtidos")
            .precio(4990.0)
            .cantidadDisponible(120)
            .categoria("Dulces")
            .activo(true)
            .rutaImagen("/images/dulces.jpg")
            .emoji("🍬")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Hot Dog")
            .descripcion("Hot dog clásico con toppings variados")
            .precio(5990.0)
            .cantidadDisponible(60)
            .categoria("Snacks Salados")
            .activo(true)
            .rutaImagen("/images/hotdog.jpg")
            .emoji("🌭")
            .build());

        alimentos.add(Alimento.builder()
            .nombre("Nachos")
            .descripcion("Nachos crujientes con queso derretido")
            .precio(6990.0)
            .cantidadDisponible(70)
            .categoria("Snacks Salados")
            .activo(true)
            .rutaImagen("/images/nachos.jpg")
            .emoji("🌮")
            .build());

        List<Alimento> alimentosGuardados = alimentoRepositorio.saveAll(alimentos);
        log.info("Se han creado {} alimentos (IDs generadas por la BD)", alimentosGuardados.size());

        // Crear combos y asociar alimentos guardados
        List<Combo> combos = new ArrayList<>();

        Combo combo1 = Combo.builder()
            .nombre("Combo Clásico")
            .descripcion("Palomitas + Bebida")
            .precio(13990.0)
            .cantidadDisponible(80)
            .activo(true)
            .rutaImagen("/images/combo-clasico.jpg")
            .emoji("🍿")
            .build();
        combo1.setAlimentos(List.of(alimentosGuardados.get(0), alimentosGuardados.get(1)));
        combos.add(combo1);

        Combo combo2 = Combo.builder()
            .nombre("Combo Premium")
            .descripcion("Palomitas XL + Bebida + Dulce")
            .precio(18990.0)
            .cantidadDisponible(60)
            .activo(true)
            .rutaImagen("/images/combo-premium.jpg")
            .emoji("🎉")
            .build();
        combo2.setAlimentos(List.of(alimentosGuardados.get(2), alimentosGuardados.get(1), alimentosGuardados.get(3)));
        combos.add(combo2);

        Combo combo3 = Combo.builder()
            .nombre("Snacks Salados")
            .descripcion("Hot dog / Nachos")
            .precio(6990.0)
            .cantidadDisponible(70)
            .activo(true)
            .rutaImagen("/images/snacks-salados.jpg")
            .emoji("🌭")
            .build();
        combo3.setAlimentos(List.of(alimentosGuardados.get(4), alimentosGuardados.get(5)));
        combos.add(combo3);

        List<Combo> combosGuardados = comboRepositorio.saveAll(combos);
        log.info("Se han creado {} combos (IDs generadas por la BD)", combosGuardados.size());

        // Seed promociones si no existen
        // Upsert promociones: actualizar si existe (por title), crear si no existe
        java.util.Map<String, String[]> desired = new java.util.HashMap<>();
        desired.put("Martes de Descuento", new String[]{"50% de descuento en todas las entradas todos los martes","50%","🎟️"});
        desired.put("Combo Familiar", new String[]{"4 entradas + 4 palomitas grandes + 4 bebidas","$45.990","👨‍👩‍👧‍👦"});
        desired.put("Horas Doradas", new String[]{"Descuento en películas antes de las 6 PM","30%","🌅"});
        desired.put("Miembro Vip", new String[]{"Descuentos exclusivos para miembros de pago mensual","$5.990","👑"});

        int created = 0;
        int updated = 0;
        for (var entry : desired.entrySet()) {
            String title = entry.getKey();
            String[] vals = entry.getValue();
            String description = vals[0];
            String discount = vals[1];
            String emoji = vals[2];

            java.util.Optional<com.backend.CineFlow.CineFlow.model.Promotion> existing = promotionRepositorio.findByTitle(title);
            if (existing.isPresent()) {
                com.backend.CineFlow.CineFlow.model.Promotion p = existing.get();
                p.setDescription(description);
                p.setDiscount(discount);
                p.setEmoji(emoji);
                p.setActivo(true);
                promotionRepositorio.save(p);
                updated++;
            } else {
                com.backend.CineFlow.CineFlow.model.Promotion p = com.backend.CineFlow.CineFlow.model.Promotion.builder()
                    .title(title)
                    .description(description)
                    .discount(discount)
                    .emoji(emoji)
                    .activo(true)
                    .build();
                promotionRepositorio.save(p);
                created++;
            }
        }
        log.info("Promociones: creadas={}, actualizadas={}", created, updated);

        // No upsert adicional: ya hemos re-seedeado alimentos y combos con IDs autogeneradas.
        log.info("Inicialización de datos completada exitosamente");
    }
}

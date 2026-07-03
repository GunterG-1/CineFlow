package com.backend.CineFlow.CineFlow.cartelera.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

import java.math.BigDecimal;

public class CreateMovieRequest {

        @JsonAlias({"titulo", "title"})
        private String title;

        @JsonAlias({"sinopsis", "description"})
        private String description;

        @JsonAlias({"genero", "genre"})
        private String genre;

        @JsonAlias({"duracionMinutos", "durationMinutes"})
        private Integer durationMinutes;

        @JsonAlias({"calificacion", "rating"})
        private String rating;

        @JsonAlias({"precio", "price"})
        private BigDecimal price;

        @JsonAlias({"imagenUrl", "imageSrc"})
        private String imageSrc;

        @JsonAlias({"bannerUrl", "bannerSrc"})
        private String bannerSrc;

        @JsonAlias({"enCartelera", "isVisible", "visible"})
        private Boolean visible;

        public String getTitle() {
                return title;
        }

        public void setTitle(String title) {
                this.title = title;
        }

        public String getDescription() {
                return description;
        }

        public void setDescription(String description) {
                this.description = description;
        }

        public String getGenre() {
                return genre;
        }

        public void setGenre(String genre) {
                this.genre = genre;
        }

        public Integer getDurationMinutes() {
                return durationMinutes;
        }

        public void setDurationMinutes(Integer durationMinutes) {
                this.durationMinutes = durationMinutes;
        }

        public String getRating() {
                return rating;
        }

        public void setRating(String rating) {
                this.rating = rating;
        }

        public BigDecimal getPrice() {
                return price;
        }

        public void setPrice(BigDecimal price) {
                this.price = price;
        }

        public String getImageSrc() {
                return imageSrc;
        }

        public void setImageSrc(String imageSrc) {
                this.imageSrc = imageSrc;
        }

        public String getBannerSrc() {
                return bannerSrc;
        }

        public void setBannerSrc(String bannerSrc) {
                this.bannerSrc = bannerSrc;
        }

        public Boolean getVisible() {
                return visible;
        }

        public void setVisible(Boolean visible) {
                this.visible = visible;
        }
}
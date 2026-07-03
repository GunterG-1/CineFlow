package com.backend.CineFlow.CineFlow.util;

public final class AdminRoleUtils {

    private static final String ADMIN_DOMAIN = "@duocuc.cl";

    private AdminRoleUtils() {
    }

    public static boolean isAdminEmail(String correo) {
        return correo != null && correo.trim().toLowerCase().endsWith(ADMIN_DOMAIN);
    }
}
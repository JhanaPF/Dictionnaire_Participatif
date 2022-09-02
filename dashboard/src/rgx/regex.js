export const validEmail = new RegExp(/^[a-z0-9]+@[a-z]+\.[a-z]{2,3}$/);
export const validPassword = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/);
export const validString = new RegExp('[abcdefghijklmnopqrstuvwxyzAZERTYUIOPQSDFGHJKLMWXCVBNéèàôöùáéíóúýÁÉÍÓÚÝ,;:!?./%&]');

/**
 * 
 
    A propos de la regex pour le mot de passe:
        Au moins une lettre majuscule, (?=.*?[A-Z])
        Au moins une lettre minuscule, (?=.*?[a-z])
        Au moins un chiffre, (?=.*?[0-9])
        Au moins un caractère spécial, (?=.*?[#?!@$%^&*-])
        8 caractères minimum .{8,} (avec les ancrages)

*/
export function formatNumber(num: number): string {
    const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];

    // Si le nombre est inférieur à 1000, retourner le nombre avec 2 décimales
    if (num < 1000) {
        return num.toFixed(2);
    }

    // Trouver l'unité appropriée
    const order = Math.floor(Math.log(num) / Math.log(1000));

    // Calculer le nombre formaté
    const formattedNum = (num / Math.pow(1000, order)).toFixed(2);

    // Retourner le nombre avec son unité
    return `${formattedNum}${units[order]}`;
} 
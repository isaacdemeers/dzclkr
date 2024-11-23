export function formatNumber(num: number): string {
    const units = ['', 'K', 'M', 'B', 'T', 'Qa', 'Qi', 'Sx', 'Sp', 'Oc'];

    if (num < 1000) {
        return num.toFixed(1);
    }

    const order = Math.floor(Math.log(num) / Math.log(1000));

    const formattedNum = (num / Math.pow(1000, order)).toFixed(1);

    const cleanNum = formattedNum.endsWith('.0')
        ? formattedNum.slice(0, -2)
        : formattedNum;

    return `${cleanNum}${units[order]}`;
} 